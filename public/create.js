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

function startRound(tournamentName) {
    //find out what round is starting
    //if it is the first round, start based on the player list of the tournament.
    //if it is a subsequent round, add all the players that have 3 points to the next round
    //just copy the JSON objects from the previous round and set points to 0?
}

// even listener for creating a tournament
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var tournament_name = document.querySelector("#tournament_name").value;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const newTournament = {
          complete: false,
          ownerID: user.uid,
          player_list: { PLAYER0: { name: "", realName: "", uid: "" } },
          rounds: {},
          started: false,
        };
        var tournamentRef = ref(db, "Tournaments");
        get(tournamentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log(data);
              const keys = Object.keys(data);
              console.log(keys);
              if (keys.includes(tournament_name)) {
                alert(
                  "please choose a different name.\n " +
                    tournament_name +
                    " is already in use"
                );
                return;
              }
              set(ref(db, "Tournaments/" + tournament_name), newTournament);
            } else {
              console.log("No data found at the specified location.");
            }
          })
          .catch((error) => {
            console.error("Error reading data:", error);
          });
      } else {
        // User is signed out.
        console.log("No user signed in");
        alert("pleaser log in.");
      }
    });
    //show the link
    const newLink = document.createAttribute("a");
    newLink.href = "https://tournamentwebapp.web.app/index.html?tournament="+tournament_name;
    document.querySelector("#view").appendChild(newLink);
    newLink.href = "https://tournamentwebapp.web.app/signup.html?tournament="+tournament_name;
    document.querySelector("#signUp").appendChild(newLink);
    document.getElementById(".success").style.display = "block";
  });
});

// the event listener for starting a tournament
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var tournament_name = document.querySelector("#tournament_name").value;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var tournamentRef = ref(db, "Tournaments/" + tournament_name);
        get(tournamentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log(data);
              if (user.uid === tournamentRef["owner"]) {
                // START TOURNAMENT COMMAND
                set(
                  ref(db, "Tournaments/" + tournament_name + "/started"),
                  true
                );
              }
            } else {
              console.log("No data found at the specified location.");
            }
          })
          .catch((error) => {
            console.error("Error reading data:", error);
          });
      } else {
        // User is signed out.
        console.log("No user signed in");
        alert("pleaser log in.");
      }
    });
  });
});

let renderLogin = () => {
  document.querySelector("#welcome").textContent = "Welcome";
  const button = document.createElement("button");
  button.id = "clickme";
  button.textContent = "Login Please";
  button.addEventListener("click", () => {
    firebase.auth().signInWithRedirect(google_provider);
  });
  if (document.querySelector("#logout") !== null) {
    document.querySelector("#logout").remove();
  }
  document.querySelector("body").appendChild(button);
};

let startApp = (user) => {
  const header = document.createElement("h1");
  document.querySelector("#welcome").textContent =
    "Welcome " + user.displayName;

  const logoutButton = document.createElement("button");
  logoutButton.id = "logout";
  logoutButton.textContent = "Log out here";

  document.querySelector("body").appendChild(logoutButton);
  if (document.querySelector("#clickme") !== null) {
    document.querySelector("#clickme").remove();
  }
  // const logoutButton = document.querySelector("#logout");
  logoutButton.addEventListener("click", () => {
    firebase.auth().signOut();
  });
};

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
