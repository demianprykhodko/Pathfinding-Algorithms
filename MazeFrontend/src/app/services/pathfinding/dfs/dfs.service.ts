import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MazeCell } from '../../../models/maze-cell.model';

@Injectable({
  providedIn: 'root'
})
export class DepthFirstSearchService {
  private pathUpdateSubject = new Subject<MazeCell[]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<void | null> {
    // Stack to keep track of cells to visit, starting with the startCell
    const stack: MazeCell[] = [startCell];
    // Set to track visited cells and avoid revisiting them
    const visited = new Set<string>();
    // Map to track the parent of each cell, used for reconstructing the path
    const parentMap = new Map<string, MazeCell | null>();  // Track the parent of each cell
  
     // Initialize the parent of the start cell as null
    parentMap.set(`${startCell.x},${startCell.y}`, null);
  
    // DFS loop: continue until there are no cells left in the stack
    while (stack.length > 0) {
      // Pop the last cell from the stack (LIFO order)
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;

      visited.add(key);
      current.isVisited = true;
  
      // Emit only the current modified cell for visualisation
      this.pathUpdateSubject.next([current]);
      await this.delay(30);
  
      // If the current cell is the end cell, reconstruct the path and return the grid
      if (current === endCell) {
        this.reconstructPath(grid, parentMap, endCell);
        return;
      }
  
      // Get all valid neighbors (up, down, left, right)
      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
  
        // Add the neighbor to the stack if it hasn't been visited and isn't a wall
        if (!visited.has(neighborKey) && !neighbor.isWall) {
          stack.push(neighbor);
          parentMap.set(neighborKey, current);  // Set the current cell as the parent of the neighbor
        }
      }
    }
  
    return null; // No path found
  }

  // Method to reconstruct the path from endCell to startCell using parentMap
  private reconstructPath(grid: MazeCell[][], parentMap: Map<string, MazeCell | null>, endCell: MazeCell) {
    // Array to track cells that form the path
    const pathCells: MazeCell[] = [];
    let current: MazeCell | null = endCell;

    while (current) {
      // Mark the cell as part of the path
      current.isPath = true;
      // Add the cell to the path batch
      pathCells.push(current);
      // Move to the parent cell
      current = parentMap.get(`${current.x},${current.y}`) || null;
    }
  
    // Final update to show path
    this.pathUpdateSubject.next(pathCells);
  }
  
  // Helper method to get valid neighbors (up, down, left, right)
  private getNeighbors(grid: MazeCell[][], cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = [];
    const directions = [
      { dx: -1, dy: 0 },  // left
      { dx: 1, dy: 0 },   // right
      { dx: 0, dy: -1 },  // up
      { dx: 0, dy: 1 }    // down
    ];

    for (const { dx, dy } of directions) {
      const x = cell.x + dx;
      const y = cell.y + dy;
      // Check if the neighbor is within the grid bounds
      if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        neighbors.push(grid[y][x]);
      }
    }

    return neighbors;
  }

  // Helper method to introduce a delay for visualization purposes
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
