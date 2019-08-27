/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This is a simple Slack bot built with Botkit and Dashbot.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Load process.env values from .env file
require('dotenv').config();

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    clientSigningSecret: process.env.clientSigningSecret,
    verificationToken: process.env.verificationToken,
    // debug: true,
    scopes: ['bot'],
    json_file_store: __dirname + '/.db/' // store user data in a simple JSON format
});

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);


// Enable Dashbot.io plugin
if (process.env.DASHBOT_API_KEY) {
  var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY).slack;
  controller.middleware.receive.use(dashbot.receive);
  controller.middleware.send.use(dashbot.send);
  controller.log.info('Thanks for using Dashbot. Visit https://www.dashbot.io/ to see your bot analytics in real time.');
} else {
  controller.log.info('No DASHBOT_API_KEY specified. For free turnkey analytics for your bot, go to https://www.dashbot.io/ to get your key.');
}

// Add all the skills in the /skills Directory
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});
