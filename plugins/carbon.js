const { AggregationCursor } = require("mongoose")

let handler = async (m, {client, text, args, usedPrefix, command }) => {
     let teks = m.quoted ? m.quoted.text : args.length > 0 ? text : null
     if (!teks) throw (`Example: ${usedPrefix + command} from you import love`)
     client.sendFile(m.chat, `https://api-rull.herokuapp.com/api/cmd?code=${encodeURIComponent(teks)}`, 'code.png', '```RESULT```', m)
}

handler.command = /^(cmd|carbon)$/i
handler.limit = true
handler.help = ['carbon', 'cmd'].map(v=> v + ' <code>')
handler.group = true

module.exports = handler