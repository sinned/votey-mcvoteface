"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const mongoose = require("mongoose");
const VoteLogs = mongoose.model("VoteLogs");

class GetVoteLogs {
  async get(req) {
    const voteLogs = await VoteLogs.find().exec();

    return {
      voteLogs
    };
  }
}

module.exports = new GetVoteLogs();
