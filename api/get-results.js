"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const mongoose = require("mongoose");
const Images = mongoose.model("Images");

class GetResults {
  async get(req) {
    const results = {
      foo: 123
    };

    return {
      results
    };
  }
}

module.exports = new GetResults();
