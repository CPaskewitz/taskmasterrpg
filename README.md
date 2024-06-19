# QuestListRPG

A task list with simple RPG elements. 

## Table of Contents

- [QuestListRPG](#QuestListRPG)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

## Introduction

A task list with a twist for gamers to feel a sense of reward for completing tasks.

## Features

- User Registration and Auth
- Dialy and General Quests
- Boss Fights with Image Generation Using Keywords
- Earn Gold and EXP
- Buy Equipment to Grow Stronger!
- Check Your Current Stats


## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB

### Installation

1.  Clone the repository:
    git clone https://github.com/CPaskewitz/taskmasterrpg.git
2.  Navigate to the project directory:
    cd taskmasterrpg
3.	Install dependencies:
    npm install
4.  Create a Database on MongoDB called taskmaster:
    Create the following collections:
    * bosses
    * bossMetadata
    * characters
    * tasks
    * users
    * equipment - Create your own equipment using the following:
      [ 
        { 
          name: string;
          type: string;
          damageBoost: number;
          cost: number;
          requiredLevel: number;
        }
      ]
5.	Set up server side environment variables:
    Create a .env file in the root directory of taskmaster-server and add the following:
    PORT=3000
    JWT_SECRET=your-secret-key
    MONGODB_URI=your-mongodb-srv-link
    OPENAI_API_KEY=your-openai-api-key
6.  Set up front end environment variables:
    Create a .env file in the root directory of taskmaster-frontend and add the following:
    VITE_APP_BASE_URL=http://localhost:3000

## Usage

1.	Start the server:
    cd taskmaster-server
    npm start
2.	Start the frontend:
    cd taskmaster-frontend
    npm run dev

## API Endpoints

### User Endpoints

	•	POST /api/users/register - Register a new user.
	•	POST /api/users/login - Log in a user.
	•	GET /api/users/character - Get the current user’s character.
	•	PUT /api/users/character - Update the current user’s character.

### Task Endpoints

	•	POST /api/tasks - Create a new task.
	•	GET /api/tasks - Get all tasks for the current user.
	•	GET /api/tasks/:id - Get a specific task.
	•	PUT /api/tasks/:id - Update a specific task.
	•	DELETE /api/tasks/:id - Delete a specific task.

### Equipment Endpoints

	•	GET /api/shop/equipment - Get available equipment.
	•	POST /api/shop/purchase - Purchase equipment.

### Boss Endpoints

	•	GET /api/boss - Get the current boss.
	•	PUT /api/boss/:id/attack - Attack the current boss.
	•	POST /api/boss/new - Generate a new boss.

## Contributing

1.	Fork the repository
2.	Create a new branch:
      git checkout -b feature/YourFeature
3.	Make your changes
4.	Commit your changes:
    git commit -m 'Add some feature'
5.	Push to the branch:
    git push origin feature/YourFeature
6.	Open a pull request

## License

This project is licensed under the MIT License - see the [License](https://opensource.org/license/mit) file for details.

## Contact

* Email: corey.paskewitz@gmail.com
* GitHub: CPaskewitz
* LinkedIn: [LinkedIn](https://www.linkedin.com/in/corey-paskewitz/)
