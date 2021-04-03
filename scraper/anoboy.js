const request = require('request');
const cheerio = require('cheerio');
const baseUrl = 'https://anoboy.tube/'
const fakeUa = require('fake-useragent')


/**
* @param {string} url
* @return html
*/

const HttpPage = async(url) => {
  return new Promise((resolve, reject) => {
    request({
      headers: {
        "User-Agent": fakeUa()},
      url: `${url}`,
    }, (err, resp, html) => {
      if (!err && resp.statusCode == 200) {
        resolve(html);
      } else {
        reject(err);
      }
    });
  })
}

//**cache*/

const cacheDetail = [];
const cacheSeach = [];



//Home pagination
const page = async(pagenumber) => new Promise(async(resolve, reject) => {
  const url = pagenumber === undefined ? baseUrl: pagenumber === '1' ? baseUrl: `${baseUrl}/page/${pagenumber}`;
  try {
    const html = await HttpPage(url);
    const $ = cheerio.load(html)
    const element = $('.container');
    let anime_list = [];
    let title, thumb, upload_on, endpoint;
    element.find('.home_index > a').each((i, e) => {
      thumb = $(e).find('.amv > amp-img').attr('src').replace('/s240/', '/s1000/')
      upload_on = $(e).find('.amv > .jamup').text().replace(/UP/g, '').trim();
      title = $(e).attr('title');
      endpoint = $(e).attr('href').replace(baseUrl, '');
      anime_list.push({
        title,
        thumb,
        upload_on,
        endpoint,
      });
    });
    return resolve({
      anime_list
    });
  }catch(err) {
    console.log(err)
    reject(err);
  }

});

const detailAnime = async(endpoint) => new Promise(async (resolve, reject) => {
  const url = `${baseUrl}${endpoint}`;
  try {
    const html = await HttpPage(url)
    const $ = cheerio.load(html);
    const element = $('.container');
    let obj = {};
    /*Get thumbnail*/
    const getThumb = element.find('div.unduhan > div > div[class="sisi entry-content"]');
    const getMeta = element.find('div.unduhan > div > div[class="sisi"]');
    obj.title = $(getThumb).find('h3').text();
    obj.thumb = $(getThumb).find('amp-img').attr('src').replace('/s240/',
      '/s1000/')
    obj.uploaded = $(getThumb).find('p > time[class="inline Update"]').eq(0).text().replace('Update :',
      '').split('\n')[0].trim();
    obj.synopsis = $(getMeta).find('.contentdeks').eq(0).text().split('\n')[1];
    const getGenre = $(getMeta).find('.contenttable > table > tbody > tr > td');
    obj.studio = $(getGenre).eq(1).text()
    obj.source = $(getGenre).eq(2).text()
    obj.duration = $(getGenre).eq(3).text()
    let genres = $(getGenre).eq(4).text()
    obj.genre = (/,/.test(genres)) ? genres.split(','): [genres]
    obj.score = $(getGenre).eq(5).text()
    obj.endpoint = endpoint
    obj.downloadEps = element.find('.download > #colomb > p > span').length === 0 ? null: [_epsDownload(0,
      html), _epsDownload(1,
      html), _epsDownload(2,
      html)]
    obj.batch = element.find('.column-three-fourth > .unduhan > span').length === 0 ? null: _batchAnime(html);
    resolve(obj)


  }catch (err) {
    console.log(err);
    reject(err);
  }

});

const search = (query) => new Promise(async(resolve, reject) => {
  const url = `${baseUrl}?s=${query}`
  try {
    const html = await HttpPage(url);
    const $ = cheerio.load(html);
    const element = $('.container');
    let anime_list = [];
    element
    .find('.column-content > a')
    .each(function() {
      title = $(this).attr('title')
      thumb = $(this).find('.amv > amp-img').attr('src').replace('/s240/', '/s1000/')
      endpoint = $(this).attr('href').replace(baseUrl, '')
      let upFix = $(this).find('.amv > .jamup').text().replace(/UP/, '').trim().split(',')
      upload_on = `${upFix[0]}, ${endpoint.split('/')[1]}/${endpoint.split('/')[0]}|${upFix[1].trim()}`
      anime_list.push({
        title,
        thumb,
        upload_on,
        endpoint,
      })
    })
    return resolve({
      anime_list
    })
  } catch(err) {
    console.log(err);
    reject(err);
  }
})






function _epsDownload(num, res) {
  const $ = cheerio.load(res)
  const element = $('.download')
  let download_list = [];
  let response;
  element.find('#colomb > p > span').eq(num).filter(function() {
    host = $(this).find('span').text()
    $(this).find('a').each(function() {
      quality = $(this).text()
      link = $(this).attr('href')
      _list = {
        quality: quality,
        link: link,
      }
      download_list.push(_list)
    })
    response = {
      host, download_list
    }
  })
  return response
}

function _batchAnime(res) {
  const $ = cheerio.load(res)
  const element = $('.unduhan')
  let response;
  let download_list = [];
  let host;
  element.find('span').filter(function() {
    $(this).find('a').each(function () {
      quality = $(this).text()
      link = $(this).attr('href')
      download_list.push({
        quality: quality,
        link: link,
      })
    })
    host = $('.container > .column-three-fourth > .unduhan').find('span').children().eq(0).text()
    response = {
      host, download_list
    }
  })
  return response;
}



module.exports = {
  page,
  search,
  detailAnime,
}