<img width="100" height="100" src="./assets/bot.svg"/>

# Agents Home Lab


Welcome to **Agents Home Lab**, a hands-on project designed for learning how to create, configure, 
and deploy autonomous agents that can perform tasks by interfacing with external services from your home computer.
This project serves as a sandbox for developers and enthusiasts to explore agent technologies, customize tools, and integrate real-time data processing. 
The project is intended as a laboratory for developers interested in learning how to interact with 
language models (LLMs) and create their own tools for interaction.I decided to separate the server and client using different libraries
and frameworks to explore the full potential of this setup. However, you can choose to focus solely on tool building if you prefer.

<img width="850" height="660" src="./assets/UI_with_chat.png"/>

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

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
  - A custom Next.js server that integrates Redis, WebSocket and database (PostgreSQL via Prisma) functionality.  Redis is used to store the messages send and received by the
   the LLM, informations that we need to send back to every openaAI call. Redis store also the configuration of every agent.
  - API routes for interacting with agents and tools.
  - See [TOOL_TEMPLATE](https://github.com/giuseppe-straziota/agents-home-lab/blob/main/TOOL_TEMPLATE.md) README to see how the tools provided are build 
  
- **Client Side:**  
  - A React-based frontend built with Vite to visualize agent interactions, chat history, and real-time updates, using Shadcn and Tailwind for creation and styling of react components
  
- **Tool Integration:**  
  - Tools are defined (via JSON schemas) for function calling by OpenAI (e.g., `get_weather`, `send_email`, or custom database actions like `updateDataByTableName` as I did).

- **Data Persistence:**  
  - A PostgreSQL database, managed with Prisma and Redis for message history and caching.

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
   npx prisma db push
   npx prisma db seed 
   ``` 
    
5. **Start the Development Server**

    Start the server from the root directory

    ```
    npm start
    ```

6. **Configure Enviroments Variables for the frontend**

   Create a .env file in the root directory of the client application
   and add your enviroment variables.
    ```
   VITE_WEBSOCKET_URL=ws://localhost:3006/ws
   ```
   
7 **Start the Develompent Client**

    Navigate to the frontend folder and start the Vite server

    ```
    npm run dev
    ```
    wait until websocket, redis clients and prisma server have been started 

## Usage

A predefined agent has been provided, its name is Alfred and he act as a housekeeper, and it has two different tools linked, Pantry_stock ( for retrieval information from the pantry) and
Update_pantry (as the name suggests, the aim is to update the object inside the item table of the db, which contains the pantry items). Alfred uses the OpenAI LLM (the only available one now)
to reach the goals and understand which tool is the best to use.  I suggest you explore the configuration of his tools to have a better understanding of the implementation and
requirements for your new tools.

Anyway you can add your agent and create your own tools using the templates available and personalizing the LLM with your prompt and model, it needs just some simple steps.

<img width="390" height="330" src="./assets/create_agent.png"/>

A modal with some information about your agent will be shown (you can decide to not activate the agent and the chat will no be available)

<img width="470" height="460" src="./assets/create_agent_form.png"/>

After the agent creation you have to add an LLM (just one for agent in this release) and several tools.


<img width="120" height="140" src="./assets/create_tool_llm.png"/>

An example of LLM definition is that provided by the Alfred LLM

<img width="420" height="530" src="./assets/llm_alfred.png"/>

Here a shown a description, a prompt with the LLM model choose.
This panel with the action button at bottom are visible selecting the llm from the flow elements.

Following the tools defined for Alfred

<img width="418" height="810" src="./assets/tool_pantry_retrieval.png"/>

In this example you can see a description, that define the instruction that will trigger this tool by the llm, a name used
 by the LLM to reference the function and a table with the fields that you want retrieve from the db.

The second tool provided for Alfred is the one that create or update the item into the pantry, and is defined as follow


<img width="415" height="1193" src="./assets/tool_pantry_update.png"/>

the difference in this casa is that you need to provide a json, defined in the field Parameters, that is the content of the parameters that OpenAI need 
when you define a tools that needs information from the LLM (is quite described by the OpenAI in their guide, don't worry)

The GUI with a piece of conversation is shown in the following image


<img width="850" height="660" src="./assets/UI_with_chat.png"/>

Enjoy!


## License

This project is licensed under the MIT [LICENSE](https://github.com/giuseppe-straziota/agents-home-lab/blob/main/LICENSE.md). Feel free to use, modify, and distribute it for educational purposes.
