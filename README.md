<img width="100" height="100" src="./assets/bot.svg"/>

#Agents Home Lab


Welcome to **Agents Home Lab**, a hands-on project designed for learning how to create, configure, 
and deploy autonomous agents that can perform tasks by interfacing with external services.
This project serves as a sandbox for developers and enthusiasts to explore agent technologies, customize tools, and integrate real-time data processing. 
The project is intended as a laboratory for developers interested in learning how to interact with 
language models (LLMs) and create their own tools for interaction. Ihave made a decision to separate the server and client using different libraries
and frameworks to explore the full potential of this setup. However, you can choose to focus solely on tool building if you prefer.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- **Modular Agents:** Easily create and configure agents to perform a variety of tasks.
- **Custom Tools Integration:** Connect agents with external APIs and databases; for example, using OpenAI's function calling to fetch data or trigger actions.
- **Real-Time Interaction:** Integrate WebSocket communication for live updates between server and client.
- **Practical Examples:** Learn how to use tools with examples (e.g., querying and updating a database).
- **Extensible Architecture:** Designed to scale and integrate additional functionalities over time.

---

## Architecture

The project is structured to provide a complete environment for autonomous agent experimentation:

- **Server Side:**  
  - A custom Next.js server that integrates Redis, WebSocket and database (PostgreSQL via Prisma) functionality. 
  - API routes for interacting with agents and tools.
  - See [TOOL_TEMPLATE](./TOOL_TEMPLATE.md) readme to see how the tools provided are build 
  
- **Client Side:**  
  - A React-based frontend built with Vite to visualize agent interactions, chat history, and real-time updates, using Shadcn and Tailwind for creation and styling of react components
  
- **Tool Integration:**  
  - Tools are defined (via JSON schemas) for function calling by OpenAI (e.g., `get_weather`, `send_email`, or custom database actions like `updateDataByTableName`).

- **Data Persistence:**  
  - A PostgreSQL database, managed with Prisma, and optionally, Redis for message history and caching.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **PostgreSQL** database
- **Redis**   
- A valid **OpenAI API Key**

---

## Installation

1. **Clone the Repository**

   ```
   git clone https://github.com/giuseppe-straziota/agents-home-lab.git
   cd agents-home-lab
   ```
2. **Install Dependencies**  

   Install dependencies for the server from the root directory:

    ```
    cd hal-server
    npm install 
    ```
    Install dependencies for the frontend from the root directory:

    ```
    cd hal-frontend
    npm install
    ```
       
3. **Configure Enviroments Variables**
    
    Create a ```.env``` file in the root directory of the server application and add your enviroment variables.

     ```
    SERVER_HOST=localhost
    SERVER_PORT=3005
    
    WS_HOST=localhost
    WS_PORT=3006
    
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
      
    OPENAI_API_KEY=your_openai_api_key
       
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/HomeAgents?schema=public"
    ```
    feel free to change address, port and database information 

4. **Run Database Migrations**

   Ensure your PostgreSQL database is running, then run Prisma migrations to set up your schema and seed initial data from the root of the server application
   ```
   npx prisma migrate dev --name init
   npx prisma db seed
   ``` 
    
5. **Start the Development Server**

    Start the server from the root directory

    ```
    npm start
    ```
   
6. **Start the Develompent Client**

    Navigate to the frontend folder and start the Vite server

    ```
    npm run dev
    ```
    wait until websocket, redis clients and prisma server have been started 

## LIcense

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for educational purposes.
