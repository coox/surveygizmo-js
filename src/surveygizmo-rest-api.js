import 'babel-polyfill';

import libClient from './lib/client';
import libDomain from './lib/domain';
import libRegion from './lib/region';

export default {
  client: libClient,
  domain: libDomain,
  region: libRegion,
};
