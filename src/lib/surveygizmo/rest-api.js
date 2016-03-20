import _ from 'lodash';
import config from 'config';
import fetch from 'isomorphic-fetch';
import sgDomain from './domain';
import { objects as sgObjects } from './object';
import { objectCalls as sgObjectCalls } from './object-call';
import { names as sgObjectNames } from './object';
import sgUtil from './util';
import URI from 'urijs';

// https://apihelp.surveygizmo.com/help/article/link/versions-methods
const restApiVersion = 'v4';

const prototype = {
  config: Object.assign({}, config.get('restApi')),
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
    return fetch(
      restApiUri.toString(), {
        method,
      }
    )
    .then(response => {
      if (response.status >= 400) {
        throw new Error(
          `REST API responded to ${method} ${restApiUri.path()} with status ${response.status}`
        );
      }
      return response.json();
    })
    .then(result => {
      if (typeof(result.result_ok) === 'undefined') {
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

      if (typeof(result.data) === 'undefined') {
        throw new Error(
          `REST API responded to ${method} ${restApiUri.path()} with undefined data`
        );
      }

      return result.data;
    })
    .then(data => {
      if (typeof(callback) === 'undefined') {
        return data;
      }
      return callback(null, data);
    })
    .catch(reason => {
      if (typeof(callback) === 'undefined') {
        throw new Error(reason);
      }
      return callback(reason);
    })
    ;
  },
};

const assignOptionsAndCallbackFromArgs = (args) => {
  let options = {};
  let callback;

  if (args.length !== 0) {
    if (args.length === 1) {
      if (!_.isFunction(args[0]) && _.isObject(args[0])) {
        options = args[0];
      } else if (_.isFunction(args[0])) {
        callback = args[0];
      } else {
        throw new Error(
          'Invalid argument'
        );
      }
    } else if (args.length === 2) {
      if ((!_.isFunction(args[0]) && _.isObject(args[0])) && _.isFunction(args[1])) {
        [options, callback] = args;
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
    return this.wrapRestApiFetch(
      'GET', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.GET.name] = object => ({
  name: `get${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    return this.wrapRestApiFetch(
      'GET', `${object.getRoute(options)}`, options, callback
    );
  },
});

objectCallerFactories[sgObjectCalls.CREATE.name] = object => ({
  name: `create${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    console.log('Stub CREATE ${object.name}');
  },
});

objectCallerFactories[sgObjectCalls.UPDATE.name] = object => ({
  name: `update${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    console.log('Stub UPDATE ${object.name} ${objectId}');
  },
});

objectCallerFactories[sgObjectCalls.DELETE.name] = object => ({
  name: `delete${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    console.log('Stub DELETE ${object.name} ${objectId}');
  },
});

objectCallerFactories[sgObjectCalls.COPY.name] = object => ({
  name: `copy${_.upperFirst(object.name)}`,
  func(objectId, ...args) {
    const [options, callback] = assignOptionsAndCallbackFromArgs(args);
    console.log('Stub COPY ${object.name} ${objectId}');
  },
});

sgObjectNames.forEach(objectName => {
  const object = sgObjects[objectName];
  if (typeof(object.calls) !== 'undefined') {
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
