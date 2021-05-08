let tags = {
  'help': ' *MENU* ',
  'main': ' *BOT* ',
  'user': ' *USER* ',
  'convert': ' *CONVERT* ',
  'media': ' *MEDIA* ',
  'anime': ' *ANIME* ',
  'wallpaper': ' *WALLPAPER* ',
  'maker': ' *TEXTMAKER* ',
  'admin': ' *ADMIN GROUP* ',
  'group': ' *GROUP* ',
  'game': ' *GAMES* ',
  'quotes': ' *QUOTES* ',
  'internet': ' *INTERNET* ',
  'kerang': ' *KERANG AJAIB* ',
  'tools': ' *TOOLS* ',
     // 'host': 'Host',
    //  'advanced': ' *ADVANCED* ',
    //  'info': 'Info',
      //'': 'No Category',
}


let handler  = async (m, { client, usedPrefix: _p, command}) => {
  try {
    let your = global.DB['users'].find(v=> v.jid == m.sender)
    your = your ? your : { limit: 15, money: 0, exp: 0 }

    let name = your.name || client.getName(m.sender)
  
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
   // let totalreg = Object.keys(global.DATABASE._data.users).length
    let cmd = command.replace('menu', '')
    cmd = cmd == '' ? 'help' : cmd
    if (!(cmd in tags) || cmd == '') return 
    let plugFilter = (plug) => {
      return plug.tags != 'owner' && plug.tags != ''
    }
    for (let plugin of Object.values(global.plugins).filter(plugFilter))
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in  tags)) tags[tag] = tag
    let help = Object.values(global.plugins).filter(plugFilter).map(plugin => {
      return {
        help: plugin.help,
        tags: plugin.tags,
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit
      }
    })
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let menu of help)
        if (menu.tags && menu.tags.includes(tag))
          if (menu.help) groups[tag].push(menu)
    }
    let before =  `Hai, *%name*!\nNamaku *${client.getName(client.user.jid)}*\n_Uptime Bot: *%uptime*_`
    if (m.isGroup) before += `\nPrefix bot di group ini: *${global.DB.groups.find(v=> v.jid === m.chat).prefix}*\n`
    let header =  '╭─『%category』 '
    let body   =  '│➸ _%cmd_'
    let footer =  '╰────\n'
     _text  = before + '\n'
    for (let tag in groups) {
      if (tag != cmd) { continue }
      _text += header.replace(/%category/g, tags[tag]) + '\n'
      for (let menu of groups[tag]) {
        for (let help of menu.help) {
          _text += body.replace(/%cmd/g, menu.prefix ? help : '%p' + help) + '\n'
        }
      }
      _text += footer + '\n'
    }
    let text = _text 
    let replace = {
      '%': '%',
      p: _p, uptime,
      name,
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).join`|`})`, 'g'), (_, name) => replace[name])
   // client.fakeReply(m.chat, text.trim(), '0@s.whatsapp.net', '*Bot telah terverifikasi*')
    client.reply(m.chat, text.trim(), m)
    .catch(err => console.log(''))
  } catch (e) {
    client.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = Object.keys(tags).map(v=> v + 'menu')
handler.tags = ['help']
handler.command = new RegExp(`(${Object.keys(tags).join('|') + '|'})(menu|help)`, 'i')
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 20

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}