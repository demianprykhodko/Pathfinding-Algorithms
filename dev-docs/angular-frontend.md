# Angular Frontend Documentation

## Overview
This document provides details on the Angular frontend for the Maze Algorithm Learning App. It covers setup, project structure, development.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)

## Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended, tested on v22.14.0)
- **Npm** (LTS version recommended, tested on v11.1.0)
- **Git**

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/demianprykhodko/Pathfinding-Algorithms.git
   cd MazeFrontend
   ```
2. Install dependencies:
   ```sh
   npm i
   ```

## Project Structure
```
frontend/
│-- src/
│   ├── app/               # Main application module
│   ├── environments/      # Environment configuration
│   ├── index.html         # Main HTML file
│   ├── main.ts            # Bootstrap application
│-- angular.json           # Angular project configuration
│-- package.json           # Dependencies and scripts
│-- tsconfig.json          # TypeScript configuration
```

## Development
To start the development server, run:
```sh
npm run start
```
This will serve the application at `http://localhost:4200/`.

### Manual Build
To manually build the project:
```sh
npm run build
```
This will generate the compiled files in the `dist/` directory.

## Testing
To run unit tests:
```sh
npm run test
```
