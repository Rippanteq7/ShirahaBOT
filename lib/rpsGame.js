

//get a random emoji of rock paper scissors
const randomRPCEmo = () => {
  //rock paper scissors emoji
  const emojis = ["✌", "✊", "🖐"];
  const random = Math.floor(Math.random() * 3);
  return emojis[random];
};

//
const allEmos = {
  papers: ["🖐", "✋", "🤚"],
  scissors: ["✌"], //it's a yellow hand u cant see it
  rocks: ["✊", "👊", "🤛", "🤜"]
};
const emos = { paper: "🖐", scissor: "✌", rock: "✊" };

const {rock, paper, scissor} = emos; //destructre

//login what will beat what
const matches = {
  [scissor]: rock,
  [paper]: scissor,
  [rock]: paper
};

const runGame = userEmo => {
  const botEmo = randomRPCEmo();
// console.log(botEmo)
  const emojiEntry = Object.entries(allEmos)
    // Destructure the type like "papers" and the array of emojis
    // Check if the incoming emoji is in the array
    .find(([type, emojis]) => emojis.some(e => userEmo.startsWith(e)));
  if (!emojiEntry) {
    return console.log("no valid emoji found");
  }
  
  // Destructure the type like "rocks", "papers" and the array
  const [type, allColorVariants] = emojiEntry;
  userEmo = allColorVariants[0];

  
  //winning condition for bot user will lose
  const isitWin = () => {
    //get object values in array and check if emoji is there
    if (!Object.values(emos).includes(userEmo)) {
      return 'invalid'
    } // if both emoji are same then its a draw
    else if (userEmo === botEmo) {
      return `draw`
    }
    //now if our condition is matched with bot then user lost
    else if (matches[userEmo] === botEmo) {
      return 'lose';
    } // if none is true then user has won the game
    else {
      return 'win';
    }
  };

  return {  
    userEmo,
    botEmo,
    isWin: isitWin()
  };
}

module.exports = { runGame }