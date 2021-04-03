const {
  HttpPage
} = require('./makeEasy');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.animesonglyrics.com/';


const page = async() => {
  try {
    const html = await HttpPage(BASE_URL);
    const $ = cheerio.load(html);
    const element = $('.row');
    let thumb = [];
    let title = [];
    let endpoint = [];
    let result = [];
    element.find('.col-xs-12.col-sm-3').each(function() {
      $(this).find('a > img').each(function() {
        thumb.push($(this).attr('data-src'))
        //title.push($(this).attr('alt'))
      })
      $(this).find('a').eq(1).each(function() {
        endpoint.push($(this).attr('href').replace(BASE_URL, ''))
        title.push($(this).attr('title'))
      })
    })

    for (var i in title) {
      let obj = {
        title: title[i],
        thumb: thumb[i],
        endpoint: endpoint[i]
      }
      result.push(obj)
    }
    return result
  } catch(err) {
    throw err;
  }
}

const detailAnime = async(endpoint) => {
  const fullUrl = `${BASE_URL}${endpoint}`;
  try {
    const html = await HttpPage(fullUrl)
    const $ = cheerio.load(html)
    const element = $('#coverart')
    let thumb = element.find('a > img').attr('data-src')
    let title = $('#toptitle').find('.row > .col-xs-8 > .blink > a').text().trim()
    let songList = getSong(html)
    return {
      title,
      thumb,
      songList,
    }
    
  }catch(er) {
    throw err;
  }

}
//let id = 'tensei-shitara-slime-datta-ken/storyteller'
const detailSong = async(endpoint) => {
  const fullUrl = `${BASE_URL}${endpoint}`;
  try {
    const html = await HttpPage(fullUrl);
    const $ = cheerio.load(html)
    const element = $('#lcontainer')
    let obj = {};
    obj.title = element.find('#ldata > .lcontent > .songlinks .SngLnk2').text().trim()
  //  obj.artist = element.find('#ldata > .lcontent > .songlinks .songartist').text().replace('by', '').trim()
    obj.lirik = element.find('#ldata > .lcontent > #tablyrics > #tab1').text().trim().split('\n')[0]
    const elInfo = $('#wrapper.container-fluid')
    obj.anime = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(0).text().trim()
    obj.season = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(1).text().trim()
    obj.artist = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(2).text().trim()
    obj.composed = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(5).text().trim()
    obj.arranged = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(6).text().trim()
    obj.rilis = elInfo.find('#mcontent.row > #boxunit > #snginfo > .artlink > a').eq(7).text().trim()
   
    return obj
  }catch(err) {
    throw err;
  }
  
}

const search = async(query) => {
  const q = query.replace(/ /g, '+')
  const fullUrl = `${BASE_URL}results?_token=igyZsfqNSLBbWOnw8heuNclzhQwZkvoUKE4YsrHr&q=${q}`
  try {
    const html = await HttpPage(fullUrl);
    const $ = cheerio.load(html);
    let anime = []
    let song = []
    const element = $('#wrapper').find('.row > .col-md-10.col-md-offset-1 > .panel.panel-default')
    element.find('.list-group').first().find('#titlelist > .homesongs').each((i, e) => {
      title = $(e).find('a').text().trim()
      japan = $(e).find('a').attr('title')
      endpoint = $(e).find('a').attr('href').replace(BASE_URL, '')
      thumb = $(e).find('img').attr('data-src')
      anime.push({
        title, 
        japan,
        endpoint,
        thumb
      })
    })
    
   element.find('.list-group').last().find('#songlist').filter(function() {
     let title, thumb, endpoint,anime, preview
     $(this).find('.homesongs').each(function() {
       let el = $(this).find('a').text().trim().split('\n')
       anime = el[0].trim()
       title = el[1].trim().replace(/:/g, '')
       preview = el[3].trim()
       thumb = $(this).find('a > img').attr('data-src')
       endpoint = $(this).find('a').attr('href').replace(BASE_URL, '')
       song.push({
         title,
         anime,
         endpoint,
         thumb,
         preview
       })
     })
   })
    return {
      anime,
      song
    }
  }catch(e) {
    throw e;
  }
  
  
  
}


function getSong(html) {
  const $ = cheerio.load(html);
  const endpoint = [];
  const songList = [];
  const title = []
  elemLyric = $('#ldata');
  elemLyric.find('.lcontent > #songlist > a')
  .next()
  .each(function() {
    endpoint.push($(this).attr('href').replace(BASE_URL, ''))
    title.push($(this).text().replace('\n', '').replace('Themes', '').trim())

  })
  for (var i in title.filter(bruh => bruh != '')) {
    let isi = {
      title: title[i],
      endpoint: endpoint[i]
    }
    songList.push(isi)
  }
  return songList.filter(res => res.endpoint != '#')
}




module.exports = {
  page,
  search,
  detailSong,
  detailAnime,
}