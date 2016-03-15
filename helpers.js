'use strict';

const _ = require('lodash');

exports.transform = (feed) => {
  let ignoreAttributes = ['updatedAt', 'created_at', 'createdAt', 'uid',
                          'currency', 'metric', 'head', 'accountId', 'userId'];
  let params = feed.params;
  let document = {
    _ref: feed.id,
    id: feed.trackableId,
    type: feed.trackableType,
    title: null,
    body: _.values(_.omit(params, ignoreAttributes)).join(' ')
  };
  switch (feed.trackableType) {
    case 'Document':
      document.title = [params.client, params.type, params.status,
                        params.docNumber, params.docNumberFormat,
                        params.total, params.subtotal].join(' ');
      break;
    case 'Product':
      document.title = params.description;
      break;
    case 'TimeEntry':
      document.title = params.title;
      break;
    case 'Receipt':
      document.title = params.category;
      break;
    case 'Client':
      document.title = [params.name, params.email].join(' ');
      break;
  }
  return document;
};
