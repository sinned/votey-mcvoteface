"use strict";

const PromiseHandler = require("../util/promise-handler");

module.exports = app => {
  const loadPinterest = new PromiseHandler(require("./load-pinterest"));
  const getResults = new PromiseHandler(require("./get-results"));

  app.route("/api/loadPinterest").get(loadPinterest.jsonp("load"));
  app.route("/api/getResults").get(getResults.jsonp("get"));
};
