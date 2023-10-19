import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { db } from "/config.js";
// import { startRound } from "/create.js";

function startRound(tournamentName) {
  console.log(tournamentName);
  var tournamentRef = ref(db, "Tournaments/"+tournamentName);
        get(tournamentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log(data);
              const keys = Object.keys(data["rounds"]);
              console.log(keys);
              const nextRoundNum = keys.length;
              if (nextRoundNum === 1 ) {
                const nextRoundPlayers = data["player_list"];
                console.log(nextRoundPlayers);
                const nextRound = {
                  player_list: nextRoundPlayers,
                  complete: false
                }
                console.log(nextRound);
                set(ref(db, "Tournaments/"+tournamentName+"/rounds/round"+nextRoundNum.toString()),nextRound);
              } else {
                var num_players = 1;
                var nextRoundPlayers = {};
                for (var i = 1; i <= Object.keys(data["rounds"]["round"+(nextRoundNum-1).toString()]["player_list"]).length; i++) {
                  if (data["rounds"]["round"+(nextRoundNum-1).toString()]["player_list"]["player "+(i.toString())]["points"] === 3) {
                    nextRoundPlayers["player "+num_players.toString()] = data["rounds"]["round"+(nextRoundNum-1).toString()]["player_list"]["player "+(i.toString())];
                    nextRoundPlayers["player "+num_players.toString()]["points"] = 0;
                    num_players++;
                  }
                }
                console.log(nextRoundPlayers);
                const nextRound = {
                  player_list: nextRoundPlayers,
                  complete: false
                }
                set(ref(db, "Tournaments/"+tournamentName+"/rounds/round"+nextRoundNum.toString()),nextRound);
              }
            } else {
              console.log("No data found at the specified location.");
            }
          })
          .catch((error) => {
            console.error("Error reading data:", error);
          });
}

function checkRoundComplete(playerList, tournament_name, round) {
  var playerListRef = ref(db, "Tournaments/"+tournament_name+"/rounds/"+round+"/player_list");
  get(playerListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        var total_num_players = 0;
        const players_needed_for_completion = (Object.keys(playerList).length / 2)-0.5;
        console.log(players_needed_for_completion)
        for (const player of Object.keys(data)) {
          console.log(data[player]["points"]);
          if (data[player]["points"] === 3) {
            total_num_players++;
          }
          console.log(total_num_players);
        }
        if (total_num_players >= players_needed_for_completion) {
          set(ref(db, "Tournaments/"+tournament_name+"/rounds/"+round+"/complete"), true);
          // location.reload();
          startRound(tournament_name);
        }
      } else {
        console.log("No data found at the specified location.");
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

function displayTournament(tourney) {
  console.log(tourney);
  const rounds = Object.keys(tourney["rounds"]);
  console.log(rounds);
  const parent_container = document.querySelector("#gameContainer");

  for (const round of rounds) {
    if (round !== "ROUND0") {
      console.log(round);
      const round_container = document.createElement("div");
      round_container.className = "round";
      round_container.id = round.toString();
      const round_header = document.createElement("h2");
      round_header.class = "round_header";
      round_header.textContent = round.toString() + ": ";
      round_container.appendChild(round_header);
      const current_round_players = tourney["rounds"][round]["player_list"];
      console.log(current_round_players);
      const num_players = (Object.keys(current_round_players)).length;
      for (let i = 0, j = 1; i < num_players - 1; i += 2, j += 2) {
        const game = document.createElement("p");
        game.className = "game";
        game.id = "game" + (i / 2).toString();
        // add event listener for each <p> tag to create a way of changing the score
        game.textContent =
          current_round_players[Object.keys(current_round_players)[i]]["Name"] +
          " " +
          current_round_players[Object.keys(current_round_players)[i]][
            "points"
          ] +
          " VS " +
          current_round_players[Object.keys(current_round_players)[j]][
            "points"
          ] +
          " " +
          current_round_players[Object.keys(current_round_players)[j]]["Name"];
        round_container.appendChild(game);
      }
      if (num_players === 1) {
        const game = document.createElement("p");
        game.className = 'game';
        game.textContent = current_round_players[Object.keys(current_round_players)[num_players - 1]]["Name"] + " wins!";
        round_container.appendChild(game);
      }
      else if (num_players % 2 === 1) {
        const game = document.createElement("p");
        game.className = "game";
        game.id = "game" + (num_players / 2 - 0.5).toString();
        game.textContent = current_round_players[Object.keys(current_round_players)[num_players - 1]]["Name"] + ": Round Bye";
        const queryParams = new URLSearchParams(window.location.search);
        set(ref(db, "Tournaments/"+queryParams.get("tournament") +"/rounds/"+round.toString()+"/player_list/player "+(num_players).toString()+"/points"),3);
        round_container.appendChild(game);
      }
      parent_container.appendChild(round_container);
    }
  }
  for (const round of rounds) {
    if (round !== "ROUND0") {
      if (tourney["rounds"][round]["complete"] === false) {
        const current_round_players = tourney["rounds"][round]["player_list"];
        console.log(current_round_players);
        const num_players = (Object.keys(current_round_players)).length;
        for (let i = 0, j = 1; i < (num_players/2 - 0.5); i += 1, j += 2) {
          document.querySelector("#" +round.toString() + " #game"+ i.toString()).addEventListener("click", function (event) {
            const player1Score = parseInt(prompt("update player 1 score: "));
            const player2Score = parseInt(prompt("update player 2 score: "));
            const queryParams = new URLSearchParams(window.location.search);
            set(ref(db,"Tournaments/" +queryParams.get("tournament") +"/rounds/" +round.toString() +"/player_list/player "+(j).toString()+"/points"),player1Score);
            set(ref(db,"Tournaments/" +queryParams.get("tournament") +"/rounds/" +round.toString() +"/player_list/player "+(j+1).toString()+"/points"),player2Score);
            checkRoundComplete(current_round_players, queryParams.get("tournament"),round); // function to check for round completeness
          });
        }
      }
    }
  }
}

function displayTournaments(tournamentName) {
  console.log("displaying tournament" + tournamentName);
  var playerListRef = ref(db, "Tournaments");
  get(playerListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        const keys = Object.keys(data);
        const tourney = data[tournamentName];
        displayTournament(tourney);
      } else {
        console.log("No data found at the specified location.");
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

let renderLogin = () => {
  document.querySelector("#welcome").textContent = "Welcome";
  const button = document.createElement("button");
  button.id = "clickme";
  button.textContent = "Login Please";
  button.addEventListener("click", () => {
    firebase.auth().signInWithRedirect(google_provider);
  });
  if (document.querySelector("#logout") != null) {
    document.querySelector("#logout").remove();
  }
  document.querySelector("#login").appendChild(button);
};

let startApp = (user) => {
  const header = document.createElement("h1");
  document.querySelector("#welcome").textContent =
    "Welcome " + user.displayName;

  const logoutButton = document.createElement("button");
  logoutButton.id = "logout";
  logoutButton.textContent = "Log out here";

  document.querySelector("body").appendChild(logoutButton);
  if (document.querySelector("#clickme") != null) {
    document.querySelector("#clickme").remove();
  }
  // const logoutButton = document.querySelector("#logout");
  logoutButton.addEventListener("click", () => {
    firebase.auth().signOut();
  });
};
window.addEventListener("DOMContentLoaded", () => {
  const queryParams = new URLSearchParams(window.location.search);
  // Get the value of the "tournament" parameter
  const tournamentFromURL = queryParams.get("tournament");
  console.log(tournamentFromURL);
  if (tournamentFromURL === null) {
    window.location.href =
      "https://tournamentwebapp.web.app/index.html?tournament=Target";
    displayTournaments("Target");
  } else {
    displayTournaments(tournamentFromURL);
  }
});

var google_provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged((user) => {
  if (!!user) {
    startApp(user);
  } else {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    renderLogin();
  }
});
