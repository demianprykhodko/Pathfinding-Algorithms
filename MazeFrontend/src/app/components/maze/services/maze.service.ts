import { Injectable, OnDestroy } from '@angular/core';
import { MazeCell } from '../../../models/maze-cell.model';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { RecursiveDivisionService } from '../../../services/maze-generation/recursive-division/recursive-division.service';
import { RandomService } from '../../../services/maze-generation/random/random.service';
import { BreadthFirstSearchService } from '../../../services/pathfinding/bfs/bfs.service';
import { DepthFirstSearchService } from '../../../services/pathfinding/dfs/dfs.service';
import { AStarService } from '../../../services/pathfinding/astar/astar.service';
import { SignalrService } from '../../../services/signalr/signalr.service';

@Injectable({
  providedIn: 'root'
})
export class MazeService implements OnDestroy {

  constructor(
    private recursiveDivisionService: RecursiveDivisionService,
    private randomService: RandomService,
    private bfsService: BreadthFirstSearchService,
    private dfsService: DepthFirstSearchService,
    private aStarService: AStarService,
    private signalrService: SignalrService
  ) {
    this.signalrService.mazeUpdateSubject.subscribe((mazeData: MazeCell[][]) => {
      this.grid = mazeData; // Replace the local grid with the received grid
      this.gridSubject.next(this.grid); // Emit the updated grid to update the UI
    });
  }

  public grid: MazeCell[][] = [];
  // Sends updates to the maze component
  public gridSubject = new Subject<MazeCell[][]>();
  // Subscription to the grid updates in the maze services
  private gridUpdateSubscription!: Subscription;

  private isGeneratingSubject = new BehaviorSubject<boolean>(false);
  isGenerating$ = this.isGeneratingSubject.asObservable();

  private startCell?: MazeCell;
  private endCell?: MazeCell;

  public initializeGrid(rows: number, cols: number) {
    this.grid = [];
    for (let y = 0; y < rows; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push({
          x,
          y,
          isWall: false,
          isStart: false,
          isEnd: false,
          isPath: false,
          isVisited: false,
          gCost: 0,
          hCost: 0,
          fCost: 0,
        });
      }
      this.grid.push(row);
    }

    this.gridSubject.next(this.grid);
  }

  public updateCell(cell: MazeCell) {
    this.grid[cell.y][cell.x] = cell;
    this.gridSubject.next(this.grid);
  }

  public setStartCell(cell: MazeCell) {
    if (this.startCell) {
      this.startCell.isStart = false;
      this.updateCell(this.startCell);
    }
    cell.isStart = true;
    this.startCell = cell;
    this.updateCell(cell);

    this.clearGrid();
  }

  public setEndCell(cell: MazeCell) {
    if (this.endCell) {
      this.endCell.isEnd = false;
      this.updateCell(this.endCell);
    }
    cell.isEnd = true;
    this.endCell = cell;
    this.updateCell(cell);

    this.clearGrid();
  }

  public async generateMazeRecursiveDivision(skew: number = 0.5) {
    this.clearGrid(true);
    this.isGeneratingSubject.next(true);

    // Unsubscribe from any previous subscription to avoid multiple listeners
    if (this.gridUpdateSubscription) {
      this.gridUpdateSubscription.unsubscribe();
    }

    // Subscribe to grid updates from RecursiveDivisionService
    this.gridUpdateSubscription = this.recursiveDivisionService.gridUpdates$.subscribe((grid) => {
      this.gridSubject.next(grid);
    });

    // Generate default recursive division maze
    await this.recursiveDivisionService.generateMaze(this.grid, this.startCell, this.endCell, skew);
    this.isGeneratingSubject.next(false);
  }

  public async generateRandom() {
    this.clearGrid(true);
    this.isGeneratingSubject.next(true);

    // Unsubscribe from any previous subscription to avoid multiple listeners
    if (this.gridUpdateSubscription) {
      this.gridUpdateSubscription.unsubscribe();
    }

    // Subscribe to grid updates from RandomMazeService
    this.gridUpdateSubscription = this.randomService.gridUpdates$.subscribe((grid) => {
      this.gridSubject.next(grid);
    });

    // Generate the random maze asynchronously
    await this.randomService.generateMaze(this.grid, this.startCell, this.endCell);

    // Unsubscribe after generation is complete
    this.gridUpdateSubscription.unsubscribe();
  }

  public async startBfs() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);

    this.bfsService.pathUpdates$.subscribe(grid => {
      this.gridSubject.next(grid);
    });

    await this.bfsService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
  }

  public async startDfs() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);

    this.dfsService.pathUpdates$.subscribe(grid => {
      this.gridSubject.next(grid);
    });

    await this.dfsService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
  }

  public async startAStar() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);

    this.aStarService.pathUpdates$.subscribe(grid => {
      this.gridSubject.next(grid);
    });

    await this.aStarService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
  }

  public clearGrid(walls: boolean = false) {
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell.isPath || cell.isWall || cell.isVisited) {
          if (walls) {
            cell.isWall = false;
          }
          cell.isPath = false;
          cell.isVisited = false;
          this.updateCell(cell);
        }
      }
    }
  }

  public applyMazeUpdate(mazeUpdate: MazeCell[][]) {
    this.grid = mazeUpdate;
    this.gridSubject.next(this.grid); // Notify all components of the new grid state
  }

  ngOnDestroy(): void {
    // Clean up the subscription on service destruction
    if (this.gridUpdateSubscription) {
      this.gridUpdateSubscription.unsubscribe();
    }
  }
}
