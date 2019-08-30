'use strict';

const axios = require('axios');

class LoadFromPinterest {
  async load(req) {
    const pinterestRssUrl = 'https://www.pinterest.com/choijoy/home-inspiration.rss';
    axios.get(pinterestRssUrl)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
    let values;
    console.log('LOADING PINTEREST FROM API');
    return {
      'loaded': true
    };
  }
}

module.exports = new LoadFromPinterest();