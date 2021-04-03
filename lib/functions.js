const fetch = require('node-fetch')
const {
  default: axios
} = require('axios')
const {
  spawn
} = require('child_process')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const request = require('request')
const stream = require('stream')
const {
  promisify
} = require(`util`)
const pipeline = promisify(stream.pipeline)
const {
  color,
  bgColor
} = require('./utils')
const {
  fromBuffer
} = require('file-type')
//const { caption } = require('./caption')
const FormData = require('form-data')
const {
  stream2Buffer,
  buffer2Stream
} = require('./utils')
const {
  getRandom
} = require('./utils')
const {
  JSDOM
} = require('jsdom')
let tmp = path.join(__dirname, '../tmp/');


const wall = async (query) => {
  console.log(color('[WALL] getting query: '), query)
  var q = query.replace(/ /g, '+')
  const response = await fetch(`https://wall.alphacoders.com/api2.0/get.php?auth=3e7756c85df54b78f934a284c11abe4e&method=search&term=${q}`)
  if (!response.ok) throw new Error(`[WALL] unexpected response ${response.statusText}`)
  const json = await response.json();
  const match = json.wallpapers.length
  const r = match[Math.floor(Math.random() * match.length)];
  if (json.success === true) {
    return json.wallpapers[r].url_image
  } else if (json.wallpapers.length < 1) {
    return `https://i.ibb.co/gz2P4yX/20201102-181713.jpg`

  }
}

const getBuffer = async (url, options = {}) => {
  //console.log(color('[GETBUFFER]', 'orange'), url, color('[OPTION]', 'orange'), options)
  try {
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    console.log(color('[GETBUFFER] Processing finished!'))
    return Buffer.from(res.data, 'binary')
  } catch (e) {
    console.log(`[GETBUFFER]: ${e}`)
  }
}

const wait = async (media) => new Promise(async (resolve, reject) => {
  const attachmentData = `data:image/jpeg;base64,${media.toString('base64')}`
  try {
    const response = await fetch("https://trace.moe/api/search", {
      method: "POST",
      body: JSON.stringify({
        image: attachmentData
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error(`Gambar tidak ditemukan!`);
    const result = await response.json()
    const {
      is_adult,
      title,
      title_chinese,
      title_romaji,
      title_english,
      episode,
      season,
      similarity,
      filename,
      at,
      tokenthumb,
      anilist_id
    } = result.docs[0]
    let belief = similarity < 0.89 ? "Yuna memiliki keyakinan rendah dalam hal ini : " : ""
    let ecch = is_adult ? "Iya" : "Tidak"
    resolve({
      video: await getBuffer(`https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`),
      teks: `*${belief}*
*Ecchi:* ${monoscape(ecch)}
*Japan:* ${monoscape(title)}
*Romaji:* ${monoscape(title_romaji)}
*English:* ${monoscape(title_english)}
*Episode:* ${monoscape(`${episode}`)}
*Season:* ${monoscape(season)}`

    });
  } catch (e) {
    reject(e)
  }
})

//~> 


const customFfmpeg = async (type, mediaData, ext) => new Promise(async (resolve, reject) => {
  let tipe = type.toLowerCase()
  switch (tipe) {
    case 'bass':
      let dB = 20
      let freq = 60
      const bass = await stream2Buffer(write => {
        ffmpeg(buffer2Stream(mediaData))
          .audioFilter('equalizer=f=' + freq + ':width_type=o:width=2:g=' + dB)
          .format('mp3')
          .on('start', commandLine => console.log(color('[FFmpeg]', 'yellow'), commandLine))
          .on('error', err => reject(err))
          .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
          .stream(write)
      })
      return resolve(bass)
      break
    case 'distorsimp4':
    case 'distordmp4':
      const distord = await stream2Buffer(write => {
        ffmpeg(buffer2Stream(mediaData))
          .complexFilter('scale=iw/2:ih/2,eq=saturation=100:contrast=10:brightness=0.3:gamma=10,noise=alls=100:allf=t,unsharp=5:5:1.25:5:5:1,eq=gamma_r=100:gamma=50,scale=iw/5:ih/5,scale=iw*4:ih*4,eq=brightness=-.1,unsharp=5:5:1.25:5:5:1')
          .audioFilter('aeval=sgn(val(ch))')
          .outputOptions(
            '-codec:v', 'libx264',
            '-crf', '32',
            '-preset', 'veryfast'
          )
          .format('mp4')
          .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
          .on('error', err => reject(err))
          .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
          .stream(write)
      })
      return resolve(distord)
      break
    case 'distordmp3':
      const distorsi = await stream2Buffer(write => {
        ffmpeg(buffer2Stream(mediaData))
          .audioFilter('aeval=sgn(val(ch))')
          .format('mp3')
          .on('start', commandLine => console.log(color('[FFmpeg]', 'yellow'), commandLine))
          .on('error', err => reject(err))
          .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
          .stream(write)
      })
      return resolve(distorsi)
      break
    case 'sticker':
      const sticker = await stream2Buffer(write => {
        ffmpeg(mediaData)
          .input(buffer2Stream(mediaData))
          .on('start', commandLine => console.log(color('[FFMPEG]', 'yellow'), commandLine))
          .on('error', err => reject(err))
          .on('end', () => console.log(color('[FFMPEG] Processing Finished')))
          .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
          .toFormat('webp')
          .stream(write)
      })
      return resolve(sticker)
      break
    case 'sgif':
    case 'stickergif':
      let tmp = path.join(__dirname, '../tmp', (new Date * 1) + '.' + ext)
      let out = tmp.replace(new RegExp(ext + '$'), 'webp')
      fs.writeFileSync(tmp, mediaData)
      ffmpeg(tmp)
        .inputFormat(ext)
        .on('start', commandLine => console.log(color('[FFMPEG] type: SGIF', 'yellow'), commandLine))
        .on('error', err => {
          reject(err)
          fs.unlinkSync(tmp)
          if (fs.existsSync(out)) fs.unlinkSync(out)
        })
        .on('end', () => {
          console.log(color('[FFMPEG] Processing Finished!'))
          fs.unlinkSync(tmp)
          resolve(fs.readFileSync(out))
          if (fs.existsSync(out)) fs.unlinkSync(out)
        })
        .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
        .toFormat('webp')
        .save(out)
      break
    case 'fry':
      const filter = 'eq=saturation=100,unsharp=5:5:1.25:5:5:1.0,noise=alls=40:allf=t'
      const quality = '20'
      try {
        let fry = await stream2Buffer(write => {
          ffmpeg(buffer2Stream(mediaData))
            .complexFilter(filter + ',scale=iw/2:ih/2')
            .outputOptions('-q:v', quality)
            .format('mjpeg')
            .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
            .on('error', error => console.log(color('[FFmpeg]'), error))
            .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
            .stream(write)
        })
        anu = await stream2Buffer(write => {
          ffmpeg(buffer2Stream(fry))
            .complexFilter(filter + ',scale=iw/2:ih/2')
            .outputOptions('-q:v', quality)
            .format('mjpeg')
            .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
            .on('error', error => console.log(color('[FFmpeg]'), error))
            .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
            .stream(write)
        })
        ini = await stream2Buffer(write => {
          ffmpeg(buffer2Stream(anu))
            .complexFilter(filter)
            .outputOptions('-q:v', quality)
            .format('mjpeg')
            .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
            .on('error', error => console.log(color('[FFmpeg]'), error))
            .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
            .stream(write)
        })
        ono = await stream2Buffer(write => {
          ffmpeg(buffer2Stream(ini))
            .complexFilter(filter)
            .outputOptions('-q:v', quality)
            .format('mjpeg')
            .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
            .on('error', error => console.log(color('[FFmpeg]'), error))
            .on('end', () => console.log(color('[FFmpeg]'), 'Processing finished!'))
            .stream(write)
        })
        return resolve(ono)
      } catch (err) {
        reject(err)
      }
      break
    case 'tomp3':
      const audio = await stream2Buffer(async (write) => {
        await ffmpeg(buffer2Stream(mediaData))
          .format('mp3')
          .on('start', commandLine => console.log(color('[FFmpeg]'), commandLine))
          .on('error', () => console.log(color('[FFmpeg] Error')))
          .on('end', async () => {
            console.log(color('[FFmpeg]'), 'Processing finished!')
          })
          .stream(write)
      })
      resolve(audio)
      break

    default:
      console.log(color('[FFMPEG] unexpected type:', 'red'), tipe)
  }


})





const uploadImage = (buffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        ext
      } = await fromBuffer(buffer)
      let form = new FormData()
      form.append('file', buffer, 'tmp.' + ext)
      let res = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: form
      })
      let img = await res.json()
      if (img.error) reject(img.error)
      else resolve('https://telegra.ph' + img[0].src)
    } catch (e) {
      reject(e)
    }
  })
}





// const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
function post(url, formdata) {
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: "*/*",
      'accept-language': "en-US,en;q=0.9",
      'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: new URLSearchParams(Object.entries(formdata))
  })
}

const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
async function yt(url, quality, type, bitrate, server = 'id4') {
  if (!ytIdRegex.test(url)) throw 'Maaf url yang anda kirim tidak valid'
  let ytId = ytIdRegex.exec(url)
  url = 'https://youtu.be/' + ytId[1]
  let res = await post(`https://www.y2mate.com/mates/${server}/analyze/ajax`, {
    url,
    q_auto: 0,
    ajax: 1
  })
  let json = await res.json()
  let {
    document
  } = (new JSDOM(json.result)).window
  let tables = document.querySelectorAll('table')
  let table = tables[{
    mp4: 0,
    mp3: 1
  } [type] || 0]
  let list
  switch (type) {
    case 'mp4':
      list = Object.fromEntries([...table.querySelectorAll('td > a[href="#"]')].filter(v => !/\.3gp/.test(v.innerHTML)).map(v => [v.innerHTML.match(/.*?(?=\()/)[0].trim(), v.parentElement.nextSibling.nextSibling.innerHTML]))
      break
    case 'mp3':
      list = {
        '128kbps': table.querySelector('td > a[href="#"]').parentElement.nextSibling.nextSibling.innerHTML
      }
      break
    default:
      list = {}
  }
  let filesize = list[quality]
  let id = /var k__id = "(.*?)"/.exec(document.body.innerHTML) || ['', '']
  let thumb = document.querySelector('img').src
  let title = document.querySelector('b').innerHTML
  let res2 = await post(`https://www.y2mate.com/mates/${server}/convert`, {
    type: 'youtube',
    _id: id[1],
    v_id: ytId[1],
    ajax: '1',
    token: '',
    ftype: type,
    fquality: bitrate
  })
  let json2 = await res2.json()
  let KB = parseFloat(filesize) * (1000 * /MB$/.test(filesize))
  return {
    dl_link: /<a.+?href="(.+?)"/.exec(json2.result)[1],
    thumb,
    title,
    filesizeF: filesize,
    filesize: KB
  }
}





/**
 * Get meme from random subreddit
 *
 * @param  {String} _subreddit
 * @return  {Promise} Return meme from dankmemes, wholesomeanimemes, wholesomememes, AdviceAnimals, MemeEconomy, memes, terriblefacebookmemes, teenagers, historymemes
 */

const random = () => new Promise(async (resolve, reject) => {
  const subreddits = ['dankmemes', 'wholesomeanimemes', 'wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'memes', 'terriblefacebookmemes', 'teenagers', 'historymemes', 'okbuddyretard', 'nukedmemes']
  const randSub = subreddits[Math.random() * subreddits.length | 0]
  console.log('looking for memes on ' + randSub)
  try {
    const {
      data
    } = await axios.get('https://meme-api.herokuapp.com/gimme/' + randSub)
    resolve(data.url)
  } catch (err) {
    reject(err)
  }
})

/**
 * create custom meme
 * @param  {String} imageUrl
 * @param  {String} topText
 * @param  {String} bottomText
 */

const custom = (imageUrl, top, bottom) => new Promise(async (resolve, reject) => {
  topText = top.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
  bottomText = bottom.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
  try {
    const resp = await axios.get(`https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${imageUrl}`)
    resolve(resp.data)
  } catch (err) {
    reject(err)
  }
})

const meme = {
  custom: custom,
  random: random,
}

function monoscape(string) {
  var _3 = '`'.repeat(3)
  return _3 + string + _3
}

const webpToMp4 = (mediaData) => {
  let out = 1 * new Date + '_temp.gif'
  out = path.join(tmp, out)
  let out2 = 1 * new Date + 'to_video.mp4'
  out2 = path.join(tmp, out2)
  let temp = 1 * new Date + '_tmp.webp'
  temp = path.join(tmp, temp)
  fs.writeFileSync(temp, mediaData)
  if (!mediaData) return Buffer.alloc(0)
  return new Promise((resolve, reject) => {
    spawn('convert', [
        '-delay',
        '10',
        '-dispose',
        'none',
        `${temp}`,
        '-coalesce',
        '-loop',
        '0',
        '-layers',
        'optimize',
        `${out}`
      ])
      .on('error', () => fs.unlinkSync(temp))
      .on('error', reject)
      .on('exit', () => {
        ffmpeg(out)
          .outputOptions([
            '-movflags faststart',
            '-pix_fmt yuv420p',
            '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
          ])
          .inputFormat('gif')
          .on('error', (err) => {
            reject(err)
            fs.unlinkSync(temp)
            fs.unlinkSync(out)
          })
          .on('end', () => {
            resolve(fs.readFileSync(out2))
            fs.unlinkSync(temp)
            fs.unlinkSync(out2)
            fs.unlinkSync(out)
          })
          .save(out2)
      })
  })
}

const shortURL = async (url) => {
  try {
    const resp = await axios.get(`https://tobz-api.herokuapp.com/api/bitly?url=${url}&apikey=BotWeA`)
    let finalUrl = resp.data.result
    return finalUrl
  } catch (er) {
    throw er
  }
}


module.exports = {
  wall,
  getBuffer,
  getRandom,
  wait,
  customFfmpeg,
  uploadImage,
  yt,
  yta(url, server = 'id4') {
    return yt(url, '128kbps', 'mp3', '128', server)
  },
  ytv(url, server = 'id4') {
    return yt(url, '360p', 'mp4', '360', server)
  },
  meme,
  webpToMp4,
  shortURL
}