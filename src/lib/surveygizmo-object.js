import sgObjectCall from './surveygizmo-object-call';

/*
 * Define properties of SurveyGizmo REST API objects.
 * https://apihelp.surveygizmo.com/help/article/link/objects
 */

const objects = {};

// https://apihelp.surveygizmo.com/help/article/link/account-object
objects.account = {
  restApiResourceName: 'accountuser',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/accountteams-object
objects.accountTeam = {
  restApiResourceName: 'accountteams',
  calls: {
    [sgObjectCall.LIST.name]: {
      // showdeleted
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/accountuser-object
objects.accountUser = {
  restApiResourceName: 'accountuser',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/contactlist-object
objects.contactList = {
  restApiResourceName: 'contactlist',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/survey-object
objects.survey = {
  restApiResourceName: 'survey',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
      filterable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveypage-sub-object
objects.surveyPage = {
  parent: objects.survey,
  restApiResourceName: 'survey',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.COPY.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveyquestion-sub-object
objects.surveyQuestion = {
  parent: objects.survey,
  restApiResourceName: 'surveyquestion',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveyoption-sub-object
objects.surveyOption = {
  parent: objects.surveyQuestion,
  restApiResourceName: 'surveyquestion',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveycampaign-sub-object
objects.surveyCampaign = {
  parent: objects.survey,
  restApiResourceName: 'surveycampaign',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/contact-sub-object
objects.contact = {
  parent: objects.surveyCampaign,
  restApiResourceName: 'contact',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/emailmessage-sub-object
objects.emailMessage = {
  parent: objects.surveyCampaign,
  restApiResourceName: 'emailmessage',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveyresponse-sub-object
objects.surveyResponse = {
  parent: objects.survey,
  restApiResourceName: 'surveyresponse',
  calls: {
    [sgObjectCall.LIST.name]: {
      paginable: true,
      filterable: true,
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.CREATE.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveystatistic-sub-object
objects.surveyStatistic = {
  parent: objects.survey,
  restApiResourceName: 'surveystatistic',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
  },
};

// https://apihelp.surveygizmo.com/help/article/link/surveyreport-sub-object
objects.surveyReport = {
  parent: objects.survey,
  restApiResourceName: 'surveystatistic',
  calls: {
    [sgObjectCall.LIST.name]: {
    },
    [sgObjectCall.GET.name]: {
    },
    [sgObjectCall.UPDATE.name]: {
    },
    [sgObjectCall.DELETE.name]: {
    },
  },
};

// Guarantee a `name` and a `pluralName` property
Object.keys(objects).forEach(objectName => {
  objects[objectName].name = objectName;
  if (typeof(objects[objectName].pluralName) === 'undefined') {
    objects[objectName].pluralName = `${objectName}s`;
  }
});

const objectNames = Object.keys(objects);

/*
 * Public API
 */

export default objects;
export { objectNames as names };
