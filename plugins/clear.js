let handler = async (m, { client, command, args }) => {
  let chats = args.length > 0 && /group|gc/i.test(args[0]) ? client.chats.array.filter(v => v.jid.endsWith('g.us') && !v.pin).map(v => v.jid) :  args.length > 0 && /^pc$/i.test(args[0]) ? client.chats.array.filter(u => !u.jid.endsWith('g.us')).map(v=> v.jid) : [m.chat]
  let isDelete = /^(clear|delete)/i.test(command)
  for (let id of chats) {
    if (isDelete) await client.modifyChat(id, 'delete').catch(console.log)
    await client.modifyChat(id, 'mute', -Math.floor(new Date / 1e3) * 1e3 - 1e3).catch(console.log)
  }
  client.reply(m.chat, chats.length + ' chat grup telah dib' + (isDelete ? 'ersihkan' : 'isukan selamanya'), m)
}
handler.help = ['deletechat', 'deletechat group', 'mutechat', 'mutechat group']
handler.tags = ['owner']
handler.command = /^(clear|delete|mute)chat$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

