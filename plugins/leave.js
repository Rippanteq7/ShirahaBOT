let handler = async(m, { client }) => {
  await m.reply('Sayonara~')
  await client.groupLeave(m.chat)
}


handler.command = /^leave$/i
handler.admin = true
handler.tags = ['admin']
handler.help = ['leave']
handler.exp = 0
module.exports = handler