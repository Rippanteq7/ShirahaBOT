const { webpToMp4 } = require("../lib/functions")


let handler = async(m, { client }) => {
    if (!m.quoted) throw `tag sticker yang akan di convert ke mp4`
    if (m.quoted && m.quoted.mimetype !== 'image/webp') throw `tag sticker yang akan di convert ke mp4`
    let sticker = await m.quoted.download()
    const mp4 = await webpToMp4(sticker)
    client.sendFile(m.chat, mp4, '', '', m)
}


handler.command = /^to(mp4|gif)$/i
handler.owner = true
module.exports = handler