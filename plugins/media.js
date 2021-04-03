const axios = require('axios')
const yts = require('yt-search')
const {
  YT_URL_REGEX,
  monospace
} = require('../lib/utils')
const {
  yta,
  ytv
} = require('../lib/functions')
let limit = 60

let handler = async(m, { client, text, args, command, isOwner, isPrems, usedPrefix }) => {
  if (!text) throw monospace(`[❗] Example: ${usedPrefix + command} Op kanojo  atau dengan url`)
  else {
    try {
      switch (command) {
        case 'ytmp3':
          if (YT_URL_REGEX(args[0])) {
            let { dl_link, thumb,title, filesizeF, filesize } = await yta(args[0])
            let isLimit = (isPrems || isOwner ? 99: limit) * 1024 < filesize
            let caption = `*Title:* ${monospace(title)}\n`
            + `*Filesize:* ${monospace(filesizeF)}\n\n`
            let shortUrl
            if (isLimit) {
              try {
                shortUrl = (await axios.get(`https://tobz-api.herokuapp.com/api/bitly?url=${dl_link}&apikey=BotWeA`)).data.result
                
              }catch {
                shortUrl = dl_link
              }finally {
                caption += `_*Ukuran File terlalu besar!, silahkan download melalui link dibawah ini*_\n${shortUrl}`
              }
      
            }else {
              caption += `_*Tunggu sebentar file sedang di kirim...*_`
            }
            client.sendFile(m.chat, thumb, 'ytmp3.png', caption, m)
            if (!isLimit) return client.sendFile(m.chat, dl_link, `${title}.mp3`, null, m, {asDocument: true})
          } else {
            let { teks, thumb, url, title } = await getInfo(text)
            client.sendFile(m.chat, thumb, 'anu.png', teks, m)
            let hasil = await yta(url)
            client.sendFile(m.chat, hasil.dl_link, `${title}.mp3`, '', m, {
              asDocument: true
            })
          }
          break
        case 'ytmp4':
          if (YT_URL_REGEX(args[0])) {
            let { dl_link, thumb, title, filesizeF, filesize } = await ytv(args[0])
            let isLimit = (isPrems || isOwner ? 99: limit) * 1024 < filesize
            let caption = `*Title:* ${monospace(title)}\n`
            + `*Filesize:* ${monospace(filesizeF)}\n\n`
             let shortUrl
            if (isLimit) {
              try {
                shortUrl = (await axios.get(`https://tobz-api.herokuapp.com/api/bitly?url=${dl_link}&apikey=BotWeA`)).data.result
                
              }catch {
                shortUrl = dl_link
              }finally {
                caption += `_*Ukuran File terlalu besar!, silahkan download melalui link dibawah ini*_\n${shortUrl}`
              }
      
            }else {
              caption += `_*Tunggu sebentar file sedang di kirim...*_`
            }
            client.sendFile(m.chat, thumb, 'ytmp3.png', caption, m)
            if (!isLimit) client.sendFile(m.chat, dl_link, `${title}.mp4`, '', m, { asDocument: true})
          } else {
            let { teks, thumb, url, title } = await getInfo(text)
            client.sendFile(m.chat, thumb, 'anu.png', teks, m)
            let hasil = await ytv(url)
            client.sendFile(m.chat, hasil.dl_link, `${title}.mp4`,'', m, { asDocument: true})
          }
          break
        case 'play':
          const play = await getInfo(text)
          client.sendFile(m.chat, play.thumb, 'ini.png', play.teks, m)
          const finalPlay = await yta(play.url)
          client.sendFile(m.chat, finalPlay.dl_link, `${finalPlay.title}.mp3`, null, m)
          break
      }

    }catch(err) {
      throw err
    }
  }
}
handler.command = /^(ytmp3|ytmp4|play)$/i
handler.limit = true
handler.group = true
handler.help = ['ytmp3 <url|teks>', 'ytmp4 <url|teks>']
handler.tags = ['media']

module.exports = handler


async function getInfo(query) {
  try {
    const data = (await yts(query)).all.filter(v => v.type == 'video' && v.seconds <= 400)[0]
    let teks = `*Title:* ${monospace(data.title)}\n`
    + `*Durasi:* ${monospace(data.timestamp)}\n`
    + `*Views:* ${monospace(data.views)}\n`
    + `*Channel:* ${monospace((data.author ? data.author.name: 'Unknown'))}\n`
    + `*Uploaded:* ${monospace(data.ago)}\n`
    return {
      teks,
      url: data.url,
      thumb: data.image,
      title: data.title
    }
  }catch(err) {
    throw err
  }
}





const more = String.fromCharCode(8206)
function readMore() {
  return more.repeat(4001)
}