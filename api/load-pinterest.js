'use strict';

const axios = require('axios');
let Parser = require('rss-parser');
let parser = new Parser();

class LoadFromPinterest {
  async load(req) {
    console.log('LOADING PINTEREST FROM API');
    const pinterestRssUrl = 'https://www.pinterest.com/choijoy/home-inspiration.rss';
    let feed = await parser.parseURL(pinterestRssUrl);
    console.log(feed.title);
 
    feed.items.forEach(item => {
      let description = item.content;
      if (description) {
        let regex = /<img[^>]+src="([^">]+)"/;
        var foundImgSrc = description.match(regex);     
        console.log('foundImgSrc', foundImgSrc);            
      }

      console.log('title', item.title);
      console.log('---\n');
    });

    let values;
    return {
      'loaded': true
    };
  }
}

module.exports = new LoadFromPinterest();