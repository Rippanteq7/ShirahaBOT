


let handler = async(m, {client, args, command}) => {
  //console.log('aaaaaaaaaaa');
  //if (args.length === 0) return m.reply(`Example: ${usedPrefix + command} welcome`)
  let group = global.DB['groups'].find(v=> v.jid == m.chat)
  let isOn = command == 'enable'
  let listFitur = {
    'welcome': 'welcome',
    'left': 'farewell',
    'antilink': 'antilink',
    'antisticker': 'antiSpam',
    'antibadword': 'antiBadword',
    'nsfw': 'isHentai',
    'afk': 'afk',
  }
  let aktif = isOn ? 'aktifkan' : 'nonaktifkan'
  let fitur = Object.keys(listFitur).map(v=> `*${v}*`).join('\n')
  if (args.length < 1) return client.reply(m.chat, `Tidak ada fitur untuk di ${aktif},\n_LIST FITUR:_\n${fitur}`, m)
  arg = args[0].toLowerCase()
  if (!listFitur[arg]) return client.reply(m.chat, `Fitur ${args[0]} tidak terdaftar!,\n_LIST FITUR:_\n${fitur}`, m)
  group[listFitur[arg]] = isOn
  client.reply(m.chat, `Fitur ${arg} berhasil di${aktif} di group ini!`, m)
  //m.reply(JSON.stringify(group.value()))
}

handler.help = ['enable', 'disable'].map(v=> v + ` <fitur>`)
handler.tags = ['admin']
handler.command = ['enable', 'disable']
handler.group = true
handler.admin = true
handler.mods = false

handler.owner = false
handler.limit = false

module.exports = handler