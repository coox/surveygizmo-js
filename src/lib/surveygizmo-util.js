/*
 * Utilities for SurveyGizmo.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

import { names as sgObjectCallNames } from './surveygizmo-object-call';
import { names as sgObjectNames } from './surveygizmo-object';
import { names as sgRegionNames } from './surveygizmo-region';

const isValidObjectCallName = (objectCallName) => sgObjectCallNames.includes(objectCallName);
const isValidObjectName = (objectName) => sgObjectNames.includes(objectName);
const isValidRegionName = (regionName) => sgRegionNames.includes(regionName);

/*
 * Public API
 */

export default {
  isValidObjectCallName,
  isValidObjectName,
  isValidRegionName,
};
