# .NET Backend Documentation

## Overview
This document provides details on the .NET backend for the Maze Algorithm Learning App. It covers setup, project structure, development, and deployment instructions.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Prerequisites
Ensure you have the following installed:
- **.NET Core SDK** (Version 8.0)
- **Git**

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/demianprykhodko/Pathfinding-Algorithms.git
   cd MazeBackend
   ```
2. Restore dependencies:
   ```sh
   dotnet restore
   ```

## Project Structure
```
backend/
│-- Hubs/                  # SignalR Hub
│-- Models/                # Data models
│-- Services/              # Business logic services
│-- Data/                  # Database context and migrations
│-- Program.cs             # Application entry point
│-- Startup.cs             # Configuration and middleware setup
│-- appsettings.json       # Application settings
```

## Testing
To run unit tests:
```sh
dotnet test
```
