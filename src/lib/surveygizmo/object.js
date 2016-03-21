import _ from 'lodash';
import { objectCalls as sgObjectCalls } from './object-call';

/*
 * Define properties of SurveyGizmo REST API objects.
 * https://apihelp.surveygizmo.com/help/article/link/objects
 */

const prototype = {
  /*
   * () => 'object'
   * (1) => 'object/1'
   * (1, { parentId: 2 }) => 'parent/2/object/1'
   * ({ parentId: 2 }) => 'parent/2/object'
   */
  getRoute(options) {
    if (_.isUndefined(this.nameInRoute)) {
      return undefined;
    }

    const parentRoute = _.isUndefined(this.parent) ? undefined : this.parent.getRoute(options);

    return _.compact([
      parentRoute, this.nameInRoute, options[`${this.name}Id`],
    ]).join('/');
  },
};

const objects = {};

// https://apihelp.surveygizmo.com/help/article/link/account-object
objects.account = Object.assign(Object.create(prototype), {
  nameInRoute: 'accountuser',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/accountteams-object
objects.accountTeam = Object.assign(Object.create(prototype), {
  nameInRoute: 'accountteams',
  calls: {
    [sgObjectCalls.LIST.name]: {
      // showdeleted
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/accountuser-object
objects.accountUser = Object.assign(Object.create(prototype), {
  nameInRoute: 'accountuser',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/contactlist-object
objects.contactList = Object.assign(Object.create(prototype), {
  nameInRoute: 'contactlist',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/survey-object
objects.survey = Object.assign(Object.create(prototype), {
  nameInRoute: 'survey',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
      filterable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.COPY.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveypage-sub-object
objects.surveyPage = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'survey',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveyquestion-sub-object
objects.surveyQuestion = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'surveyquestion',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveyoption-sub-object
objects.surveyOption = Object.assign(Object.create(prototype), {
  parent: objects.surveyQuestion,
  nameInRoute: 'surveyquestion',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveycampaign-sub-object
objects.surveyCampaign = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'surveycampaign',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/contact-sub-object
objects.contact = Object.assign(Object.create(prototype), {
  parent: objects.surveyCampaign,
  nameInRoute: 'contact',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/emailmessage-sub-object
objects.emailMessage = Object.assign(Object.create(prototype), {
  parent: objects.surveyCampaign,
  nameInRoute: 'emailmessage',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveyresponse-sub-object
objects.surveyResponse = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'surveyresponse',
  calls: {
    [sgObjectCalls.LIST.name]: {
      paginable: true,
      filterable: true,
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.CREATE.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveystatistic-sub-object
objects.surveyStatistic = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'surveystatistic',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
  },
});

// https://apihelp.surveygizmo.com/help/article/link/surveyreport-sub-object
objects.surveyReport = Object.assign(Object.create(prototype), {
  parent: objects.survey,
  nameInRoute: 'surveystatistic',
  calls: {
    [sgObjectCalls.LIST.name]: {
    },
    [sgObjectCalls.GET.name]: {
    },
    [sgObjectCalls.UPDATE.name]: {
    },
    [sgObjectCalls.DELETE.name]: {
    },
  },
});

// Guarantee a `name` and a `pluralName` property
Object.keys(objects).forEach(objectName => {
  objects[objectName].name = objectName;
  if (_.isUndefined(objects[objectName].pluralName)) {
    objects[objectName].pluralName = `${objectName}s`;
  }
});

const objectNames = Object.keys(objects);

const object = name => objects[name];

export default object;
export {
  objectNames as names,
  objects,
};
