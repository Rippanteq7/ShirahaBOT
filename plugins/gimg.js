const gis = require('g-i-s')

let handler = async(m, {client, text}) => {
  if (!global.DB['groups'].find(v=> v.jid == m.chat).isHentai) throw `Fitur NSFW belum diaktifkan di group ini!`
  if (!text) throw `Text nya??`
  let teks = encodeURIComponent(text)
  gis(teks, (err, result) => {
    if (err) throw err
    let hasil = pickRandom(result)
    client.sendFile(m.chat, hasil.url, 'google.png', '', m)
    
  })
  
  
}
handler.command = /^g(oogle|)img$/i
handler.help = ['googleimg <query>']
handler.tags = ['wallpaper']
handler.group = true
handler.limit = true
module.exports = handler






function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}