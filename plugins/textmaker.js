const axios = require('axios')

let listTheme = {
  'shadowtext': 'shadow_text',
  'coffeetext': 'coffee_text',
  'neonblack': 'neonblack',
  'naruto': 'naruto',
  'glitch': 'glitch',
  'metalicglow': 'metalicglow',
  'pubglogo': 'pubglogo',
  'slideshow': 'slideshow'
}


let handler = async(m, { client, command, text, args}) => {
  if (args.length === 0) return m.reply(`Kirim perintah ${usedPrefix + command} <theme> text1|text2\nBerikut daftar theme: ${listTheme.map(v=> `*${v}*`).join('\n')}`)
  let arg = args.slice(1).join(' ').split('|')
  let teks1 =  arg && arg[0] ? arg[0] : text
  let teks2 = arg && arg[1] ? arg[1] : ''
  let teks3 = arg && arg[2] ? arg[2] : ''
  
  
  let tema = args[0]
  let sty
  if (listTheme[tema] === 'slideshow') sty = parseInt(teks2) || 0
  if (sty && sty > 5 ) throw `Max style adalah 5!`
  if (!listTheme[tema]) return m.reply(`Tema tidak tersedia silahkan cek kembali: ${listTheme.map(v=>`*${v}*`).join('\n')}`)
  let url = `https://api-rull.herokuapp.com/api/photooxy/${listTheme[tema]}?`
  if (listTheme[tema] == 'slideshow') url += `&text=${teks1}&style=${sty}`
  else url += `&text=${teks1}&text2=${teks2}`
  // const resp = await axios.get(url)
  client.sendFile(m.chat, url, 'textmaker.png', 'RESULT', m)
}

handler.tags = ['maker']
handler.command = /^photooxy$/i
handler.help = ['photooxy <theme> teks1|teks2']
handler.group = true
handler.limit = true

module.exports = handler
