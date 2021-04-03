

let handler = async(m, { client, text}) => {
  let users = global.DB['users']
  for(var i= 0; i < users.length; i++) {
   users[i].lastClaim = 0
   users[i].limit = 15
  }
  console.log(global.DB['users'].map(v=> v.limit))
  
}

handler.command = /^eval$/i
handler.owner = true

module.exports = handler