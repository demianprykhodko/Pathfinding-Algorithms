import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadthFirstSearchService {
  private pathUpdateSubject = new Subject<MazeCell[][]>();
  public pathUpdates$ = this.pathUpdateSubject.asObservable();

  constructor() { }

  public async findPath(grid: MazeCell[][], startCell: MazeCell, endCell: MazeCell): Promise<MazeCell[][] | null> {
    const queue: MazeCell[] = [startCell];
    const visited = new Set<string>();
    const parentMap = new Map<string, MazeCell | null>();

    visited.add(`${startCell.x},${startCell.y}`);
    parentMap.set(`${startCell.x},${startCell.y}`, null);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = `${current.x},${current.y}`;
      current.isVisited = true;  // Mark cell as visited

      if (current === endCell) {
        this.reconstructPath(grid, parentMap, endCell);
        return grid;
      }

      for (const neighbor of this.getNeighbors(grid, current)) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborKey) && !neighbor.isWall) {
          visited.add(neighborKey);
          parentMap.set(neighborKey, current);
          queue.push(neighbor);

          this.pathUpdateSubject.next(grid); // Emit update for visualization
          await this.delay(30); // Adjust delay for animation effect
        }
      }
    }

    return null; // No path found
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

  private reconstructPath(grid: MazeCell[][], parentMap: Map<string, MazeCell | null>, endCell: MazeCell) {
    let current: MazeCell | null = endCell;
    while (current) {
      current.isPath = true;
      current = parentMap.get(`${current.x},${current.y}`) || null;
    }
    this.pathUpdateSubject.next(grid); // Final update to show path
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
