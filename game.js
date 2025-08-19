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
