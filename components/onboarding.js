var debug = require("debug")("botkit:onboarding");

module.exports = function(controller) {
  controller.on("onboard", function(bot) {
    debug("Starting an onboarding experience!");

    bot.startPrivateConversation({ user: bot.config.createdBy }, function(
      err,
      convo
    ) {
      if (err) {
        console.log(err);
      } else {
        convo.say(
          "Hi! I am Votey McVoteface. Thanks for adding me to your Slack."
        );
        convo.say("DM me with `vote` to vote on the current poll.");
      }
    });
  });
};
