## Architecture

The project is structured to provide a complete environment for autonomous agent experimentation:

- **Server Side:**
    - A custom Next.js server that integrates Redis, WebSocket and database (PostgreSQL via Prisma) functionality.  Redis is used to store the messages send and received by the
      the LLM, informations that we need to send back to every openaAI call. Redis store also the configuration of every agent.
    - API routes for interacting with agents and tools.
    - See [TOOL_TEMPLATE](https://github.com/giuseppe-straziota/agents-home-lab/blob/main/TOOL_TEMPLATE.md) README to see how the tools provided are build

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

1. **Install Dependencies**

   Install dependencies for the server from the root directory:

    ```
    cd hal-server
    npm install 
    ``` 

2. **Configure Enviroments Variables**

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

3. **Run Database Migrations**

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

    wait until websocket, redis clients and prisma server have been started 