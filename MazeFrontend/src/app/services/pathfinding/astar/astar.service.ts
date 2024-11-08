import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AStarService {
  private pathUpdateSubject = new Subject<MazeCell[]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<void | null> {
    // Set of cells to be evaluated
    const openSet = new Set<MazeCell>();
    // Set of cells already evaluated
    const closedSet = new Set<string>();
    // Map to track parent of each cell for path reconstruction
    const parentMap = new Map<string, MazeCell | null>();
  
    // Initialize start cell with G-cost, H-cost, and F-cost
    startCell.gCost = 0;
    startCell.hCost = this.calculateHeuristic(startCell, endCell);
    startCell.fCost = startCell.gCost + startCell.hCost;
  
    // Add start cell to the open set
    openSet.add(startCell);
    // No parent for the start cell
    parentMap.set(`${startCell.x},${startCell.y}`, null);
  
    // A* loop: continue until there are no cells left in the open set
    while (openSet.size > 0) {
      // Find the cell in the open set with the lowest F-cost
      let current = Array.from(openSet).reduce((lowest, cell) => cell.fCost < lowest.fCost ? cell : lowest);
  
      // Remove current cell from the open set
      openSet.delete(current);
      // Mark current cell as evaluated
      closedSet.add(`${current.x},${current.y}`);
      // Mark cell as visited for visualization
      current.isVisited = true;

      // Collect modified cells for incremental update
      const updatedCells: MazeCell[] = [current];
  
      // Emit update for visualisation
      this.pathUpdateSubject.next(updatedCells);
      await this.delay(30);
  
      // If the end cell is reached, reconstruct the path and return the grid
      if (current === endCell) {
        this.reconstructPath(parentMap, endCell);
        return;
      }
  
      // Explore neighbors of the current cell
      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
  
        // Skip the neighbor if it's a wall or already evaluated
        if (neighbor.isWall || closedSet.has(neighborKey)) continue;
  
        // Calculate the G-cost for the neighbor (assuming uniform cost of 1 per step)
        const tentativeGCost = current.gCost + 1;
  
        // If this path to the neighbor is better, or the neighbor hasn't been visited yet
        if (tentativeGCost < neighbor.gCost || !openSet.has(neighbor)) {
          // Update costs for the neighbor
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = this.calculateHeuristic(neighbor, endCell);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
  
          // Set the parent of the neighbor
          parentMap.set(neighborKey, current);
  
          // Add the neighbor to the open set if it's not already in it
          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }

          // Collect neighbor in the batch of updates
          updatedCells.push(neighbor);
        }
      }
      // Emit modified neighbors as a batch update
      this.pathUpdateSubject.next(updatedCells);
    }
  
    // No path found
    return null;
  }
  
  // Calculates the heuristic cost (Manhattan distance) from a cell to the end cell
  private calculateHeuristic(cell: MazeCell, endCell: MazeCell): number {
    return Math.abs(cell.x - endCell.x) + Math.abs(cell.y - endCell.y);
  }
  
  // Reconstructs the path from end cell to start cell using the parentMap
  private reconstructPath(parentMap: Map<string, MazeCell | null>, endCell: MazeCell) {
    const pathCells: MazeCell[] = [];
    let current: MazeCell | null = endCell;

    // Backtrack from the end cell to the start cell using the parent map
    while (current) {
      // Mark the cell as part of the path
      current.isPath = true;
      pathCells.push(current);
      current = parentMap.get(`${current.x},${current.y}`) || null;
    }

    // Emit the final path for visualisation
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
