"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteLogSchema = new Schema({
  userId: {
    type: String
  },
  userName: {
    type: String
  },
  teamId: {
    type: String
  },
  voteTimestamp: {
    type: Number
  },
  votedForName: {
    type: String
  },
  votedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Images"
  },
  votedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Images"
  },
  triggerId: {
    type: String
  }
});

mongoose.model("VoteLogs", VoteLogSchema);
console.log("Loading VoteLogs Model.");
