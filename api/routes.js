"use strict";

const PromiseHandler = require("../util/promise-handler");

module.exports = app => {
  const loadPinterest = new PromiseHandler(require("./load-pinterest"));
  const getImage = new PromiseHandler(require("./get-image"));
  const getResults = new PromiseHandler(require("./get-results"));
  const getResultsForImage = new PromiseHandler(
    require("./get-results-for-image")
  );

  app.route("/api/loadPinterest").get(loadPinterest.jsonp("load"));
  app.route("/api/getImage/:imageId").get(getImage.jsonp("get"));
  app.route("/api/getResults").get(getResults.jsonp("get"));
  app
    .route("/api/getResultsForImage/:imageId")
    .get(getResultsForImage.jsonp("get"));
};
