import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MazeCell } from '../../../models/maze-cell.model';

@Injectable({
  providedIn: 'root'
})
export class DepthFirstSearchService {
  private pathUpdateSubject = new Subject<MazeCell[][]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<MazeCell[][] | null> {
    const stack: MazeCell[] = [startCell];
    const visited = new Set<string>();
    const parentMap = new Map<string, MazeCell | null>();  // Track the parent of each cell
  
    parentMap.set(`${startCell.x},${startCell.y}`, null);
  
    while (stack.length > 0) {
      const current = stack.pop()!;
      const key = `${current.x},${current.y}`;
  
      if (visited.has(key)) continue;
      visited.add(key);
      current.isVisited = true;
  
      this.pathUpdateSubject.next(grid); // Emit update for visualization
      await this.delay(30); // Adjust delay for animation effect
  
      // Check if we reached the end cell
      if (current === endCell) {
        this.reconstructPath(grid, parentMap, endCell);
        return grid;
      }
  
      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
  
        // Only add unvisited and non-wall neighbors to the stack
        if (!visited.has(neighborKey) && !neighbor.isWall) {
          stack.push(neighbor);
          parentMap.set(neighborKey, current);  // Set the current cell as the parent of the neighbor
        }
      }
    }
  
    return null; // No path found
  }

  private reconstructPath(grid: MazeCell[][], parentMap: Map<string, MazeCell | null>, endCell: MazeCell) {
    let current: MazeCell | null = endCell;
  
    while (current) {
      current.isPath = true;
      current = parentMap.get(`${current.x},${current.y}`) || null;
    }
  
    this.pathUpdateSubject.next(grid); // Final update to show the reconstructed path
  }
  
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
