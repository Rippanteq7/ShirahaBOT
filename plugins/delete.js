let handler = async (m, {client}) => {
  if (!m.quoted) throw 'Reply pesan bot!' 
  let { fromMe, id, isBaileys} = m.quoted 
  if (!fromMe) throw 'Hanya bisa menghapus pesan dariku'
  if (!isBaileys) throw 'Pesan tersebut bukan dikirim oleh bot!' 
  client.deleteMessage(m.chat, {
      fromMe, id, remoteJid: m.chat
  })
}

handler.help = ['del', 'delete']
handler.tags = ['admin']
handler.command = /^del(ete)?$/i 
handler.group = true
handler.admin = true

module.exports = handler