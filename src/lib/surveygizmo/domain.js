import config from 'config';
import { regions as sgRegions } from './region';

/*
 * Utility method to get SurveyGizmo REST API hostname based on region.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

const domainByRegionName = {
  [sgRegions.EU.name]: {
    hostname: 'restapi.surveygizmo.eu',
  },
  [sgRegions.US.name]: {
    hostname: 'restapi.surveygizmo.com',
  },
};

const domain = (regionName = config.get('restApi.regionName')) => domainByRegionName[regionName];

export default domain;
