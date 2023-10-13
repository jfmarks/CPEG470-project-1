import { getDatabase, ref, set, push, update, remove, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {db} from "/config.js"


function add_options() {
  var tournament_options = ref(db, "Tournaments");
  get(tournament_options)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      //console.log(data);
      const keys = Object.keys(data);
      console.log(keys);
      for (const key in keys) {
        var tourneament_selector = document.getElementById("desired_tournament");
        var option = document.createElement("option");
        option.text = keys[key];
        option.id = keys[key].toString() + " option";
        tourneament_selector.add(option);
      }
    } else {
      console.log('No data found at the specified location.');
    }
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
      
      var user_name = document.querySelector("#user_name").value;
      var desired_tournament = document.querySelector("#desired_tournament").value;
      console.log(user_name + " " + desired_tournament);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          var playerListRef = ref(db, "Tournaments/"+desired_tournament.toString()+"/player list");
          get(playerListRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(data);
                // add functionality for if there is only 1 player and it is player0, overwrites instead of creating a new one.
                const keys = Object.keys(data);
                console.log(keys);
                const newPlayerKey = "player " +(keys.length + 1).toString();

                set(ref(db, "Tournaments/" + desired_tournament.toString() + "/player list/" + newPlayerKey), {
                  Name: user_name,
                  realName: user.displayName,
                  uid: user.uid
                })
                
              } else {
            console.log('No data found at the specified location.');
          }
        })
        .catch((error) => {
          console.error('Error reading data:', error);
        });
        } else {
          // User is signed out.
          console.log("No user signed in");
        }
      });
      // ref(db, "Tournaments/"+desired_tournament.toString()+"/player list").push(newPlayer);
      //function that adds the information to the database
      // add logic for when there is an odd number of players so that the game is marked as complete.
    })
});

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

add_options();
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

