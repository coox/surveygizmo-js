/*
 * Define calls that can be made to SurveyGizmo REST API objects.
 * https://apihelp.surveygizmo.com/help/article/link/objects
 */

const objectCalls = {
  LIST: {
  },
  GET: {
  },
  CREATE: {
  },
  UPDATE: {
  },
  DELETE: {
  },
  COPY: {
  },
};

// Guarantee a `name` property
Object.keys(objectCalls).forEach(objectCallName => {
  objectCalls[objectCallName].name = objectCallName;
});

const objectCallNames = Object.keys(objectCalls);

const objectCall = name => objectCalls[name];

export default objectCall;
export {
  objectCallNames as names,
  objectCalls,
};
