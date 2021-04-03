

let handler = async(m, { client, text}) => {
  if (text) client.sendFile(m.chat, 'https://api.xteam.xyz/attp?file&text=' + encodeURIComponent(text), 'anu.webp', '', m, { asSticker: true})
  else throw 'Teks nya mana kak?'
}

handler.command = /^ttg$/i
handler.tags = ['maker']
handler.help = ['ttg <text>']
handler.limit = true
handler.group = true


module.exports = handler