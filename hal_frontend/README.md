## Architecture

The project is structured to provide a complete environment for autonomous agent experimentation:
 
- **Client Side:**
    - A React-based frontend built with Vite to visualize agent interactions, chat history, and real-time updates, using Shadcn and Tailwind for creation and styling of react components
  
---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)

---

## Installation

1. **Install Dependencies**

    ```
    cd hal-frontend
    npm install
    ```

2. **Start the Develompent Client**

   Navigate to the frontend folder and start the Vite server

    ```
    npm run dev
    ```
   wait until websocket, redis clients and prisma server have been started 