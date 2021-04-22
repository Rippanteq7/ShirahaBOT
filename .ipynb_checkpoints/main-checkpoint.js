//INIT
require('./config.js')
let { WAConnection: _WAConnection, WA_MESSAGE_STUB_TYPES } = require('@adiwajshing/baileys')
let { generate } = require('qrcode-terminal')
let qrcode = require('qrcode')
let simple = require('./lib/simple')
let mongoose = require('mongoose')
let yargs = require('yargs/yargs')
let syntaxerror = require('syntax-error')
let chalk = require('chalk')
let fs = require('fs')
let path = require('path')
let util = require('util')
let { logInfo, logError, monospace } = require('./lib/utils')
let WAConnection = simple.WAConnection(_WAConnection)
global.timestamp = {
  start: new Date
}
const Schema = mongoose.Schema
const DBSchema = new Schema({
  database: Object
})
const _db = mongoose.model('database', DBSchema)
global.DB
const dataURI = 'mongodb+srv://administrator:Doaibuku@database0.tbkdy.mongodb.net/data-bot?retryWrites=true&w=majority'
mongoose.connect(dataURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(async() => {
     const data = (await _db.findOne()).database
     global.DB = data 
  
})

const PORT = process.env.PORT || 3000
let opts = yargs(process.argv.slice(2)).exitProcess(false).parse()
global.opts = Object.freeze({...opts})
let ownerNumber = global.owner.map(v=> v + '@s.whatsapp.net')
let authFile = 'session.json'
global.client = new WAConnection()
client.regenerateQRIntervalMs = null
if (fs.existsSync(authFile)) client.loadAuthInfo(authFile)
client.on('qr',() => console.log('[❗] Scan kode qr diatas!'))
client.on('credentials-updated', () => fs.writeFileSync(authFile, JSON.stringify(client.base64EncodedAuthInfo())))
let lastJSON = JSON.stringify(global.DB)
setInterval(async () => {
  logInfo('Saving database . . .')
  if (JSON.stringify(global.DB) == lastJSON) logInfo(`Database is Update, USERS: ${global.DB['users'].length}, GROUP: ${global.DB['groups'].length}`)
  else {
   const data = await _db.findById("60350520b3b3b6128b312191")
   const data2 = {
     database: {
       ...global.DB
     }
   }
   Object.assign(data, data2)
    await data.save()
    logInfo('Done saving database!')
    lastJSON = JSON.stringify(global.DB)
  }
}, 60 * 2000) // Save every 2 minutes

client.levelUp = (m) => {
    if (!m.isGroup) return 
    let user = global.DB['users'].find(v => v.jid == m.sender)
    if (!user) return
    if (m.key.fromMe) return
    const nxtLvl = 500 * (Math.pow(2, user.level))
    user.nextLevel = nxtLvl
    user.exp += m.exp
    if (nxtLvl <= user.exp) {
      user.level += 1
      client.reply(m.chat, `Congratulation *${client.getName(m.sender)}* kamu telah naik level\n *${user.level - 1} > ${user.level}*`, m)
    }
    
}


client.handler = async function (m) {
  try {
  	simple.smsg(this, m)
    m.exp = 0
    m.limit = false
    if (!ownerNumber.includes(m.sender) && opts['devmode']) return
    m.isOwner = ownerNumber.includes(m.sender)
    if (!m.text)  return
    if (m.isBaileys) return
    if (global.DB['users'].find(user => user.jid == m.sender) && global.DB['users'].find(v => v.jid == m.sender).isBanned && !global.ownerNumber.includes(m.sender))return
    try {
      //DATABASE
     if (global.DB['users'].find(v => v.jid == m.sender)) m.exp += 5
     if (m.isGroup && m.chat ) {
       let groupMeta = await this.groupMetadata(m.chat)
       if(!global.DB['groups'].find(v=> v.jid == m.chat)) {
           let member = []
           for(let user of groupMeta.participants) {
              member.push({...user, sticLimit: 4, badLimit: 5, isMute: false, isAfk: false})
           }
           global.DB['groups'].push({
            prefix: '!',
            isBanned: false,
            welcome: false,
            farewell: false,
            stickSpam: false,
            antiLink: false,
            isHentai: false,
            afk: false,
            jid: m.chat,
            members: member
          })
       }else {
         let member = global.DB['groups'].find(v => v.jid == m.chat).members.map(v=> v.jid)
         for(let user of groupMeta.participants.filter(u => !member.includes(u.jid))) {
           if (!member.includes(user.jid)) global.DB['groups'].find(u => u.jid == m.chat).members.push({...user, sticLimit: 4, badLimit: 5, isMute: false, isAfk: false})
           
         }
       }
      }
      if (!global.DB['users'].find(u => u.jid == m.sender)) {
        global.DB['users'].push({jid: m.sender, limit: 15, isBanned: false, money: 500, exp: 1, level: 0, nextLevel: 0, lastClaim: 0, pro: false, adminBot: false })
      }
      
    } catch (e) {
      console.log(e, global.DB['groups'], global.DB['users'])
    }
    //AFK
    if (m.isGroup) {
      try {
        let userAfk = global.DB['groups'].find(v => v.jid == m.chat).members.filter(u => u.isAfk == true).map(b=> b.jid)
        if (m.mentionedJid.length > 0) {
           for (let i = 0; i < 5; i++) {
              if (userAfk.includes(m.mentionedJid[i])) {
                 let user =  global.DB['groups'].find(v=> v.jid == m.chat).members.find(v=> v.jid == m.mentionedJid[i])
                 let teksAfk = `Kak *${this.getName(m.mentionedJid[i])}*, Sedang afk sekarang\n`
                 if (user.afkReason && user.afkReason.length > 0) teksAfk += `Katanya, *${user.afkReason.trim()}*`
                 this.reply(m.chat, teksAfk.trim(), m)
              }
           }
        } else if (m.quoted && m.quoted.sender && userAfk.includes(m.quoted.sender)) {
                 let user =  global.DB['groups'].find(v=> v.jid == m.chat).members.find(v=> v.jid == m.quoted.sender)
                 let teksAfk = `Kak *${this.getName(m.quoted.sender)}*, Sedang afk sekarang\n`
                 if (user.afkReason && user.afkReason.length > 0) teksAfk += `Katanya, *${user.afkReason.trim()}*`
                 this.reply(m.chat, teksAfk.trim(), m)
        }
        if (userAfk.includes(m.sender)) {
         let user = global.DB['groups'].find(u => u.jid == m.chat).members.find(u => u.jid == m.sender)
          user.isAfk = false
          user.afkReason = null
          this.reply(m.chat, `*${this.getName(m.sender)}* Tidak lagi AFK sekarang, Okaeri kak *${this.getName(m.sender)}*!`, m)
        }
      }catch(e) {
        console.log(e, m.chat)
      }
    }
    //INIT
  	let usedPrefix
  	for (let name in global.plugins) {
  	  let plugin = global.plugins[name]
      if (!plugin) continue
      let _prefix = plugin.customPrefix ? plugin.customPrefix :  m.isGroup && global.DB['groups'].find(v=>v.jid==m.chat).prefix ? new RegExp('^[' + global.DB['groups'].find(v=>v.jid == m.chat).prefix + ']') : global.prefix
  	  // console.log(_prefix);
      // console.log(_prefix.test(m.text));
      usedPrefix = (_prefix.exec(m.text) || '')[0]
      if (_prefix.test(m.text)) {
        let noPrefix = usedPrefix !== '' ? m.text.replace(usedPrefix, '') : m.text
  		  let [command, ...args] = noPrefix.trim().split` `.filter(v=>v)
        let _args = noPrefix.trim().split` `.slice(1)
        let text = _args.join` `
  		  command = (command || '').toLowerCase()
        let isOwner = ownerNumber.includes(m.sender) || m.key.fromMe
  			let isAccept = plugin.command instanceof RegExp ? plugin.command.test(command) :
        plugin.command instanceof Array ? plugin.command.includes(command) :
        plugin.command instanceof String ? plugin.command == command : false
  			if (!isAccept) continue
        let isMods = isOwner || m.key.fromMe
        let isPrems = isOwner || global.DB['users'].find(u => u.jid == m.sender).pro
        let groupMetadata = m.isGroup ? await this.groupMetadata(m.chat) : {}
        let participants = m.isGroup ? groupMetadata.participants : []
        let user = m.isGroup ? participants.find(u => u.jid == m.sender) : {}
        let bot = m.isGroup ? participants.find(u => u.jid == this.user.jid) : {}
        let isAdmin = user.isAdmin || user.isSuperAdmin || false
        let isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false
        //Middle ware
        let chats
        if (chats = global.DB['groups'].find(v => v.jid == m.chat)) {
          if (name != 'unbanchat.js' && chats && chats.isBanned) return
        }
        let fail = plugin.fail || global.dfail
        if (plugin.owner && !isOwner) {
          fail('owner', m, this)
          continue
        }
        if (plugin.mods && !isMods) {
          fail('mods', m, this)
          continue
        }
        if (plugin.premium && !isPrems) {
          fail('premium', m, this)
          continue
        }
  			if (plugin.group && !m.isGroup) {
          fail('group', m, this)
          continue
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail('botAdmin', m, this)
          continue
        } else if (plugin.admin && !isAdmin) {
          fail('admin', m, this)
          continue
        }
  			if (plugin.private && m.isGroup) {
          fail('private', m, this)
          continue
        }

        m.isCommand = true
        let xp = 'exp' in plugin ? parseInt(plugin.exp) : 9
        m.exp += xp
        if (!isPrems && global.DB['users'].find(v=>v.jid == m.sender).limit < 1 && plugin.limit) {
          this.reply(m.chat, `Limit kamu habis!, kamu bisa beli melalui *${usedPrefix}buylimit* atau bisa menunggu sampai limit direset!\nJam limit direset: 00:00 WIB`, m)
          continue
        }
        try {
          await plugin(m, {
            usedPrefix,
            noPrefix,
            _args,
            args,
            command,
            text,
            client: this,
            participants,
            groupMetadata,
            isAdmin,
            isBotAdmin,
            isPrems
          })
          if (!isPrems) m.limit = m.limit || plugin.limit || false
        } catch (e) {
          m.limit = false
          m.error = true
          if (typeof e == 'string') this.reply(m.chat, e, m)
          else {
            console.log(e)
            this.reply(m.chat, monospace('[❗] Terjadi kesalahan mungkin disebabkan oleh system!'), m)
            this.reply(ownerNumber[0], util.format(e), m)
          }
        } finally {
          if (m.limit == true && global.DB['users'].find(v => v.jid == m.sender)) global.DB['users'].find(v=> v.jid == m.sender).limit -= m.limit * 1
        }
  			break
  		}
  	}
  } finally {
    if (m && m.sender && global.DB['users'].find(v => v.jid == m.sender)) {
      client.levelUp(m)
    }
    try {
      require('./lib/print')(m, this)
    } catch (e) {
      console.log(m, e)
    }
  }
}
//Client Events
client.on('call', (call) => {
  coonsole.log(call)
})
client.on('message-new', client.handler) 
client.on('error', client.logger.error)
client.on('close',() => {
  if (client.state === 'close') {
    setTimeout(async() => {
      await client.loadAuthInfo(authFile)
      await client.connect()
      global.timestamp.connect = new Date
      
    }, 5000);
  }
})

global.mods = []
global.prems = []

global.dfail = (type, m, client) => {
  let msg = {
    owner: monospace('[❗] Perintah ini hanya dapat digunakan oleh Owner Bot!'),
    mods: monospace('[❗] Perintah ini hanya dapat digunakan oleh Admin Bot!'),
    premium: monospace('[❗] Perintah ini hanya untuk member Premium!'),
    group: monospace('[❗] Perintah ini hanya dapat digunakan di grup!'),
    private: monospace('[❗] Perintah ini hanya dapat digunakan di Chat Pribadi!'),
    admin: monospace('[❗] Perintah ini hanya untuk admin grup!'),
    botAdmin: monospace('[❗]Jadikan ' + client.user.name + ' sebagai admin untuk menggunakan perintah ini!')
  }[type]
  msg && client.reply(m.chat, msg, m)
}

if (opts['test']) {
  client.user = {
    jid: '2219191@s.whatsapp.net',
    name: 'test',
    phone: {}
  }
  client.sendMessage = (chatId, content, type, opts) => client.emit('message-new', {
    messageStubParameters: [],
    key: {
      fromMe: true,
      remoteJid: chatId,
      id: opts ? '3EB0ABCDEF45' : 'biasa'
    },
    message: {
      [type]: content
    },
    messageStubType: 0,
    timestamp: +new Date
  })
  process.stdin.on('data', chunk => client.sendMessage('123@s.whatsapp.net', chunk.toString().trimEnd(), 'conversation'))
}
else client.connect().then(() => {

  
  
  global.timestamp.connect = new Date
})
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/





let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = Object.fromEntries(
  fs.readdirSync(path.join(__dirname, 'plugins'))
    .filter(pluginFilter)
    .map(filename => [filename, {}])
)
for (let filename in global.plugins) {
  try {
    global.plugins[filename] = require('./plugins/' + filename)
  } catch (e) {
    client.logger.error(e)
    delete global.plugins[filename]
  }
}
console.log(Object.keys(global.plugins))
global.reload = (event, filename) => {
  if (pluginFilter(filename)) {
    let dir = './plugins/' + filename
    if (require.resolve(dir) in require.cache) {
      delete require.cache[require.resolve(dir)]
      if (fs.existsSync(require.resolve(dir))) logInfo(`re - require plugin '${dir}'`)
      else {
        logInfo(`deleted plugin '${dir}'`)
        return delete global.plugins[filename]
      }
    } else logInfo(`requiring new plugin '${dir}'`)
    let err = syntaxerror(fs.readFileSync(dir))
    if (err) logError(`syntax error while loading '${dir}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      logError(e)
    }
  }
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)

process.on('exit', () => {
  console.log('BYEE')
})
