const {
  HttpPage
} = require('./makeEasy');
const cheerio = require('cheerio');
const baseUrl = 'https://komikcast.com/';


let searchCache = {};

const search = async(query) => {
  if (searchCache[query]) {
    console.log('Serving from cache!');
    return new Promise(resolve => resolve(searchCache[query]));
  }
  const url = `${baseUrl}?s=${query}`;
  try {
    console.log(url);
    const html = await HttpPage(url);
    const $ = cheerio.load(html);
    const element = $('div#content');
   // console.log(element);
    let manga_list = [];
    let title = [];
    let thumb = [];
    let rating = [];
    let endpoint = [];
    let type = [];
    element.find('div[class="postbody komikinfo"] > div.dev > main#main[class="site-main"]').filter(function() {
      //console.log($(this));
      $(this)
      .find('div.bsx > a')
      .each(function() {
        title.push($(this).attr('title'))
        endpoint.push($(this).attr('href').replace(`${baseUrl}komik/`, ''))
        thumb.push($(this).find('.limit > img').attr('src'))
        type.push($(this).find('.limit > span').text().trim());
      });
      $(this).find('div.bsx > div.bigor > div.adds').each(function() {
        rating.push(parseFloat($(this).find('.rating > i').text().trim()));
      });

    });
    var i;
    for (i = 0; i < title.length; i++) {
      isi = {
        title: title[i],
        rating: rating[i],
        type: type[i],
        thumb: thumb[i],
        endpoint: endpoint[i]
      };
      manga_list.push(isi)
    }
    searchCache[query] = manga_list
    return manga_list

  }catch(err) {
    console.log(err);
    throw err;
  }

};

module.exports = {
  search,
}