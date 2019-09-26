"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
const VoteLogs = mongoose.model("VoteLogs");

class GetResultsForImage {
  async get(req) {
    const imageId = req.params.imageId; // eg. 5d899c50bc351d67709d4b70
    const query = {
      $or: [
        { votedFor: new ObjectId(imageId) },
        { votedAgainst: new ObjectId(imageId) }
      ]
    };
    console.log("query", query);
    const voteImages = await VoteLogs.find(query).exec();

    return {
      voteImages
    };
  }
}

module.exports = new GetResultsForImage();
