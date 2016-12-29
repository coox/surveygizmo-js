import _ from 'lodash';
import debugFactory from 'debug';
import fetch from 'isomorphic-fetch';
import rateLimit from 'function-rate-limit';
import sgConfig from 'config';
import sgDomain from './domain';
import { objects as sgObjects } from './object';
import { objectCalls as sgObjectCalls } from './object-call';
import { names as sgObjectNames } from './object';
import sgUtil from './util';
import qs from 'qs';
import URI from 'urijs';

const debug = debugFactory('surveygizmo:rest-api');

// https://apihelp.surveygizmo.com/help/article/link/versions-methods
const restApiVersion = 'v4';

const prototype = {
  config: Object.assign({}, sgConfig.get('surveygizmo.restApi')),

  uri(path) {
    return new URI(
      {
        protocol: 'https',
        hostname: sgDomain(this.config.regionName).hostname,
        path: `/${restApiVersion}/${path}`,
      }
    )
    .query({
      api_token: this.config.auth.key,
      api_token_secret: this.config.auth.secretKey,
    })
    ;
  },

  fetch(method, path, options = {}) {
    const uri = this.uri(path);

    /*
     * SurveyGizmo REST API does not exactly qualify as RESTful:
     *  - resources are fetched using the HTTP GET method
     *  - what one would expect to be the RESTful HTTP method
     *    is passed in as the `_method` query parameter
     * https://apihelp.surveygizmo.com/help/article/link/versions-methods#methods
     */
    uri.addQuery('_method', method);

    /*
     * urijs can not stringify queries along this typical PHP pattern:
     * { obj: { key: value } } => "obj[key]=value"
     * https://github.com/medialize/URI.js/issues/28
     * This pattern being expected by SurveyGizmo, use qs stringify instead
     */
    if (!_.isUndefined(options.body)) {
      uri.query(
        qs.stringify(
          Object.assign({}, uri.query(true), options.body)
        )
      );
    }

    debug(`Fetch: ${method} ${uri.path()}`);
    debug(options.body);
    return fetch(
      uri.toString()
    )
    .then(response => {
      debug(`Fetch: ${method} ${uri.path()}: ${response.status} ${response.statusText}`);
      const result = response.text();
      if (response.status >= 400) {
        throw new Error(
          `REST API responded to ${method} ${uri.path()} with status ${response.status}`
        );
      }
      return result;
    })
    .then(resultTxt => {
      debug(resultTxt);
      try {
        var result = JSON.parse(resultTxt);
        if (_.isUndefined(result.result_ok)) {
          throw new Error(
            `REST API responded to ${method} ${uri.path()} with undefined result`
          );
        }
        if (!result.result_ok) {
          throw new Error(
            `REST API responded to ${method} ${uri.path()} with error result: `
            + `${result.message} (code ${result.code})`
          );
        }
        return result;
      } catch (e) {
        debug(e.message);
        throw e;
      }
    })
    ;
  },

  query(...args) {
    const fetchArgs = _.dropRight(args, 1);
    const callback = _.last(args);

    const rateLimitedFetchPromise = new Promise(
      (resolve, reject) =>
        this.rateLimitedFetchPromiseResolver(resolve, reject, ...fetchArgs)
    );

    if (_.isUndefined(callback)) {
      // Caller expects a Promise
      return rateLimitedFetchPromise;
    }
    // Caller expects a callback
    return rateLimitedFetchPromise
      .then(result => callback(null, result))
      .catch(reason => callback(reason))
    ;
  },
};

/*
 * () => [{}, undefined]
 * ({}) => [{}, undefined]
 * ({ k: v }) => [{ k: v }, undefined]
 * (() => { return }) => [{}, () => { return }]
 * ({}, () => { return }) => [{}, () => { return }]
 * ({ k: v }, () => { return }) => [{ k: v }, () => { return }]
 */
const assignOptionsAndCallbackFromArgs = (args) => {
  let options = {};
  let callback;

  if (args.length !== 0) {
    if (args.length === 1) {
      if (!_.isFunction(args[0]) && _.isObject(args[0])) {
        options = Object.assign({}, args[0]);
      } else if (_.isFunction(args[0])) {
        callback = args[0];
      } else {
        throw new Error(
          'Invalid argument'
        );
      }
    } else if (args.length === 2) {
      if ((!_.isFunction(args[0]) && _.isObject(args[0])) && _.isFunction(args[1])) {
        options = Object.assign({}, args[0]);
        callback = args[1];
      } else {
        throw new Error(
          'Invalid arguments'
        );
      }
    } else {
      throw new Error(
        'Invalid number of arguments'
      );
    }
  }

  return [options, callback];
};

const objectCallerFactories = {};

objectCallerFactories[sgObjectCalls.LIST.name] = object => ({
  name: `get${_.upperFirst(object.pluralName)}`,
  func(...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    debug(`ObjectCall: ${sgObjectCalls.LIST.name} ${_.upperFirst(object.pluralName)}`);
    debug(options);
    return this.query(
      'GET', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.GET.name] = object => ({
  name: `get${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    options[`${object.name}Id`] = objectId;
    debug(`ObjectCall: ${sgObjectCalls.GET.name} ${_.upperFirst(object.name)}`);
    debug(options);
    return this.query(
      'GET', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.CREATE.name] = object => ({
  name: `create${_.upperFirst(object.name)}`,
  func(objectBody, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    options.body = objectBody;
    debug(`ObjectCall: ${sgObjectCalls.CREATE.name} ${_.upperFirst(object.name)}`);
    debug(options);
    return this.query(
      'PUT', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.UPDATE.name] = object => ({
  name: `update${_.upperFirst(object.name)}`,
  func(objectId, objectBody, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    options[`${object.name}Id`] = objectId;
    options.body = objectBody;
    debug(`ObjectCall: ${sgObjectCalls.UPDATE.name} ${_.upperFirst(object.name)}`);
    debug(options);
    return this.query(
      'POST', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.DELETE.name] = object => ({
  name: `delete${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    options[`${object.name}Id`] = objectId;
    debug(`ObjectCall: ${sgObjectCalls.DELETE.name} ${_.upperFirst(object.name)}`);
    debug(options);
    return this.query(
      'DELETE', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.COPY.name] = object => ({
  name: `copy${_.upperFirst(object.name)}`,
  func(objectId, objectBody, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    options[`${object.name}Id`] = objectId;
    options.body = Object.assign({ copy: 'true' }, objectBody);
    debug(`ObjectCall: ${sgObjectCalls.COPY.name} ${_.upperFirst(object.name)}`);
    debug(options);
    return this.query(
      'POST', `${object.getRoute(options)}`, options, callback
    );
  },
});

sgObjectNames.forEach(objectName => {
  const object = sgObjects[objectName];
  if (!_.isUndefined(object.calls)) {
    Object.keys(object.calls).forEach(objectCallName => {
      if (!sgUtil.isValidObjectCallName(objectCallName)) {
        throw new Error(`SurveyGizmo Object ${objectName} defines invalid call ${objectCallName}`);
      }
      const objectCaller = objectCallerFactories[objectCallName](object);
      prototype[objectCaller.name] = objectCaller.func;
    });
  }
});

const restApi = (configOverrides = {}) => {
  const instance = Object.create(prototype);
  instance.config = Object.assign({}, instance.config, configOverrides);

  // https://apihelp.surveygizmo.com/help/article/link/api-request-limits
  instance.rateLimitedFetchPromiseResolver = rateLimit.call(
    instance,
    instance.config.maximumFetchesPerMinute,
    60000,
    (resolve, reject, ...fetchArgs) =>
      instance.fetch(...fetchArgs)
        .then(result => resolve(result))
        .catch(reason => reject(reason))
  );

  return instance;
};

export default restApi;
