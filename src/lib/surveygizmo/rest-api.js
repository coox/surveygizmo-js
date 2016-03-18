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

const objectCallerFactories = {};

objectCallerFactories[sgObjectCalls.LIST.name] = object => ({
  name: `get${_.upperFirst(object.pluralName)}`,
  func(callback = undefined) {
    return this.wrapRestApiFetch('GET', object.path, {}, callback);
  },
});

objectCallerFactories[sgObjectCalls.GET.name] = object => ({
  name: `get${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    return this.wrapRestApiFetch('GET', `${object.path}/${objectId}`, {}, callback);
  },
});

objectCallerFactories[sgObjectCalls.CREATE.name] = object => ({
  name: `create${_.upperFirst(object.name)}`,
  func(callback = undefined) {
    console.log('Stub CREATE ${object.name}');
  },
});

objectCallerFactories[sgObjectCalls.UPDATE.name] = object => ({
  name: `update${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    console.log('Stub UPDATE ${object.name} ${objectId}');
  },
});

objectCallerFactories[sgObjectCalls.DELETE.name] = object => ({
  name: `delete${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    console.log('Stub DELETE ${object.name} ${objectId}');
  },
});

objectCallerFactories[sgObjectCalls.COPY.name] = object => ({
  name: `copy${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
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
