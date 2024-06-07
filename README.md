# LockBlock

**🏆 We won 3rd place at the hackathon! 🏆**

## Introduction

LockBlock is a 2D platform game inspired by Mario Maker and the Reddit pixel game. It combines the sense of community with the fun of creating something new! What makes it unique is the ability to modify the global map in real-time, stored on the blockchain.

## Gameplay

The gameplay is simple: reach the flag to win. If you touch a red block, you die. There are multiple game modes: 
- **Hardcore mode:** Dying sends you back to the beginning.
- **Relaxed mode:** You restart from the last checkpoint.

## Features

### Real-time Map Modification
Everything starts with logging in via ArConnect, made possible by ArWeave. We use ArWeave to store all game information, including each block's ownership and location. This allows users to buy and modify pieces of the map in real-time!

### Chunks and Ownership
The map is divided into parts called chunks. Each chunk consists of 256 blocks that can be owned by users. Users can buy, spawn obstacles, and modify chunks, but they must be able to complete the level themselves to confirm it is solvable. When a chunk is full (no more blocks can be added without making it unsolvable), users can buy and modify a new chunk to add to the global map.

### Bonuses and Rewards
- **Chunk Owner Bonus:** The chunk owner receives a bonus from each person who buys a block on their chunk.
- **Weekly Leaderboard:** Each week, we will have a leaderboard for the most deadly chunks. The chunk with the highest death score will receive some Arweave tokens, and the blocks that contribute the most to the user’s score will receive a higher percentage of these tokens.
- **Referral System:** We will have a referral system with rewards for users like bonus coins and exclusive in-game items. For the first chunk, the user doesn't need to pay, but for the rest, they will pay a small fee. If a user runs out of coins for the invite, both friends receive one additional chunk.
- **Party Mode:** Users can play a deathrun with their friends.

## Future Plans

We plan to continuously develop the project and add even more features. We hope to see you soon in the production release of LockBlock!

## How to Run the Project

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repository/LockBlock.git
   cd LockBlock
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Technologies Used

- **Frontend:** React, Phaser
- **Blockchain:** Arweave
- **Wallet Integration:** ArConnect

## Authors

- Your Name
- Team Members

## Acknowledgments

We would like to thank the hackathon organizers and our mentors for their support and guidance throughout the project. Special thanks to the community for their continuous support and feedback.

---

Enjoy creating and exploring the world of LockBlock!
