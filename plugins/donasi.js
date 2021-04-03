let handler = async m => m.reply(`
╭─「 Donasi • Pulsa 」
│ • Indosat Ooredoo [${global.ownerNumber.map(v => v.split('@')[0])}]
╰────
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['bot']
handler.command = /^dona(te|si)$/i

module.exports = handler
