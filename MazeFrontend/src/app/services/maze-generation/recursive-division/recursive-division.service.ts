import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';
import { SignalrService } from '../../signalr/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class RecursiveDivisionService {
  // Observable to emit grid updates
  private gridUpdateSubject = new Subject<MazeCell[][]>();
  public gridUpdates$ = this.gridUpdateSubject.asObservable();

  constructor(private signalrService: SignalrService) {}

  async generateMaze(grid: MazeCell[][], startCell: MazeCell | undefined, endCell: MazeCell | undefined, skew: number): Promise<void> {
    // Start the division on the full grid
    await this.divide(grid, 0, 0, grid[0].length, grid.length, skew);

    if (startCell) grid[startCell.y][startCell.x].isWall = false;
    if (endCell) grid[endCell.y][endCell.x].isWall = false;
  }

  private async divide(grid: MazeCell[][], x: number, y: number, width: number, height: number, skew: number): Promise<void> {
    // Base case: stop if region is too small
    if (width < 2 || height < 2) return;

    // Decide division orientation: horizontal if height > width
    const horizontal = Math.random() < skew ? height > width : width > height;

    // Wall coordinates only at odd indexes to ensure there is always a passage
    const wx = x + (horizontal ? 0 : 2 * Math.floor(Math.random() * ((width - 1) / 2)) + 1);
    const wy = y + (horizontal ? 2 * Math.floor(Math.random() * ((height - 1) / 2)) + 1 : 0);

    // Passage coordinates, randomly chosen from the wall coordinates and at even indexes
    const px = wx + (horizontal ? Math.floor(Math.random() * (width / 2)) * 2 : 0);
    const py = wy + (horizontal ? 0 : Math.floor(Math.random() * (height / 2)) * 2);

    // Draw wall
    const length = horizontal ? width : height;

    for (let i = 0; i < length; i++) {
      const cellX = wx + (horizontal ? i : 0);
      const cellY = wy + (horizontal ? 0 : i);

      // Skip passage cell
      if (cellX === px && cellY === py) continue;

      // Set as wall
      grid[cellY][cellX].isWall = true;
    }

     // Emit the updated grid state
     this.gridUpdateSubject.next(grid);
     this.signalrService.sendMazeUpdate(grid);
     await this.delay(60); // Adjust delay for visualization speed

    // Divide recursively in four sections
    if (horizontal) {
      // Top and bottom regions
      await this.divide(grid, x, y, width, wy - y, skew); // Top region
      await this.divide(grid, x, wy + 1, width, y + height - wy - 1, skew); // Bottom region
    } else {
      // Left and right regions
      await this.divide(grid, x, y, wx - x, height, skew); // Left region
      await this.divide(grid, wx + 1, y, x + width - wx - 1, height, skew); // Right region
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
