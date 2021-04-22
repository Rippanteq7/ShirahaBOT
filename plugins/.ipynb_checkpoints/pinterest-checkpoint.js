const axios = require('axios')

global.pin = global.pin ? global.pin : {}
let handler = async(m, {client , text, command, usedPrefix, args}) => {
  const query = encodeURIComponent(text)
  const { data } = await axios.get('https://rrull-api.herokuapp.com/api/v2/pin?q=' + query)
  if(!data[0]) return m.reply(`Pinterest *${text}* tidak dapat di temukan`)
    if (command == 'pinterest') {
      let caption = `_Kirim perintah ${usedPrefix}getpin <urutan> untuk melihat pinterest_\n*Contoh: ${usedPrefix}getpin 3*\n_______________________________\n\n`
      const res = []
      let uh = 0
      for (let pin of data) {
        caption += `Urutan *${uh += 1}*\n`
        + `*title:* ${pin.title}\n`
        + `*pinner:* ${pin.pinner}\n`
        + `*isVideo:* ${pin.videos.V_HLSV3_MOBILE ? 'Iya' : 'Tidak'}\n`
        + `*Repin:* ${pin.repinCount}\n`
        if (pin.videos.V_HLSV3_WEB) caption += `*Duration:* ${pin.videos.V_HLSV3_MOBILE.duration}\n`
        let width = ''
        let height = ''
        if (!pin.videos.V_HLSV3_WEB) width = `*Width:* ${pin.images.width}\n`
        else width = `*Width:* ${pin.videos.V_HLSV3_MOBILE.width}\n`
        if (!pin.videos.V_HLSV3_WEB) height = `*Heigth:* ${pin.images.height}\n`
        else height = `*Height:* ${pin.videos.V_HLSV3_MOBILE.height}\n`
       caption += width
       + height
       + `_Untuk mengambil pinterest: ${usedPrefix}getpin *${uh}*_\n`
       caption += `_______________________________\n`


        if (!pin.videos.V_HLSV3_MOBILE) {
          res.push(pin.images.url)
        }else {
          res.push(pin.videos.V_HLSV3_MOBILE.url)
        }
      }
      let msg = await client.sendFile(m.chat, data[0].images.url, 'pin.png', caption, m)
      global.pin[msg.key.id] = res
  }else {
      let arg = text.split('#')
      let q = arg ? arg[0] : text
      let x = arg && arg[1] && !isNaN(parseInt(arg[1])) ? parseInt(arg[1]) : 1
      if (x > 5) throw 'Request terlalu banyak max 5!'
      let pins = data.map(v => v.images.url)
      for(let i = 0; i < (pins.length <= x ? pins.length : x); i++) {
          client.sendFile(m.chat, pins[i], 'pin.png', q, m)
      }
  }
}

handler.command = /^(img|)pin(terest|)$/i
handler.help = ['pinterest <teks>', 'imgpin <teks>#<jumlah>']
handler.tags = ['wallpaper']
handler.group = true
handler.limit = true


module.exports = handler
