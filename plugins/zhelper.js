 let helps = {}
    for (let help of Object.values(global.plugins).map(v=> v.help)) {
        if (!help) continue
        if (!help[0][0]) continue
        help.forEach(he=> {
            let hai = he.indexOf(' ') ? he.split(' ')[0] : he
            let hoi = he[0]
            if (he[1]) hoi += he[1]
            if (he[2] && hai.length > 3) hoi += he[2]
            if (hoi in helps) hoi += he[3]
            helps[hoi] = hai
        })
}
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let handler = async(m, { client, usedPrefix, command}) => {
    let cmd3 = command[0] + command[1] + command[2]
    let cmd2 = command[0] + command[1]
    let cmd = command in helps ? command : cmd3 in helps ? cmd3 : cmd2 in helps ? cmd2 : command[0]
    let helper = helps[cmd]
    console.log(helps)
    if (helper === 'helpmenu') helper = 'help'
    if (helper)m.reply(`Maksudmu: ${usedPrefix + helper}`)
}


handler.command= new RegExp(`^(${Object.keys(helps).map(v=> str2Regex(v)).join('.*|')})`)

module.exports = handler