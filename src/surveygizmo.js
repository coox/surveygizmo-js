import 'babel-polyfill';

import sgApi from './lib/surveygizmo-api';
import sgDomain from './lib/surveygizmo-domain';
import sgObject from './lib/surveygizmo-object';
import sgObjectCall from './lib/surveygizmo-object-call';
import sgRegion from './lib/surveygizmo-region';
import sgUtil from './lib/surveygizmo-util';

export default {
  api: sgApi,
  domain: sgDomain,
  object: sgObject,
  objectCall: sgObjectCall,
  region: sgRegion,
  util: sgUtil,
};
