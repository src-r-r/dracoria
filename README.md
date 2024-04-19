# Dracoria

Dracoria is a web-based text adventure game where players can hatch, raise, and interact with a virtual pet dragon. By logging in with their Ethereum account, players embark on a journey in the magical world of Dracoria, where they maintain a garden to feed their dragon, which grows and evolves as they interact with it. The initial version of the game operates on a centralized server, with plans to transition to blockchain technology, turning dragons and other in-game elements into NFTs.

## Overview

The application is built using Node.js and Express for the backend, with MongoDB as the database for storing game data. User authentication is integrated with Ethereum wallets, offering a secure and innovative way to log in. The game utilizes Socket.IO for real-time interactions, and the frontend is developed with EJS templating for dynamic content rendering. Key features include garden management, dragon interaction via an OpenAI-powered chatbot, and future blockchain integration for NFT functionalities.

## Features

- **Dragon Interaction**: Players can talk to their dragon, which is powered by OpenAI's GPT models, making each interaction unique.
- **Garden Management**: Users start with a lava tree, which produces fruits to feed the dragon. Future updates will introduce more plants and fruits.
- **Blockchain Integration**: Version 2 aims to introduce NFTs for dragons and garden elements, allowing players to trade and transfer these assets on the blockchain.

## Getting started

### Requirements

- Node.js
- MongoDB
- Ethereum Wallet (for login)
- OpenAI API key (for dragon conversations)

### Quickstart

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in your MongoDB URL, session secret, and OpenAI API key.
4. Start the server with `npm start`.

## License

Copyright (c) 2024.