/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

module.exports = function(controller) {
  /* Collect some very simple runtime stats for use in the uptime/debug command */
  var stats = {
    triggers: 0,
    convos: 0,
    votes: 0
  };

  controller.on("heard_trigger", function() {
    stats.triggers++;
  });

  controller.on("conversationStarted", function() {
    stats.convos++;
  });

  controller.on("interactive_message_callback", function() {
    stats.votes++;
  });

  controller.hears(
    ["^uptime", "^debug"],
    "direct_message,direct_mention",
    function(bot, message) {
      bot.createConversation(message, function(err, convo) {
        if (!err) {
          convo.setVar("uptime", formatUptime(process.uptime()));
          convo.setVar("convos", stats.convos);
          convo.setVar("triggers", stats.triggers);
          convo.setVar("votes", stats.votes);

          convo.say(
            "My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, conducted {{vars.convos}} conversations and received {{vars.votes}} votes."
          );
          convo.activate();
        }
      });
    }
  );

  controller.hears(["help", "^hi", "^hi (.*)"], "direct_message", function(
    bot,
    message
  ) {
    bot.reply(
      message,
      "Aloha! I am Votey McVoteface. To vote on the current poll, just DM me `vote`."
    );
  });

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Utility function to format uptime */
  function formatUptime(uptime) {
    var unit = "second";
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = "minute";
    }
    if (uptime > 60) {
      uptime = uptime / 60;
      unit = "hour";
    }
    if (uptime != 1) {
      unit = unit + "s";
    }

    uptime = parseInt(uptime) + " " + unit;
    return uptime;
  }
};
