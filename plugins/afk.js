
let handler = async(m, { client, args, text }) => {
  if (!global.DB['groups'].find(v=> v.jid == m.chat).afk) return m.reply('Fitur afk di group ini belum diaktifkan!')
  if (global.DB['groups'].find(v=> v.jid == m.chat)) {
      global.DB['groups'].find(v=> v.jid == m.chat).members.find(v=>v.jid == m.sender).isAfk = true
    if (args.length > 0)  {
      if (text.length > 100) return client.reply(m.chat, 'Alasan terlalu panjang', m)
      global.DB['groups'].find(v=> v.jid == m.chat).members.find(v=>v.jid == m.sender).afkReason = text
      client.reply(m.chat, `Kamu mulai AFK sekarang dengan alasan: ${text}`, m)
    }else client.reply(m.chat, `Kamu mulai AFK sekarang!`, m)
    //console.log(global.DB.get('groups').find({jid: m.chat}).get('members').find({jid: m.sender}).value());

  }
}

handler.command = /^afk$/i
handler.tags = ['group']
handler.help = ['afk <reason>']
handler.group = true


module.exports = handler