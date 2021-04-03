const { yta, ytv, shortURL } = require('../lib/functions')
const { monospace } = require('../lib/utils')
let limit = 60
let handler = async(m, {client, args, command, usedPrefix, isPrems, isOwner }) => {
    console.log(command);
    client.youtube = client.youtube ? client.youtube : {}
    let errMsg = monospace(`[❗] Tag pesan hasil pencarian Youtube ${client.user.name}, dan kirim perintah ${usedPrefix+command} <urutan>\nContoh: ${usedPrefix+command} 2`)
    if (args.length === 0) throw errMsg
    else if (args.length === 0 && !m.quoted && !m.quoted.id) throw errMsg
    else if (!m.quoted) throw errMsg
    else if (m.quoted && !client.youtube[m.quoted.id]) throw errMsg
    else if (!m.quoted && isNaN(parseInt(args[0]))) throw errMsg
    else {
        let url = 'https://youtu.be/' + client.youtube[m.quoted.id][parseInt(args[0]) - 1]
        switch(command) {
            case 'getmusic':
            case 'musik':
            case 'music':
                 var { dl_link, thumb,title, filesizeF, filesize } = await yta(url)
                 var isLimit = (isPrems || isOwner ? 99: limit) * 1024 < filesize
                 var caption = `*Title:* ${monospace(title)}\n`
                  + `*Filesize:* ${monospace(filesizeF)}\n\n`
                  var shortUrl
                  if (isLimit) {
                    try {
                      shortUrl = await shortURL(dl_link)
                    }catch {
                      shortUrl = dl_link
                    }finally {
                      caption += `_*Ukuran File terlalu besar silahkan download melalu link dibawah ini!*_\n\n${shortUrl}`
                    }
                  }else caption += '_*Tunggu sebentar file sedang dikirim*_'
                  
                  client.sendFile(m.chat, thumb, 'ytmp3.png', caption, m)
                  if (!isLimit) return client.sendFile(m.chat, dl_link, `${title}.mp3`, null, m, {asDocument: true})
                break
            case 'video':
            case 'getvideo':
            case 'vidio':
                 var { dl_link, thumb,title, filesizeF, filesize } = await ytv(url)
                 var isLimit = (isPrems || isOwner ? 99: limit) * 1024 < filesize
                 var caption = `*Title:* ${monospace(title)}\n`
                  + `*Filesize:* ${monospace(filesizeF)}\n\n`
                  var shortUrl
                  if (isLimit) {
                    try {
                      shortUrl = await shortURL(dl_link)
                    }catch {
                      shortUrl = dl_link
                    }finally {
                      caption += `_*Ukuran File terlalu besar silahkan download melalu link dibawah ini!*_\n\n${shortUrl}`
                    }
                  }else caption += '_*Tunggu sebentar file sedang dikirim*_'
                  
                  client.sendFile(m.chat, thumb, 'ytmp3.png', caption, m)
                  if (!isLimit) return client.sendFile(m.chat, dl_link, `${title}.mp4`, '', m, {asDocument: true})
                break
  
        }
    }
}

handler.help = ['']
handler.tags = ['']
handler.command = /^((get|)vid(e|i)o|(get|)musi(c|k))$/i
handler.limit = true
handler.group = true

module.exports = handler

const more = String.fromCharCode(8206)
function readMore() {
  return more.repeat(4001)
}


