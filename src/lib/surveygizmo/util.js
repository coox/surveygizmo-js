/*
 * Utilities for SurveyGizmo.
 */

import bases from 'bases';
import { names as sgObjectCallNames } from './object-call';
import { names as sgObjectNames } from './object';
import { names as sgRegionNames } from './region';

/*
 * On February 24, 2016, SurveyGizmo introduced “encoded” sguid values,
 * which are a bijective mapping of traditional “decoded” sguid.
 * This change was unannounced and the mapping method was not made public.
 * Reverse-engineering props to @jscari 😤
 * Quoting an e-mail from SurveyGizmo’s Manager of Customer Service:
 *  “we don't have plans to change this again any time soon. We made
 *   this change to make things more secure and less easy for respondents
 *   to change the SGUID value and access someone else's partial response.”
 */
const sguidAlphabet = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';

const decodeSguid = encodedSguid =>
  // '8kDyd' → 100125968
  bases.fromAlphabet(encodedSguid.split('').reverse().join(''), sguidAlphabet)
;

const encodeSguid = decodedSguid =>
  // 100125968 → '8kDyd'
  bases.toAlphabet(decodedSguid, sguidAlphabet).split('').reverse().join('')
;

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
  decodeSguid,
  encodeSguid,
  isValidObjectCallName,
  isValidObjectName,
  isValidRegionName,
};
