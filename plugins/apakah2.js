let handler = async (m, { client, command, text }) => {
   if (/(a|)rul/g.test(m.text.toLowerCase())) return client.reply(m.chat, 'ERRORR ERR', m)
   else if (m.mentionedJid.length > 0 && m.mentionedJid.includes(global.ownerNumber)) return client.reply(m.chat, 'Forbidden!! 403', m)
  client.reply(m.chat, `
*Pertanyaan:* ${command} ${text}
*Jawaban:* ${pickRandom(['Ya','Mungkin iya','Mungkin','Mungkin tidak','Tidak','Tidak mungkin'])}
`.trim(), m)
}
handler.help = ['apakah <pertanyaan>']
handler.tags = ['kerang']
handler.command = /^apakah/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

