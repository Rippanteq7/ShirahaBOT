let fetch = require('node-fetch')
let googleIt = require('google-it')
let handler = async (m, { client, command, args, text }) => {
  let full = /f$/i.test(command)
  if (!text) return client.reply(m.chat, 'Tidak ada teks untuk di cari', m)
  let url = 'https://google.com/search?q=' + encodeURIComponent(text)
  let search = await googleIt({ query: text })
  console.log(search)
  let msg = `Hasil Pencarian: *${text}*\n`
  for(let gugle of search) {
    msg += `*${gugle.title}*\n`
    + `_${gugle.snippet}_\n`
    + `${gugle.link}\n________________________\n`
  }
  let ss = `http://api-rull.herokuapp.com/api/ssweb?url=${url}&fulll=${full}`
  client.sendFile(m.chat, ss, 'screenshot.png', url + '\n\n' + msg, m)
}
handler.help = ['google'].map(v => v + ' <pencarian>')
handler.tags = ['internet']
handler.command = /^g(oo|u)glef?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler