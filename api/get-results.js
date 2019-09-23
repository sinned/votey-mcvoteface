"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const mongoose = require("mongoose");
const Images = mongoose.model("Images");

class GetResults {
  async get(req) {
    const voteImages = await Images.find()
      .sort({ votes: -1 })
      .exec();

    return {
      voteImages
    };
  }
}

module.exports = new GetResults();
