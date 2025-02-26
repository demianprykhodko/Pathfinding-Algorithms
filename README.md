# Maze Algorithm Learning App

## Overview
This project is an interactive web application for learning maze generation and pathfinding algorithms. It consists of:
- **Frontend**: Built with Angular.
- **Backend**: Developed in C#.

Users can visualise how different maze algorithms generate mazes and how pathfinding algorithms navigate them.

## Live Site
[View the live project here](https://white-coast-0fb725203.5.azurestaticapps.net/)

## Features
- **Maze Generation Algorithms**
  - Recursive Division
  - Recursive Division (Horizontal skew)
  - Recursive Division (Vertical skew)
  
- **Pathfinding Algorithms**
  - A* Search
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  
- **Grid Interaction**
  - Click: Place a wall
  - Ctrl + Click: Set start point
  - Alt + Click: Set end point
  - Other controls are in the sidebar

## Development Documentation
For more details on the architecture, setup, and development of each part of the project, refer to:
- [Frontend Documentation](dev-docs/angular-frontend.md)
- [Backend Documentation](dev-docs/dotnet-backend.md)

## Deployment
This project uses automatic deployments on push to the `main` branch via GitHub Actions:

- Frontend Deployment: Managed with MazeFrontend.yml, triggered on push in the MazeFrontend folder, deploying to GitHub Pages.

- Backend Deployment: Managed with MazeBackend.yml, triggered on push in the MazeBackend folder.

Both pipelines ensure that the latest code is deployed automatically without manual intervention.

## License
This project is licensed under the MIT License.
