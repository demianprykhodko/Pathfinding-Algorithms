import { Component, OnInit } from '@angular/core';
import { MazeService } from '../services/maze.service';
import { MazeCell } from '../../../models/maze-cell.model';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.less'
})
export class MazeComponent implements OnInit {
  grid : MazeCell[][] = [];

  constructor(private mazeService: MazeService) { }

  ngOnInit(): void {
    this.mazeService.gridSubject.subscribe((grid) => {
      this.grid = grid;
    });

    this.mazeService.initializeGrid(25, 34);
  }

  onCellClick(cell: MazeCell, event: MouseEvent) {
    if (event.shiftKey) {
      // Set Start Cell
      this.mazeService.setStartCell(cell);
    } else if (event.altKey) {
      // Set End Cell
      this.mazeService.setEndCell(cell);
    } else {
      // Toggle Wall
      if (!cell.isStart && !cell.isEnd) {
        const updatedCell: MazeCell = { ...cell, isWall: !cell.isWall, isPath: false };
        this.mazeService.updateCell(updatedCell);
      }
    }
  }
}
