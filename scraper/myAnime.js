const mal = require('mal-scraper')
const cheerio = require('cheerio')
const axios = require('axios')



const searchAnime = async(type, query) => {
  const search = mal.search
  try {
    const result = await search.search(type,{ term: query})
  }catch(err) {
    throw err
  }
}

  //"box-unit7 js-fancybox-video pt8 pb8"
  //"content-main mb16 pb16"

const getPV = async() => {
let urlPv = 'https://myanimelist.net/anime/28171/Shokugeki_no_Souma/video'
  try {
    const resp = await axios.get(urlPv)
 //   console.log(resp.data);
    const $ = cheerio.load(resp.data)
    let videoId;
    let pv_list = []
    const elem = $('div#wrapper.js-wrapper')
    
    elem.find('div#top.cotainer > div#content.content > div.content > div.content-main.mb16.pb16 > div')
    .find('div.box-unit7.js-fancybox-video.pt8.pb8')
      .each(function() {
        videoId = $(this).attr('data-id')
        titlePv = $(this).attr('data-title')
        animeId = $(this).attr('data-anime-id')
        pv_list.push({
          titlePv,
          videoId,
          animeId,
        })
        
      })
    return {pv_list}
  }catch(err) {
    throw err
  }

}
getPV()
.then(console.log)
.catch(console.log)
