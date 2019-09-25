module.exports = async function(controller) {
  const mongoose = require("mongoose");
  const Images = mongoose.model("Images");
  const VoteLogs = mongoose.model("VoteLogs");
  const _ = require("lodash");
  const pluralize = require("pluralize");

  controller.hears(
    ["^whovoted", "^who voted"],
    "direct_message",
    async function(bot, message) {
      const team_id = _.get(message, "team_id");
      if (team_id) {
        bot.reply(message, "Here's who voted from your team...");
        const votecounts = await VoteLogs.aggregate([
          { $match: { teamId: team_id } },
          {
            $group: {
              _id: { userId: "$userId", userName: "$userName" },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]);
        let voteCountMessages = _.map(votecounts, votecount => {
          return (
            "• <@" +
            _.get(votecount, "_id.userId") +
            "> voted *" +
            votecount.count +
            "* " +
            pluralize("time", votecount.count) +
            "."
          );
        });
        let totalVotes = _.sumBy(votecounts, votecount => {
          return votecount.count;
        });
        voteCountMessages.unshift("Total Votes: *" + totalVotes + "*\n");
        var votedMessage = _.join(voteCountMessages, "\n");
        console.log("votedMessage", votedMessage);
        bot.reply(message, votedMessage);
      } else {
        bot.reply(message, "Sorry. I can't get your vote counts right now.");
      }
    }
  );
};
