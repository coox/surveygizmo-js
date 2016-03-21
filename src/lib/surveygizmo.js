import 'babel-polyfill';

import sgConfig from './surveygizmo/config';
import sgDomain from './surveygizmo/domain';
import sgObject from './surveygizmo/object';
import sgObjectCall from './surveygizmo/object-call';
import sgRegion from './surveygizmo/region';
import sgRestApi from './surveygizmo/rest-api';
import sgUtil from './surveygizmo/util';

export default {
  config: sgConfig,
  domain: sgDomain,
  object: sgObject,
  objectCall: sgObjectCall,
  region: sgRegion,
  restApi: sgRestApi,
  util: sgUtil,
};
