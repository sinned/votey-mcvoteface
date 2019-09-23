# Votey McVoteface

I'm a slack bot that lets you vote on stuff with your team.

Here's how to install this on your own Slack:

1) Run this code somewhere. You'll need that URL, obvs.
2) Create a slack app at https://api.slack.com/apps/
3) Make a Bot User (you should check the "Always Show My Bot Online")
4) In the Event Subscription Section:
   * Turn it on
   * for Request URL, it will be https://YOURAPPURL/slack/receive/ -- when you add this, it should say "Verified"
   * Subscribe to BOT events *** NOT WORKSPACE EVENTS *** You'll want message.im message.channel message.groups message.mpim
   * Save
5) In Interactive Components:
   * Turn it on
   * URL is the same as the events URL https://YOURAPPURL/slack/receive/
   * Save
6) OAuth & Permissions
   * Redirect URL is the URL https://YOURAPPURL/oauth
   * Save
7) Install App to Workplace
8) When you auth and install successfully — you should get a message FROM the bot


Here's a sample image dataset you can use:
https://github.com/sinned/votey-mcvoteface/blob/master/public/sample-images.json
