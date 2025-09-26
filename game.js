var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

// Enhanced keypress handler - works with any key
$(document).keypress(function () {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// Click handler with enhanced feedback
$(".btn").click(function () {
  if (started) {
    // Only allow clicks when game has started
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
  }
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      // Add success feedback
      $("#level-title").text("Correct! Next Level...");

      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    // Enhanced game over sequence
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    // Add screen shake effect
    $("body").addClass("shake");

    setTimeout(function () {
      $("body").removeClass("game-over");
      $("body").removeClass("shake");
    }, 200);

    // Save score when game ends
    saveScore(level);
    startOver();
  }
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Enhanced sequence display with delay for better visibility
  setTimeout(function () {
    $("#" + randomChosenColour)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playSound(randomChosenColour);
  }, 500);
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  try {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play().catch(function (error) {
      // Handle autoplay policy restrictions gracefully
      console.log("Audio playback failed:", error);
    });
  } catch (error) {
    console.log("Audio file not found:", name);
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  $("#level-title").text("Press A Key to Start");
}

// Theme-aware functions (optional enhancements)
function getThemeSpecificSound(color) {
  const currentTheme = document.body.className;

  // You could have different sounds for different themes
  if (currentTheme.includes("space-theme")) {
    return "sounds/space-" + color + ".mp3";
  } else if (currentTheme.includes("synthwave-theme")) {
    return "sounds/synth-" + color + ".mp3";
  }

  return "sounds/" + color + ".mp3";
}

// Enhanced button highlighting for themes
function enhancedAnimatePress(currentColor) {
  const $button = $("#" + currentColor);
  const currentTheme = document.body.className;

  $button.addClass("pressed");

  // Add theme-specific effects
  if (currentTheme.includes("space-theme")) {
    $button.addClass("space-glow");
    setTimeout(() => $button.removeClass("space-glow"), 300);
  } else if (currentTheme.includes("synthwave-theme")) {
    $button.addClass("neon-flash");
    setTimeout(() => $button.removeClass("neon-flash"), 300);
  }

  setTimeout(function () {
    $button.removeClass("pressed");
  }, 100);
}

// Optional: Add score tracking for leaderboard preparation
var score = 0;
var highScore = localStorage.getItem("simonHighScore") || 0;

function updateScore() {
  score = level - 1;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("simonHighScore", highScore);
  }
}

// Call updateScore in your game over function
function enhancedStartOver() {
  updateScore();
  level = 0;
  gamePattern = [];
  started = false;
  score = 0;
  $("#level-title").text("Press A Key to Start");
}

// Show modal on page load
window.addEventListener("DOMContentLoaded", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
      showAuthModal();
    }
    // Do NOT hide the modal here unless user is authenticated
  });
});

function showAuthModal() {
  document.getElementById("auth-modal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function hideAuthModal() {
  document.getElementById("auth-modal").style.display = "none";
  document.body.style.overflow = "";
}

// Guest Auth
document.getElementById("guest-auth-btn").onclick = function () {
  if (firebase.auth().currentUser && firebase.auth().currentUser.isAnonymous) {
    hideAuthModal();
    return;
  }
  firebase
    .auth()
    .signInAnonymously()
    .then(() => hideAuthModal())
    .catch((error) => alert("Guest sign-in failed: " + error.message));
};

// Google Auth & Upgrade
document.getElementById("google-auth-btn").onclick = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  var currentUser = firebase.auth().currentUser;

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      if (currentUser && currentUser.isAnonymous) {
        var credential = result.credential;
        currentUser
          .linkWithCredential(credential)
          .then(function (usercred) {
            migrateGuestData(currentUser.uid, usercred.user.uid);
            hideAuthModal();
          })
          .catch(function (error) {
            alert("Linking failed: " + error.message);
          });
      } else {
        hideAuthModal();
      }
    })
    .catch(function (error) {
      alert("Google sign-in failed: " + error.message);
    });
};

// If modal is dismissed (e.g., user clicks outside), default to guest
document.getElementById("auth-modal").onclick = function (e) {
  if (e.target === this) {
    document.getElementById("guest-auth-btn").click();
  }
};

// Modal open/close logic
function openScoreModal(type) {
  if (type === "global") {
    document.getElementById("global-score-modal").style.display = "flex";
    loadGlobalScores();
  }
  document.body.style.overflow = "hidden";
}

function closeScoreModals() {
  document.getElementById("global-score-modal").style.display = "none";
  document.body.style.overflow = "";
}

// Dismiss modals on overlay click or ESC
document.getElementById("global-score-modal").onclick = function (e) {
  if (e.target === this) closeScoreModals();
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeScoreModals();
});

// FIXED: Global Scores Button Handler
document.getElementById("global-scores-btn").onclick = function () {
  console.log("Global scores button clicked");
  document.getElementById("global-score-modal").style.display = "flex";
  document.body.style.overflow = "hidden";
  loadGlobalScores(); // Call the correct function
};

// FIXED: Global Scores Loading Function
function loadGlobalScores() {
  console.log("loadGlobalScores() called");

  const contentElement = document.getElementById("global-score-content");
  if (!contentElement) {
    console.error("global-score-content element not found!");
    return;
  }

  const user = firebase.auth().currentUser;
  console.log(
    "Current user:",
    user ? user.displayName || "Anonymous" : "No user"
  );

  let html = "<h3>🏆 Global Leaderboard</h3>";

  if (!user || user.isAnonymous) {
    // User not signed in - show sign-in prompt
    html += `
      <p>Sign in with Google to compete globally and view the leaderboard!</p>
      <button id="global-google-auth-btn" class="modal-btn google" style="margin:16px auto 0 auto;display:block;">
        Sign in with Google
      </button>
      <button onclick="closeScoreModals()" class="modal-btn" style="margin-top: 10px;">
        Close
      </button>
    `;
    contentElement.innerHTML = html;

    // Attach Google sign-in handler for the modal button
    setTimeout(() => {
      const btn = document.getElementById("global-google-auth-btn");
      if (btn) {
        btn.onclick = function () {
          var provider = new firebase.auth.GoogleAuthProvider();
          var currentUser = firebase.auth().currentUser;

          firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
              if (currentUser && currentUser.isAnonymous) {
                var credential = result.credential;
                currentUser
                  .linkWithCredential(credential)
                  .then(function (usercred) {
                    migrateGuestData(currentUser.uid, usercred.user.uid);
                    // Reload the scores after successful sign-in
                    setTimeout(() => loadGlobalScores(), 500);
                  })
                  .catch(function (error) {
                    alert("Linking failed: " + error.message);
                  });
              } else {
                // Reload the scores after successful sign-in
                setTimeout(() => loadGlobalScores(), 500);
              }
            })
            .catch(function (error) {
              alert("Google sign-in failed: " + error.message);
            });
        };
      }
    }, 0);
    return;
  }

  // User is signed in - show loading state first
  contentElement.innerHTML = html + "<p>Loading scores...</p>";

  // Fetch global scores
  firebase
    .database()
    .ref("globalScores")
    .orderByChild("level")
    .limitToLast(10)
    .once("value")
    .then(function (snapshot) {
      console.log("Firebase data received:", snapshot.exists());

      let scores = [];
      snapshot.forEach((child) => {
        const data = child.val();
        if (data && data.level) {
          scores.push(data);
        }
      });

      console.log("Scores found:", scores.length);

      // Sort by level descending (highest first)
      scores.sort((a, b) => (b.level || 0) - (a.level || 0));

      if (scores.length === 0) {
        html += "<p>🎮 No global scores yet! Be the first to set a record!</p>";
      } else {
        html += "<ol style='padding-left: 20px; text-align: left;'>";
        scores.forEach((s, index) => {
          const uname = s.username || s.displayName || "Anonymous Player";
          const medal =
            index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
          html += `<li style='margin: 8px 0; padding: 8px; background: rgba(100, 255, 218, 0.1); border-radius: 5px;'>
            ${medal} <strong>${uname}</strong> — Level: ${s.level}
          </li>`;
        });
        html += "</ol>";
      }

      // Add close button
      html += `<button onclick="closeScoreModals()" class="modal-btn" style="margin-top: 16px;">Close</button>`;

      contentElement.innerHTML = html;
      console.log("Global scores displayed successfully");
    })
    .catch(function (error) {
      console.error("Error loading global scores:", error);
      contentElement.innerHTML =
        html +
        `
        <p>❌ Error loading scores: ${error.message}</p>
        <button onclick="loadGlobalScores()" class="modal-btn" style="margin: 10px;">🔄 Retry</button>
        <button onclick="closeScoreModals()" class="modal-btn" style="margin: 10px;">Close</button>
      `;
    });
}

// FIXED: Save Score Function
function saveScore(level) {
  console.log("saveScore() called with level:", level);

  const user = firebase.auth().currentUser;
  if (!user || user.isAnonymous) {
    console.log("Cannot save score: user not signed in with Google");
    return;
  }

  const username = user.displayName || "Anonymous";
  const userId = user.uid;
  const scoreData = {
    uid: userId,
    username: username,
    level: level,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  };

  console.log("Saving score data:", scoreData);

  firebase
    .database()
    .ref("globalScores/" + userId)
    .set(scoreData)
    .then(() => {
      console.log("Score saved successfully");
    })
    .catch((error) => {
      console.error("Error saving score:", error);
    });
}

// REMOVED: Duplicate showGlobalScores function that was causing conflicts

// Add this function if it's missing (referenced in Google auth)
function migrateGuestData(guestUid, googleUid) {
  console.log("Migrating data from guest to Google user");
  // Add any data migration logic here if needed
  // For now, just log the migration
}
