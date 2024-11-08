import { Injectable, OnDestroy } from "@angular/core";
import { MazeCell } from "../../../models/maze-cell.model";
import { BehaviorSubject, pipe, Subject, Subscription, takeUntil } from "rxjs";
import { RecursiveDivisionService } from "../../../services/maze-generation/recursive-division/recursive-division.service";
import { RandomService } from "../../../services/maze-generation/random/random.service";
import { BreadthFirstSearchService } from "../../../services/pathfinding/bfs/bfs.service";
import { DepthFirstSearchService } from "../../../services/pathfinding/dfs/dfs.service";
import { AStarService } from "../../../services/pathfinding/astar/astar.service";
import { SignalrService } from "../../../services/signalr/signalr.service";

@Injectable({
  providedIn: "root"
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
    this.signalrService.mazeUpdateV2Subject
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedCells: MazeCell[]) => {
        this.processUpdatedCells(updatedCells);
    })

    this.signalrService.isGeneratingUpdateSubject.subscribe((isGeneratingData: boolean) => {
      this.isGeneratingSubject.next(isGeneratingData)
    })
  }

  public grid: MazeCell[][] = [];
  public gridSubject = new Subject<MazeCell[][]>();

  private startCell?: MazeCell;
  private endCell?: MazeCell;

  private isGeneratingSubject = new BehaviorSubject<boolean>(false);
  public isGenerating$ = this.isGeneratingSubject.asObservable();

  private readonly destroy$ = new Subject<void>()

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public configureCell(cell: MazeCell, cellType: "start" | "end" | "wall") {
    switch (cellType) {
      case "start":
        if (this.startCell) {
          this.startCell.isStart = false;
          this.updateGridCell(this.startCell);
        }
        cell.isStart = true;
        this.startCell = cell;
        break;
        
      case "end":
        if (this.endCell) {
          this.endCell.isEnd = false;
          this.updateGridCell(this.endCell);
        }
        cell.isEnd = true;
        this.endCell = cell;
        break;
        
      case "wall":
        cell.isWall = !cell.isWall;
        break;
    }
  
    this.updateGridCell(cell);
  
    // Clear the grid if setting start or end cells
    if (cellType === "start" || cellType === "end") {
      this.resetGrid();
    }
  }

  private updateGridCell(cell: MazeCell) {
    this.grid[cell.y][cell.x] = cell;
    this.gridSubject.next(this.grid);
    this.signalrService.sendMazeUpdatev2([cell]);
  }

  public async prepareMazeGeneration(mazeType: "recursiveDivision" | "random" | "recursiveDivisionHorizontalSkew" | "recursiveDivisionVerticalSkew", skew: number = 0.5) {
    this.resetGrid(true);
    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);
  
    // Select the appropriate service based on the maze type
    let service;
    switch (mazeType) {
      case "recursiveDivision":
      case "recursiveDivisionHorizontalSkew":
      case "recursiveDivisionVerticalSkew":
        service = this.recursiveDivisionService;
        break;
      case "random":
        service = this.randomService;
        break;
    }
  
    // Subscribe to grid updates from the selected service
    const subscription = service.gridUpdates$.subscribe((grid: MazeCell[][]) => {
      this.grid = grid;
      this.gridSubject.next(this.grid);
    });
  
    // Generate the maze asynchronously
    if (service === this.recursiveDivisionService) {
      await service.generateMaze(this.grid, this.startCell, this.endCell, skew);
    } else if (service === this.randomService) {
      await service.generateMaze(this.grid, this.startCell, this.endCell);
    }
  
    // Clean up the subscription and reset the generating status
    subscription.unsubscribe();
    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public async preparePathFinding(algorithm: "bfs" | "dfs" | "aStar") {
    if (!this.startCell || !this.endCell) {
      alert("Please set start and end cells!");
      return;
    }

    this.resetGrid();
    this.isGeneratingSubject.next(true);
    this.signalrService.sendIsGeneratingUpdate(true);

    var service;
    switch (algorithm) {
      case "bfs": service = this.bfsService; break;
      case "dfs": service = this.dfsService; break;
      case "aStar": service = this.aStarService; break;
    }

    service.pathUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedCells: MazeCell[]) => {
        updatedCells.forEach(cell => this.grid[cell.y][cell.x] = cell);
        this.gridSubject.next(this.grid);
        this.signalrService.sendMazeUpdatev2(updatedCells);
    })

    await service.findPath(this.grid, this.startCell, this.endCell);
    this.isGeneratingSubject.next(false);
    this.signalrService.sendIsGeneratingUpdate(false);
  }

  public resetGrid(walls: boolean = false) {
    const updatedCells = this.grid.flat().filter(cell => {
      if (cell.isPath || cell.isWall || cell.isVisited) {
        if (walls) cell.isWall = false;
        cell.isPath = false;
        cell.isVisited = false;
        return true;
      }
      return false;
    });

    this.gridSubject.next(this.grid);
    this.signalrService.sendMazeUpdatev2(updatedCells)  
  }

  private processUpdatedCells(updatedCells: MazeCell[]) {
    updatedCells.forEach(cell => {
      this.ensureRowExists(cell.y);
      this.updateSpecialCells(cell);
      this.grid[cell.y][cell.x] = cell;
    });
  
    this.gridSubject.next(this.grid);
  }

  private ensureRowExists(y: number) {
    if (!this.grid[y]) {
      this.grid[y] = []; // Initialize the row if it doesn’t exist
    }
  }
  
  private updateSpecialCells(cell: MazeCell) {
    if (cell.isStart) {
      this.startCell = cell;
    }
    if (cell.isEnd) {
      this.endCell = cell;
    }
  }
}
