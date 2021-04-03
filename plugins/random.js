const axios = require('axios')


let handler = async(m, {client, command}) => {
  switch(command) {
    case 'waifu':
      let inx = Math.floor(Math.random() * 145)
      //inx = inx > 9 ? `0${inx}` : '00' + inx
      let waifu = `https://media.publit.io/file/Twintails/${inx}.jpg`
      client.sendFile(m.chat, waifu, '', '', m)
      break
    case 'waifu2':
      let resp = await axios.get('https://api-rull.herokuapp.com/api/waifu')
      let waifu2 = resp.data
      let cap = `kak ${client.getName(m.sender)} waifumu *${waifu2.name}*\n`
      + `dari anime *${waifu2.anime}*`
      client.sendFile(m.chat, waifu2.image, 'waifu.png', cap, m)

    
    
  }
}


handler.command = /^waifu2?$/i
handler.tags = ['anime']
handler.group = true
handler.help = ['waifu', 'waifu2']

module.exports = handler


function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}