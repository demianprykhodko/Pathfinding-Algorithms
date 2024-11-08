import { Injectable } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';
import { SignalrService } from '../../signalr/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  private gridUpdateSubject = new Subject<MazeCell[][]>();
  public gridUpdates$ = this.gridUpdateSubject.asObservable();

  constructor(private signalrService: SignalrService) { }

  async generateMaze(grid: MazeCell[][], startCell: MazeCell | undefined, endCell: MazeCell | undefined): Promise<void> {
    const updatedCells: MazeCell[] = [];

    // Loop over each cell in the grid
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        // Randomly set cells as walls
        if (Math.random() < 0.3) {
          grid[y][x].isWall = true;
          updatedCells.push(grid[y][x]); // Add modified cell to the list
        }

        // Send updates for current batch of modified cells
        if (updatedCells.length > 0) {
          this.gridUpdateSubject.next(grid);
          this.signalrService.sendMazeUpdatev2(updatedCells);
          updatedCells.length = 0; // Clear the batch after sending
        }

        // Delay for animation effect
        await this.delay(10); // Adjust the delay as needed
      }
    }

    // Ensure start and end cells are not walls
    if (startCell) grid[startCell.y][startCell.x].isWall = false;
    if (endCell) grid[endCell.y][endCell.x].isWall = false;

    // Send start and end cells as a final update if modified
    const finalUpdates = [];
    if (startCell) finalUpdates.push(grid[startCell.y][startCell.x]);
    if (endCell) finalUpdates.push(grid[endCell.y][endCell.x]);
    if (finalUpdates.length > 0) {
      this.gridUpdateSubject.next(grid);
      this.signalrService.sendMazeUpdatev2(finalUpdates);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
