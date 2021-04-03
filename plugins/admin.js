/*let handler = async (m, { conn, text }) => {
  let users = text.split`,`.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v.length > 20)
  await conn.groupAdd(m.chat, users)
}*/

let { monospace } = require('../lib/utils')
let { WAGroupMetaData } = require('@adiwajshing/baileys')
let handler = async (m, { client, args, usedPrefix, command, participants, text }) => {
  let {  mentionedJid,  quoted } = m
  let admins = participants.filter(user => user.isAdmin || user.isSuperAdmin ).map(user => user.jid)
  let target = m.mentionedJid.length > 0 ? m.mentionedJid[0]: args[0] && !isNaN(parseInt(text.replace(/^\+/g, '').replace(/ /g, '').replace(/-/g, ''))) ? text.replace(/^\+/g, '').replace(/ /g, '').replace(/-/g, '') + '@s.whatsapp.net': m.quoted && m.quoted.sender ? quoted.sender: undefined
  let before = participants.map(v=> v.jid)
  if (!target) throw monospace(`[❗] Example: ${usedPrefix}${command} +62xx/@user/tag pesan user`)
  switch (command) {
    case 'add':
      let exist = await client.isOnWhatsApp(target)
      if (!exist) throw monospace(`[❗] Maaf, *${target.replace('@s.whatsapp.net')}* tidak ada di whatsapp!`)
      if (before.includes(target)) throw monospace('User sudah ada di group ini!')
      await client.groupAdd(m.chat, [target])
      let after = (await client.groupMetadata(m.chat)).participants.map(u=> u.jid)
      if (after.length == before.length) throw monospace('[❗] terjadi kesalahan saat menambahkan user, mungkin karna di private')
      else client.reply(m.chat, `*${client.getName(target)}* Telah di tambahkan oleh *${client.getName(m.sender)}*`, m)
      break
    case 'kick':
    case 'remove':
      if (admins.includes(target)) throw monospace('Bot tidak dapat mengeluarkan admin!')
      await client.groupRemove(m.chat, [target])
      client.reply(m.chat, `_*Berhasil mengeluarkan ${client.getName(target)}*_`, m)
      break
    case 'promote':
      if (admins.includes(target)) throw monospace('Bagaimana Bot bisa promote Admin???')
      await client.groupMakeAdmin(m.chat, [target])
      client.reply(m.chat, `_*Berhasil promote ${client.getName(target)}*_`)
      break
    case 'demote':
      if (!admins.includes(target)) throw monospace('User bukan admin di group ini!')
      await client.groupDemoteAdmin(m.chat, [target])
      client.reply(m.chat, `_*Berhasil mendemote ${client.getName(target)}*_`, m)
      break
      
  }
}
handler.help = ['add', 'kick', 'demote', 'promote'].map(c => c + ' <62xx|@user|reply>')
handler.tags = ['admin']
handler.command = /^(add|remove|rm|kick|promote|demote)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false
handler.admin = true
handler.botAdmin = true
handler.fail = null
module.exports = handler