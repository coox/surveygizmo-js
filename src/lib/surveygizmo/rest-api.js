import _ from 'lodash';
import debugFactory from 'debug';
import fetch from 'isomorphic-fetch';
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
  getRestApiUri(path) {
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

  wrapRestApiFetch(method, path, options = {}, callback = undefined) {
    const restApiUri = this.getRestApiUri(path);

    /*
     * SurveyGizmo REST API does not exactly qualify as RESTful:
     *  - resources are fetched using the HTTP GET method
     *  - what one would expect to be the RESTful HTTP method
     *    is passed in as the `_method` query parameter
     * https://apihelp.surveygizmo.com/help/article/link/versions-methods#methods
     */
    restApiUri.addQuery('_method', method);

    /*
     * urijs can not stringify queries along this typical PHP pattern:
     * { obj: { key: value } } => "obj[key]=value"
     * https://github.com/medialize/URI.js/issues/28
     * This pattern being expected by SurveyGizmo, use qs stringify instead
     */
    if (!_.isUndefined(options.body)) {
      restApiUri.query(
        qs.stringify(
          Object.assign({}, restApiUri.query(true), options.body)
        )
      );
    }

    debug(`Fetch: ${method} ${restApiUri.path()}`);
    debug(options.body);
    return fetch(
      restApiUri.toString()
    )
    .then(response => {
      debug(`Fetch: ${method} ${restApiUri.path()}: ${response.status} ${response.statusText}`);
      if (response.status >= 400) {
        throw new Error(
          `REST API responded to ${method} ${restApiUri.path()} with status ${response.status}`
        );
      }
      return response.json();
    })
    .then(result => {
      if (_.isUndefined(result.result_ok)) {
        throw new Error(
          `REST API responded to ${method} ${restApiUri.path()} with undefined result`
        );
      }

      if (!result.result_ok) {
        throw new Error(
          `REST API responded to ${method} ${restApiUri.path()} with error result: `
          + `${result.message} (code ${result.code})`
        );
      }

      return result;
    })
    .then(result => {
      if (_.isUndefined(callback)) {
        return result;
      }
      return callback(null, result);
    })
    .catch(reason => {
      if (_.isUndefined(callback)) {
        throw new Error(reason);
      }
      return callback(reason);
    })
    ;
  },
};

/*
 * () => [,]
 * ({}) => [{},]
 * (() => {}) => [,() => {}]
 * ({}, () => {}) => [{}, () => {}]
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
    return this.wrapRestApiFetch(
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
    return this.wrapRestApiFetch(
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
    return this.wrapRestApiFetch(
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
    return this.wrapRestApiFetch(
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
    return this.wrapRestApiFetch(
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
    return this.wrapRestApiFetch(
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

  return instance;
};

export default restApi;
