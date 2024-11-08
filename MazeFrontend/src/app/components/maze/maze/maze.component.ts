import { Component, OnDestroy, OnInit } from '@angular/core';
import { MazeService } from '../services/maze.service';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.less'
})
export class MazeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public grid : MazeCell[][] = [];

  constructor(private mazeService: MazeService) { }

  ngOnInit(): void {
    this.mazeService.gridSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((grid: MazeCell[][])  => this.grid = grid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCellClick(cell: MazeCell, event: MouseEvent): void {
    if (event.shiftKey) {
      this.mazeService.configureCell(cell, "start");
      return;
    } else if (event.altKey) {
      this.mazeService.configureCell(cell, "end");
      return;
    } else {
      this.mazeService.configureCell(cell, "wall");
    }
  }
}
