const axios = require('axios')
const fetch = require('node-fetch')
const { monospace } = require('../lib/utils')
let handler = async(m, {client, text, args, usedPrefix, command}) => {
  if (!text) throw `Example: ${usedPrefix + command} naruto`
  let arg
  switch(command) {
    case 'wallpaper':
       arg = text.split('#')
      let q = arg  ? arg[0] : text
      q = encodeURIComponent(q.replace(/ /g, '+'))
      let x = arg && arg[1] && !isNaN(parseInt(arg[1])) ? parseInt(arg[1]) : 1
      if (x > 5) throw 'Request terlalu banyak max 5!'
      let walls = (await axios.get(`https://wall.alphacoders.com/api2.0/get.php?auth=3e7756c85df54b78f934a284c11abe4e&method=search&term=${q}`)).data
      if (walls.wallpapers.length == 0) throw 'Wallpaper tidak dapat kami termukan!'
       for (let i = 0; i < x; i+=1) {
       let { width, height, file_type, file_size, id, url_page, url_image} = pickRandom(walls.wallpapers)
       file_size = (parseInt(file_size) / 1024) / 1024 + 'MB'
       let caption = `*WALLPAPER*\n*Query:* ${monospace(decodeURIComponent(q).replace(/\+/g, ' '))}\n`
       + `*Width:* ${monospace(width)}\n`
       + `*Height:* ${monospace(height)}\n`
       + `*Ext:* ${monospace(file_type)}\n`
     //  + `*Size:* ${monospace(file_size)}\n`
     //  let buffer = await getBuffer(url_image)
       console.log(url_image)
       client.sendFile(m.chat, url_image, 'anu.png', '', m)
       }
       break
    


  }
  
  
  
  
}

handler.command = /^wallpaper$/
handler.help = ['wallpaper'].map(v => v + ' <query>#<jumlah>')
handler.tags = ['wallpaper']
handler.limit = true
handler.exp = 50
handler.group = true

module.exports = handler


function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}