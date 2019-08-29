'use strict';

class LoadFromPinterest {
  async load(req) {
    const pinterestRssUrl = 'https://www.pinterest.com/choijoy/home-inspiration.rss';
    let values;
    console.log('LOADING PINTEREST FROM API');
    return {
      'loaded': true
    };
  }
}

module.exports = new LoadFromPinterest();