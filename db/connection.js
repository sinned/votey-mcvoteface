'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const q = require('q');
const glob = q.nfbind(require('glob'));
const path = require('path');

class DbConnection {
  connectToDb(dbUrl) {
    console.log('connecting to: ' + dbUrl);
    mongoose.Promise = q.Promise;
    if (process.env.MONGOOSE_DEBUG) {
      mongoose.set('debug', true);
    }
    return q.ninvoke(mongoose, 'connect', dbUrl);
  }
  async loadModels() {
    const cwd = path.dirname(__filename);
    const files = await glob('../models/**/*.js', {cwd:cwd});
    _.each(files, (file) => {
      require(file);
    });
  }
  connectAndLoadModels(dbUrl) {
    return this.connectToDb(dbUrl)
      .then(this.loadModels.bind(this));
  }
}

module.exports = new DbConnection();
