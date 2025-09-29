🎮 Simon Game Web App

A web version of the classic Simon memory game built in vanilla JavaScript, HTML, and CSS, hosted on Firebase. Players try to repeat increasingly complex color/sound patterns.

🚀 Live Demo

🕹 Play it here!

⚠️ Note: The app is not mobile responsive currently. The best experience is on a desktop or a laptop.

📌 Features

🟩 “Press A Key to Start” screen — the game begins when you press a key.

👤 Play as Guest / Sign in with Google — option to use authentication.

📈 Global Highscores — view top scores across all users.

🎨 Multiple Themes — choose between Classic, Space, and Synthwave looks.

🔁 Classic Simon gameplay — repeating color/sound patterns (see rules below).

🎲 How the Game Works (Rules)

Start the Game

Press any key to start the sequence.

Sign in with Google if you want your score saved globally.

Simon’s Sequence

The game flashes a sequence of colors, each paired with a distinct tone.

The sequence starts short (one step) and grows by one each round.

Your Turn

Click the buttons in the exact order Simon showed.

Every correct sequence advances you to the next round.

Game Over

If you press the wrong color or break the sequence, the game ends.

Restart by pressing a key again.

Scoring

Your score = the length of the sequence you survived.

High scores are stored and compared globally (if you’re signed in).

🛠 Tech Stack
Technology	Purpose
HTML / CSS	UI layout, styling, and theming
Vanilla JavaScript	Core game logic, event handling, state mgmt
Web Audio API: Unique sounds for each color button
Firebase Hosting	Web hosting
Firebase Auth	Google login for players
Firebase Firestore	Global highscore storage
🔧 How to Run Locally
git clone https://github.com/yourusername/simon-game.git
cd simon-game
# open index.html in your browser


To enable Firebase features:

Create a Firebase project.

Replace the Firebase config in the script with your own.

Enable Firestore + Authentication (Google Sign-In).

💡 Future Improvements

📱 Mobile Responsiveness — adapt layout and controls for smartphones.

👥 Multiplayer Mode — side-by-side or online play with friends.

🏆 Expanded Stats — longest streaks, averages, etc.

🔐 Private Scores — allow hiding scores from the global leaderboard.

📸 Screenshot

📬 Contact

Got feedback, ideas, or want to collaborate? Reach out!

Harsh – Computer Science Undergrad
📧 harsh2004mckv@gmail.com

🔗 LinkedIn[www.linkedin.com/in/harsh-kumar-singh-57392b27a]
