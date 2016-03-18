import 'babel-polyfill';

import sgDomain from './lib/surveygizmo-domain';
import sgObject from './lib/surveygizmo-object';
import sgObjectCall from './lib/surveygizmo-object-call';
import sgRegion from './lib/surveygizmo-region';
import sgRestApi from './lib/surveygizmo-rest-api';
import sgUtil from './lib/surveygizmo-util';

export default {
  domain: sgDomain,
  object: sgObject,
  objectCall: sgObjectCall,
  region: sgRegion,
  restApi: sgRestApi,
  util: sgUtil,
};
