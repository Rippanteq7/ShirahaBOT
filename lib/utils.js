const {
  Writable,
  Readable
} = require('stream')
const chalk = require('chalk')
const Jimp = require('jimp')
const color = (text, color) => {
  return !color ? chalk.green(text): color.startsWith('#') ? chalk.hex(color)(text): chalk.keyword(color)(text)
}
const fs = require('fs')

const bgColor = (text, bgcolor) => {
  return !bgcolor ? chalk.green(text): chalk.bgKeyword(bgcolor)(text)
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const baseURI = (buffer, metatype = 'text/plain') => {
  return `data:${metatype};base64,${buffer.toString('base64')}`
}

const getGroupAdmins = (participants) => {
  admins = []
  for (let i of participants) {
    i.isAdmin ? admins.push(i.jid): ''
  }
  return admins
}

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}.${ext}`
}


const stream2Buffer = (cb = noop) => {
  return new Promise(resolve => {
    let write = new Writable()
    write.data = []
    write.write = function (chunk) {
      this.data.push(chunk)
    }
    write.on('finish', function () {
      resolve(Buffer.concat(this.data))
    })

    cb(write)
  })
}


/**
* Convert Buffer to Readable Stream
* @param {Buffer} buffer
* @returns {ReadableStream}
*/

const buffer2Stream = (buffer) => {
  return new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    }
  })
}

const usedCommandRecently = new Set()

/**
* Check is number filtered
* @param  {String} from
*/
const isFiltered = (from) => !!usedCommandRecently.has(from)

/**
* Add number to filter
* @param  {String} from
*/
const addFilter = (from) => {
  usedCommandRecently.add(from)
  setTimeout(() => usedCommandRecently.delete(from), 3000) // 5sec is delay before processing next command
}


const pickRandom = (arr, count = 1) => {
  let result = []
  for (let i = 0; i < Math.max(count, 1); i++) {
    result.push(arr[Math.floor(arr.length * Math.random())])
  }
  return result
}

const monospace = (string = '') => {
  let _3 = '`'.repeat(3)
  return _3 + string + _3
}

const logInfo = (info) => {
  return console.log(color(`<System Info>\n`, '#00ff32'), color(info, '#4bdbff'))
}

const logError = (err) => {
  return console.log(color('<ERROR>', 'red'), err)
}

const YT_URL_REGEX = (url) => {
  const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
  return !url ? ytIdRegex: ytIdRegex.test(url)
}


const timeAFK = (current, previous) => {
  var msPerMinute = 60 * 1000
  var msPerHour = msPerMinute * 60
  var msPerDay = msPerHour * 24
  var msPerMonth = msPerDay * 30
  var msPerYear = msPerDay * 365
  var elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed/1000) + ' Detik yang lalu';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed/msPerMinute) + ' Menit yang lalu';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed/msPerHour) + ' Jam yang lalu';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed/msPerDay) + ' Hari yang lalu';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed/msPerMonth) + ' Bulan yang lalu';
  } else {
    return Math.round(elapsed/msPerYear) + ' Tahun yang lalu';
  }
}


const resizeImage = (buffer, size = 500) => {
  return new Promise(async(resolve, reject) => { 
     const img = await Jimp.read(buffer)
     img.resize(size, Jimp.AUTO)
     img.getBufferAsync('image/png').then(buffer => {
       resolve(buffer)
  }).catch(reject)
 })
}




module.exports = {
  isFiltered,
  addFilter,
  getGroupAdmins,
  getRandom,
  baseURI,
  sleep,
  stream2Buffer,
  buffer2Stream,
  pickRandom,
  monospace,
  color,
  bgColor,
  logInfo,
  logError,
  YT_URL_REGEX,
  timeAFK,
  resizeImage
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'lib/utils.js'"))
  delete require.cache[file]
})
