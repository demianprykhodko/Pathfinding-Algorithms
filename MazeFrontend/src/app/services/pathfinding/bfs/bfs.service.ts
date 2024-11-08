import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadthFirstSearchService {
  private pathUpdateSubject = new Subject<MazeCell[]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  public async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<void | null> {
    // Queue for BFS, starting with the startCell
    const queue: MazeCell[] = [startCell];
    // Set to track visited cells
    const visited = new Set<string>();
    // Map to track each cell's parent
    const parentMap = new Map<string, MazeCell | null>();

    // Mark the start cell as visited and initialize its parent as null
    visited.add(`${startCell.x},${startCell.y}`);
    parentMap.set(`${startCell.x},${startCell.y}`, null);

    // BFS loop: continue until there are no cells left in the queue
    while (queue.length > 0) {
      // Dequeue the first cell
      const current = queue.shift()!;
      // Mark cell as visited
      current.isVisited = true;

      // Collect updated cells to emit for visualization
      const updatedCells: MazeCell[] = [current];

      // If the current cell is the end cell, reconstruct the path and return the grid
      if (current === endCell) {
        this.reconstructPath(grid, parentMap, endCell);
        return;
      }

      // Get neighbors of the current cell
      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        // If the neighbor has not been visited and is not a wall
        if (!visited.has(neighborKey) && !neighbor.isWall) {
          // Mark the neighbor as visited
          visited.add(neighborKey);
          // Set the current cell as the parent of the neighbor
          parentMap.set(neighborKey, current);
          // Enqueue the neighbor for further exploration
          queue.push(neighbor);

          updatedCells.push(neighbor); // Add to batch of updates
        }
      }

      // Emit the batch of updated cells for visualization
      this.pathUpdateSubject.next(updatedCells);
      // Delay for animation
      await this.delay(10);
    }

    // No path found
    return null;
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

  // Helper method to introduce a delay for visualization purposes
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
