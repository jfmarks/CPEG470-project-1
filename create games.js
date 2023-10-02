const fs = require('fs');


function createGames(tournamentName) {
// Your JSON data
const jsonData = {
  "Tournaments": {
    "Test Tournament": {
      "game list": "",
      "player list": {
        "player 1": "Jacob",
        "player 2": "Kim",
        "player 3": "Mat",
        "player 4": "Zach"
      }
    }
  }
};

// Extract the player list
const playerList = jsonData.Tournaments[tournamentName]["player list"];

// Create game objects for every two players
const gameList = [];
for (let i = 1; i <= Object.keys(playerList).length; i += 2) {
    const player1 = playerList[`player ${i}`];
    const player2 = playerList[`player ${i + 1}`];
    const game = { "player 1": player1, "player 2": player2, "completed": false, "winner": "NA", "player 1 Points": 0, "player 2 Points": 0 };
    gameList.push(game);
}

// Update the "game list" field with the generated game list
jsonData.Tournaments[tournamentName]["game list"] = gameList;

// Convert the updated data to JSON format
const updatedJsonData = JSON.stringify(jsonData, null, 2);

// Save the updated JSON data to a file
fs.writeFileSync('updated_data.json', updatedJsonData);
}
