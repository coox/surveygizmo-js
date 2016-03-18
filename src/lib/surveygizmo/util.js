/*
 * Utilities for SurveyGizmo.
 * https://apihelp.surveygizmo.com/help/article/link/us-or-eu-api
 */

import { names as sgObjectCallNames } from './object-call';
import { names as sgObjectNames } from './object';
import { names as sgRegionNames } from './region';

const isValidObjectCallName = objectCallName =>
  sgObjectCallNames.includes(objectCallName)
;
const isValidObjectName = objectName =>
  sgObjectNames.includes(objectName)
;
const isValidRegionName = regionName =>
  sgRegionNames.includes(regionName)
;

export default {
  isValidObjectCallName,
  isValidObjectName,
  isValidRegionName,
};
