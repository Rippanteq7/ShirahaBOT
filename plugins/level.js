const canvacord = require('canvacord')

let handler = async(m, { client }) => {
  let pp
  let users = global.DB['users']
  let userData = users.find(v => v.jid == m.sender)
  
  try {
    pp = await client.getProfilePicture(m.sender)
  }catch {
		pp = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	}finally{
	  let bg = 'https://i.ibb.co/NytnRDw/20210207-022154.png'
	  const rank = new canvacord.Rank()
	     .setAvatar(pp)
	     .setCurrentXP(userData.exp)
	     .setRequiredXP(userData.nextLevel)
	     .setUsername(client.getName(m.sender))
	     .setProgressBar('#28d4ff', 'COLOR')
	     .setLevel(userData.level, 'LEVEL')
	     .setBackground('IMAGE', bg)
	     .renderEmojis(true)
	     .setRank(3, 'SHIRAHA BOT V')
	     .setOverlay('#000000')
	     .setDiscriminator(`${getDis(users.map(v=> v.jid).indexOf(m.sender))}`)
	     rank.build()
	        .then(data => {
	          client.sendFile(m.chat, data, 'rank.png', '', m)
	        }).catch(err => {
	          throw err
	        })
	}
  
  
  

}

  handler.command = /^rank$/i
  handler.tags = ['users']
  handler.help = ['rank']
  handler.group = true
  handler.exp = 40
  module.exports = handler
  
  function getDis(id) {
    if (!id) return '0000'
    id = id.toString()
    if (id === '-1') return '7263'
    if (id.length === 4) return id
    if (id.length === 3) return '0' + id
    if (id.length === 2) return '00' + id
    if (id.length === 1) return '000' + id
  }