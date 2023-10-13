
// Your JSON data  
function displayTournament(tournamentName) {
    console.log("displaying tournament" + tournamentName);
    const db = getDatabase();
    // Extract the player and game lists
    const gameContainer = document.getElementById("gameContainer");

    const playerList = db.Tournaments[tournamentName]["player list"];
    const gameList = db.Tournaments[tournamentName]["game list"];
            // Iterate through the game list and create HTML elements
            gameList.forEach((game, index) => {
                const gameElement = document.createElement("div");
                gameElement.className = "game";
                gameElement.id = `game ${index}`;
                gameElement.innerHTML = `<h2>Game ${index + 1}</h2>
                                          <p>${game["player 1"]} vs ${game["player 2"]} Score: ${game["player 1 points"]} to ${game["player 2 points"]}</p>`;
                gameContainer.appendChild(gameElement);
            });
}