'use strict';

const PromiseHandler = require('../util/promise-handler');

module.exports = (app) => {
  const loadPinterest = new PromiseHandler(require('./load-pinterest'));

  app.route('/api/loadPinterest').get(loadPinterest.jsonp('load'));
};
