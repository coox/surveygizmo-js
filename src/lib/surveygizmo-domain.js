import config from 'config';
import sgRegion from './surveygizmo-region';

/*
 * Utility methods to get SurveyGizmo REST API domain based on region.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const domainByRegionName = {
  [sgRegion.EU.name]: 'restapi.surveygizmo.eu',
  [sgRegion.US.name]: 'restapi.surveygizmo.com',
};

const get = (regionName = config.get('regionName')) => domainByRegionName[regionName];

/*
 * Public API
 */

export default {
  get,
};
