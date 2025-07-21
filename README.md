# 🕹️ Air Hockey Web Game

A simple real-time multiplayer game inspired by classic **air hockey tables**, built to explore real-time communication and full-stack development.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, SCSS
- **Backend**: Node.js, Express, TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **Real-Time Communication**: WebSockets
- **Other Features**: In-game chat

## 🎮 Game Description

This is a two-player game where each user controls a paddle and competes to hit the puck into the opponent’s goal. The project was created as a learning exercise focused on implementing WebSocket-based real-time communication in a full-stack application.

Each player can chat while playing, and matches are updated live through sockets to ensure a smooth gameplay experience.

## ⚙️ Key Challenges

A significant technical challenge was **performance tuning**. The game loop was initially implemented using `setTimeout`, but due to lag issues, it was replaced with a more efficient logic that balances precision and performance using a custom timing mechanism ( `setTimeoout` + `setImmediate`).

##

This game was built primarily for learning purposes, focusing on **real-time networking**, **performance optimization**, and **full-stack architecture**.
