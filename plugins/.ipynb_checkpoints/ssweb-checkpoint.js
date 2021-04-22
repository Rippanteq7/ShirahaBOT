let fetch = require('node-fetch')
let handler = async (m, { client, command, args }) => {
  if (!args[0]) return client.reply(m.chat, 'Tidak ada url', m)
  let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
//   let ss = await (await fetch('http://api-melodicxt-2.herokuapp.com/api/ssweb?url=' + url + '&apiKey=administrator')).json()
  client.sendFile(m.chat, `https://api-rull.herokuapp.com/api/ssweb?url=${url}` , 'screenshot.png', url, m)
}
handler.help = ['ssweb'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^ss(web)?f?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.exp = 20
handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

