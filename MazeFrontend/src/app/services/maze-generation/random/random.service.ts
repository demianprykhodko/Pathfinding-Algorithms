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

  constructor(private signalrRService: SignalrService) { }

  async generateMaze(grid: MazeCell[][], startCell: MazeCell | undefined, endCell: MazeCell | undefined): Promise<MazeCell[][]> {
    // Loop over each cell in the grid
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        // Randomly set cells as walls
        if (Math.random() < 0.3) {
          grid[y][x].isWall = true;
        }

        // Emit the grid update to visualize the generation step-by-step
        this.gridUpdateSubject.next(grid);
        this.signalrRService.sendMazeUpdate(grid);

        // Delay for animation effect
        await this.delay(10); // Adjust the delay as needed
      }
    }

    // Ensure start and end cells are not walls
    if (startCell) grid[startCell.y][startCell.x].isWall = false;
    if (endCell) grid[endCell.y][endCell.x].isWall = false;

    // Final grid update after the maze is fully generated
    this.gridUpdateSubject.next(grid);
    this.signalrRService.sendMazeUpdate(grid);

    return grid;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
