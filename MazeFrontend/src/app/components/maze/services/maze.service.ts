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
export class MazeService {

  constructor(
    private recursiveDivisionService: RecursiveDivisionService,
    private randomService: RandomService,
    private bfsService: BreadthFirstSearchService,
    private dfsService: DepthFirstSearchService,
    private aStarService: AStarService,
    private signalrService: SignalrService
  ) {
    this.signalrService.mazeUpdateSubject.subscribe((mazeData: MazeCell[][]) => {
      this.applyMazeUpdate(mazeData);
    });

    this.signalrService.isGeneratingUpdateSubject.subscribe((isGeneratingData: boolean) => {
      this.isGeneratingSubject.next(isGeneratingData)
    })

    this.signalrService.startCellSubject.subscribe((startCell: MazeCell) => {
      this.startCell = startCell;
    })

    this.signalrService.endCellSubject.subscribe((endCell: MazeCell) => {
      this.endCell = endCell;
    })
  }

  public grid: MazeCell[][] = [];
  // Sends updates to the maze component
  public gridSubject = new Subject<MazeCell[][]>();

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
    this.signalrService.sendMazeUpdate(this.grid);
  }

  public getStartCell(): MazeCell | undefined{
    if(this.startCell) return this.startCell;
    return undefined;
  }

  public setStartCell(cell: MazeCell) {
    if (this.startCell) {
      this.startCell.isStart = false;
      this.updateCell(this.startCell);
    }
    cell.isStart = true;
    this.startCell = cell;
    this.signalrService.setStartCell(this.startCell);
    this.updateCell(cell);

    this.clearGrid();
  }

  public getEndCell(): MazeCell | undefined {
    if(this.endCell) return this.endCell;
    return undefined;
  }

  public setEndCell(cell: MazeCell) {
    if (this.endCell) {
      this.endCell.isEnd = false;
      this.updateCell(this.endCell);
    }
    cell.isEnd = true;
    this.endCell = cell;
    this.signalrService.setEndCell(this.endCell);
    this.updateCell(cell);

    this.clearGrid();
  }

  public async generateMazeRecursiveDivision(skew: number = 0.5) {
    this.clearGrid(true);
    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    // Subscribe to grid updates from RecursiveDivisionService
    this.recursiveDivisionService.gridUpdates$.subscribe((grid) => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
    });

    // Generate default recursive division maze
    await this.recursiveDivisionService.generateMaze(this.grid, this.startCell, this.endCell, skew);

    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public async generateRandom() {
    this.clearGrid(true);
    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    // Subscribe to grid updates from RandomMazeService
    this.randomService.gridUpdates$.subscribe((grid) => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
    });

    // Generate the random maze asynchronously
    await this.randomService.generateMaze(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public async startBfs() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    this.bfsService.pathUpdates$.subscribe(grid => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
      this.signalrService.sendMazeUpdate(this.grid);
    });

    await this.bfsService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public async startDfs() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    this.dfsService.pathUpdates$.subscribe(grid => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
      this.signalrService.sendMazeUpdate(this.grid);
    });

    await this.dfsService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public async startAStar() {
    if (!this.startCell || !this.endCell) {
      alert('Please set start and end cells!');
      return;
    }

    this.clearGrid();

    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    this.aStarService.pathUpdates$.subscribe(grid => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
      this.signalrService.sendMazeUpdate(this.grid);
    });

    await this.aStarService.findPath(this.grid, this.startCell, this.endCell);

    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
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
          this.grid[cell.y][cell.x] = cell;
          this.gridSubject.next(this.grid);
        }
      }
    }
    this.signalrService.sendMazeUpdate(this.grid)  
  }

  public applyMazeUpdate(mazeUpdate: MazeCell[][]) {
    this.grid = mazeUpdate;
    this.gridSubject.next(this.grid); // Notify all components of the new grid state
  }
}
