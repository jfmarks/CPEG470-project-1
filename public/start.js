import { getDatabase, ref, set, push, update, remove, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {db} from "/config.js"


function displayTournament(tourney) {
  console.log(tourney);
  var rounds = Object.keys(tourney);
  rounds = rounds.splice(2,rounds.length);
  const parent_container = document.querySelector("#gameContainer");

  for (const round of rounds) {
    console.log(round);
    const round_container = document.createElement("div");
    round_container.className = "round";
    round_container.id = round.toString();

    const round_header = document.createElement("h2");
    round_header.class = "round_header";
    round_header.textContent = round.toString() + ": ";
    round_container.appendChild(round_header);

    const current_round_players = tourney[round]["player list"];
    for (let i = 0, j = 1; i < Object.keys(current_round_players).length - 1; i+=2, j+=2) {
      const game = document.createElement("p");
      game.className = "game";
      game.id = current_round_players[i] + "VS" + current_round_players[j];
      // add event listener for each <p> tag to create a way of changing the score
      game.textContent = Object.keys(current_round_players)[i] +" "+ current_round_players[Object.keys(current_round_players)[i]]["points"] + " VS "  
                        + current_round_players[Object.keys(current_round_players)[j]]["points"] +" "+ Object.keys(current_round_players)[j];
      round_container.appendChild(game);
    }
    parent_container.appendChild(round_container);
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
      const tourney = data["Test Tournament"];
      displayTournament(tourney);
    } else {
      console.log('No data found at the specified location.');
    }
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });
}

let renderLogin = () => {
  document.querySelector("#welcome").textContent = "Welcome"
  const button = document.createElement("button");
  button.id = "clickme";
  button.textContent = "Login Please";
  button.addEventListener("click", () => {
    firebase.auth().signInWithRedirect(google_provider);
  });
  if (document.querySelector("#logout") != null) {
    document.querySelector("#logout").remove();
  }
  document.querySelector("body").appendChild(button);
};

let startApp = (user) => {
  const header = document.createElement("h1");
  document.querySelector("#welcome").textContent = "Welcome " + user.displayName;

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

displayTournaments("Test Tournament");
var google_provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged(user => {
  if (!!user){
    startApp(user);
  } else {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    renderLogin();
  }
});

