# Agents Home Lab

![Agents Home Lab Logo](./assets/logo.png)

Welcome to **Agents Home Lab**, a hands-on project for learning how to create, configure, and deploy autonomous agents that can perform tasks by interfacing with external services. This project is designed as a sandbox for developers and enthusiasts to explore agent technologies, customize tools, and integrate real-time data processing.

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
- **Real-Time Interaction:** Integrate WebSocket communication for live updates.
- **Practical Examples:** Learn how to use tools with detailed examples (e.g., querying a database, sending emails).
- **Extensible Architecture:** Designed to scale and integrate additional functionalities over time.

---

## Architecture

The project is structured to provide a complete environment for autonomous agent experimentation:

- **Server Side:**  
  - A custom Next.js server (running via Node.js) that integrates WebSocket and database (PostgreSQL via Prisma) functionality.
  - API routes (implemented in TypeScript with `route.ts` files) for interacting with agents and tools.
  
- **Client Side:**  
  - A React-based frontend built with Next.js to visualize agent interactions, chat history, and real-time updates.
  
- **Tool Integration:**  
  - Tools are defined (via JSON schemas) for function calling by OpenAI (e.g., `get_weather`, `send_email`, or custom database actions like `updateDataByTableName`).

- **Data Persistence:**  
  - A PostgreSQL database, managed with Prisma, and optionally, Redis for message history and caching.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm**
- **PostgreSQL** database
- **Redis** (optional, for message history or caching)
- **Docker** (optional, for containerized deployment)
- A valid **OpenAI API Key**

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/giuseppe-straziota/agents-home-lab.git
   cd agents-home-lab
2. **Install Dependencies**
3. **Configure Enviroments Variables**
4. **Run Database Migrations**
5. **Start the Development Server**
6. **Start the Develompent Client**

## LIcense

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for educational purposes.
