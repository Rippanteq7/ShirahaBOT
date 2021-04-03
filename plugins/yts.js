const yts = require('yt-search')
const { monospace } = require('../lib/utils')



let handler = async(m, { client, text, usedPrefix, command }) => {
  client.youtube = client.youtube ? client.youtube : {}
  if (!text) throw monospace(`[❗] Example: ${usedPrefix + command} Ember island Stay`)
  try {
    const search = (await yts(text)).all.filter(s=> s.type == 'video')
    let caption = `*Hasil Pencarian: ${text}*\n____________________________________\n`
    + `_Untuk Mengambil Musik: ${usedPrefix}music <urutan>_\n`
    + `*Contoh:* ${usedPrefix}musik 3\n`
    + `_Untuk mengambil video: ${usedPrefix}video <urutan>_\n`
    + `*Contoh:* ${usedPrefix}video 4\n____________________________________\n`
    let i = 0
    for(let yt of search) {
      caption += `*Urutan: ${i += 1}*\n`
      + `*Title:* ${yt.title}\n`
      + `*Durasi:* ${yt.timestamp}\n`
      + `*Views:* ${yt.views}\n`
      + `*Uploaded:* ${yt.ago}\n`
      + `*Channel:* ${yt.author ? yt.author.name : 'Unknown'}\n`
     // + `*VideoId:* ${yt.videoId}\n`
      + `____________________________________\n`
    }
    let msg = await client.sendFile(m.chat, search[0].image, 'image.png', caption, m)
    client.youtube[msg.key.id] = search.map(v=> v.videoId)
  //  console.log(client.cacheYT)

  } catch(e) {
    throw e
  }
}


handler.help = ['youtube <teks>']
handler.tags = ['media']
handler.command = /^(yt|youtube)$/i
handler.group = true
handler.limit = true
handler.fail = null
handler.exp = 50
module.exports = handler