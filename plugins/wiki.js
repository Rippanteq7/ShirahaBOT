const axios = require('axios')

let handler = async (m, {
    client,
    text
}) => {
    if (!text) return 'Teks nya?'
    let {
        data
    } = await axios.get(`https://tobz-api.herokuapp.com/api/wiki?q=${text}&apikey=BotWeA`)
    if (!data.result) return m.reply(`[❗] ${text} tidak dapat ${client.user.name} temukan di Wikipedia!`)
    let teks = `*Query:* ${text}\n` +
        `*Result:*\n${data.result}`
    client.reply(m.chat, teks, m)
}
handler.tags = ['internet']

handler.help = ['wiki <teks>']

handler.command = /^wiki$/i

handler.group = true

module.exports = handler