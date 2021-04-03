const { HttpPage } = require('./makeEasy')
const cheerio = require('cheerio')
const fs = require('fs')
const BASE_URL = 'https://arknights.fandom.com/wiki/'
let star = '★'
const listOP = async() => {
  const url = BASE_URL + 'List_of_operators'
  try {
   const html = await HttpPage(url) 
   const $ = cheerio.load(html)
   let name, _class, faction, rarity,image, endpoint;
   let result = []
   const element = $('table[class="mrfz-wtable sortable"]')
  let elem =  element.find('tr').filter(function() {
      return $(this).find('td').eq(1).find('a').attr('title') != undefined

  })
    $(elem).each(function() {
      image = $(this).find('td').eq(0).find('div.center > div.floatnone > a').attr('href')
      let chara = $(this).find('td').eq(1).find('a')
      name = chara.attr('title')
      endpoint = chara.attr('href').replace(/\/wiki\//, '')
      _class = $(this).find('td').eq(2).text().trim()
      faction = $(this).find('td').eq(3).find('a').attr('title')
      rarity = $(this).find('td').eq(4).text().trim()
      
      result.push({
            image,
            name,
            endpoint,
            class: _class,
            faction,
            rarity,
        })
    })

  return result
  }catch(err) {
    throw err
  }
}

let baseURL = 'https://mrfz.fandom.com/wiki/'

const detailOP = async(endpoint) => {
  let url = baseURL + endpoint
  try {
    const html = await HttpPage(url)
    const $ = cheerio.load(html)
    let name, _teks = [],  _teks2 = [], image
    let result = []
    const element = $('div.mw-parser-output')
    let $info = element.find('table').eq(0).find('tbody')
     $info.find('tr td').each((i, e) => {
       _teks[i] = $(e).text().replace(/\\n/g, '').trim()
     })
    let teks = `*Name:* ${_teks[12].split('CN')[1].trim()}\n`
    + `*Position:* ${_teks[3]}\n`
    + `*Tags:* ${_teks[5].replace(/ /g, ', ')}\n`
    + `*Archtype:* ${_teks[7]}\n`
    + `*Trait:* ${_teks[9]}\n`
    + `*Acquisition:* ${_teks[11]}\n`
    + `*CV:* ${_teks[13].split('Illustrator')[0].split('CV')[1].trim()}\n`
    + `*Illustrator:* ${_teks[13].split('Illustrator')[1].trim()}\n`
     let $bio = element.find('table > p > aside[class="portable-infobox pi-background pi-europa pi-theme-wikia pi-layout-default"]')
     $bio.find('div > h3').each((i, e) => {
       _teks2[i] = $(e).text().replace(/\\n/g, '').trim()
     })
     
    return _teks2
  }catch(err) {
    throw err
  }
  
}
  



detailOP('Ch%27en').then(console.log)

module.exports = {
  listOP,
  
}