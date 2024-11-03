import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AStarService {
  private pathUpdateSubject = new Subject<MazeCell[][]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<MazeCell[][] | null> {
    const openSet = new Set<MazeCell>();
    const closedSet = new Set<string>();
    const parentMap = new Map<string, MazeCell | null>();
  
    // Initialize start cell costs
    startCell.gCost = 0;
    startCell.hCost = this.calculateHeuristic(startCell, endCell);
    startCell.fCost = startCell.gCost + startCell.hCost;
  
    openSet.add(startCell);
    parentMap.set(`${startCell.x},${startCell.y}`, null);
  
    while (openSet.size > 0) {
      // Get the cell with the lowest F-cost
      let current = Array.from(openSet).reduce((lowest, cell) => cell.fCost < lowest.fCost ? cell : lowest);
  
      openSet.delete(current);
      closedSet.add(`${current.x},${current.y}`);
      current.isVisited = true;
  
      this.pathUpdateSubject.next(grid); // Emit update for visualization
      await this.delay(30); // Adjust delay for visualization speed
  
      // Check if we've reached the end cell
      if (current === endCell) {
        this.reconstructPath(grid, parentMap, endCell);
        return grid;
      }
  
      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
  
        // Ignore the neighbor if it's a wall or already evaluated
        if (neighbor.isWall || closedSet.has(neighborKey)) continue;
  
        const tentativeGCost = current.gCost + 1; // Assume a grid with uniform cost (1) per step
  
        if (tentativeGCost < neighbor.gCost || !openSet.has(neighbor)) {
          // Update costs
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = this.calculateHeuristic(neighbor, endCell);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
  
          parentMap.set(neighborKey, current);
  
          // Add the neighbor to the open set if it's not already in it
          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }
  
    return null; // No path found
  }
  
  // Heuristic calculation (Manhattan distance)
  private calculateHeuristic(cell: MazeCell, endCell: MazeCell): number {
    return Math.abs(cell.x - endCell.x) + Math.abs(cell.y - endCell.y);
  }
  
  private reconstructPath(grid: MazeCell[][], parentMap: Map<string, MazeCell | null>, endCell: MazeCell) {
    let current: MazeCell | null = endCell;
  
    while (current) {
      current.isPath = true;
      current = parentMap.get(`${current.x},${current.y}`) || null;
    }
  
    this.pathUpdateSubject.next(grid); // Final update to show reconstructed path
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
