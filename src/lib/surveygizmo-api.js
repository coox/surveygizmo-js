import _ from 'lodash';
import config from 'config';
import fetch from 'isomorphic-fetch';
import sgDomain from './surveygizmo-domain';
import sgObject from './surveygizmo-object';
import sgObjectCall from './surveygizmo-object-call';
import { names as sgObjectNames } from './surveygizmo-object';
import sgUtil from './surveygizmo-util';
import URI from 'urijs';

const restApiVersion = 'v4';

function getRestApiUri(api, path) {
  return new URI(
    {
      protocol: 'https',
      hostname: sgDomain.get(api.regionName),
      path: `/${restApiVersion}/${path}`,
    }
  )
  .query({
    api_token: api.auth.apiKey,
    api_token_secret: api.auth.apiSecretKey,
  })
  ;
}

function wrapRestApiFetch(api, method, path, options = {}, callback = undefined) {
  const restApiUri = getRestApiUri(api, path);
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
}

const objectCallerFactory = {};

objectCallerFactory[sgObjectCall.LIST.name] = object => ({
  name: `get${_.upperFirst(object.pluralName)}`,
  func(callback = undefined) {
    return wrapRestApiFetch(this, 'GET', object.path, {}, callback);
  },
});

objectCallerFactory[sgObjectCall.GET.name] = object => ({
  name: `get${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    return wrapRestApiFetch(this, 'GET', `${object.path}/${objectId}`, {}, callback);
  },
});

objectCallerFactory[sgObjectCall.CREATE.name] = object => ({
  name: `create${_.upperFirst(object.name)}`,
  func(callback = undefined) {
    console.log('Stub CREATE ${object.name}');
  },
});

objectCallerFactory[sgObjectCall.UPDATE.name] = object => ({
  name: `update${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    console.log('Stub UPDATE ${object.name} ${objectId}');
  },
});

objectCallerFactory[sgObjectCall.DELETE.name] = object => ({
  name: `delete${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    console.log('Stub DELETE ${object.name} ${objectId}');
  },
});

objectCallerFactory[sgObjectCall.COPY.name] = object => ({
  name: `copy${_.upperFirst(object.name)}`,
  func(objectId, callback = undefined) {
    console.log('Stub COPY ${object.name} ${objectId}');
  },
});

const prototype = {};

sgObjectNames.forEach(objectName => {
  const object = sgObject[objectName];
  if (typeof(object.calls) !== 'undefined') {
    Object.keys(object.calls).forEach(objectCallName => {
      if (!sgUtil.isValidObjectCallName(objectCallName)) {
        throw new Error(`SurveyGizmo Object ${objectName} defines invalid call ${objectCallName}`);
      }
      const objectCaller = objectCallerFactory[objectCallName](object);
      prototype[objectCaller.name] = objectCaller.func;
    });
  }
});

const init = (options = {}) => {
  const api = Object.assign(Object.create(prototype), config, options);

  return api;
};

/*
 * Public API
 */

export default {
  init,
};
