import { TestBed } from '@angular/core/testing';

import { MazeService } from './maze.service';
import { RecursiveDivisionService } from '../../../services/maze-generation/recursive-division/recursive-division.service';
import { RandomService } from '../../../services/maze-generation/random/random.service';
import { BreadthFirstSearchService } from '../../../services/pathfinding/bfs/bfs.service';
import { DepthFirstSearchService } from '../../../services/pathfinding/dfs/dfs.service';
import { AStarService } from '../../../services/pathfinding/astar/astar.service';
import { SignalrService } from '../../../services/signalr/signalr.service';
import { of, Subject } from 'rxjs';
import { MazeCell } from '../../../models/maze-cell.model';

describe('MazeService', () => {
  let service: MazeService;
  let mockRecursiveDivisionService: jasmine.SpyObj<RecursiveDivisionService>;
  let mockRandomService: jasmine.SpyObj<RandomService>;
  let mockBfsService: jasmine.SpyObj<BreadthFirstSearchService>;
  let mockDfsService: jasmine.SpyObj<DepthFirstSearchService>;
  let mockAStarService: jasmine.SpyObj<AStarService>;
  let mockSignalrService: jasmine.SpyObj<SignalrService>;

  beforeEach(() => {
    mockRecursiveDivisionService = jasmine.createSpyObj('RecursiveDivisionService', ['generateMaze', 'gridUpdates$']);
    mockRandomService = jasmine.createSpyObj('RandomService', ['generateMaze', 'gridUpdates$']);
    mockBfsService = jasmine.createSpyObj('BreadthFirstSearchService', ['findPath', 'pathUpdates$']);
    mockDfsService = jasmine.createSpyObj('DepthFirstSearchService', ['findPath', 'pathUpdates$']);
    mockAStarService = jasmine.createSpyObj('AStarService', ['findPath', 'pathUpdates$']);
    mockSignalrService = jasmine.createSpyObj('SignalrService', [
      'sendMazeUpdatev2',
      'sendIsGeneratingUpdate'
    ]);

    // Mock Subjects as Observables
    mockSignalrService.mazeUpdateV2Subject = new Subject<MazeCell[]>();
    mockSignalrService.isGeneratingUpdateSubject = new Subject<boolean>()

    mockRecursiveDivisionService.gridUpdates$ = of([]) as any;
    mockRandomService.gridUpdates$ = of([]) as any;
    mockBfsService.pathUpdates$ = of([]) as any;
    mockDfsService.pathUpdates$ = of([]) as any;
    mockAStarService.pathUpdates$ = of([]) as any;

    TestBed.configureTestingModule({
      providers: [
        MazeService,
        { provide: RecursiveDivisionService, useValue: mockRecursiveDivisionService },
        { provide: RandomService, useValue: mockRandomService },
        { provide: BreadthFirstSearchService, useValue: mockBfsService },
        { provide: DepthFirstSearchService, useValue: mockDfsService },
        { provide: AStarService, useValue: mockAStarService },
        { provide: SignalrService, useValue: mockSignalrService }
      ]
    });

    service = TestBed.inject(MazeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should configure a start cell and reset the grid', () => {
    const mockCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockGrid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: true, isStart: false, isEnd: false, isPath: true, isVisited: true, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    service.grid = mockGrid;
    spyOn(service, 'resetGrid');

    service.configureCell(mockCell, 'start');

    expect(mockCell.isStart).toBeTrue();
    expect(service.resetGrid).toHaveBeenCalled();
  });

  it('should configure an end cell and reset the grid', () => {
    const mockCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockGrid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: true, isStart: false, isEnd: false, isPath: true, isVisited: true, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    service.grid = mockGrid;
    spyOn(service, 'resetGrid');

    service.configureCell(mockCell, 'end');

    expect(mockCell.isEnd).toBeTrue();
    expect(service.resetGrid).toHaveBeenCalled();
  });

  it('should toggle wall status when configuring a cell as wall', () => {
    const mockCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockGrid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: true, isStart: false, isEnd: false, isPath: true, isVisited: true, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    service.grid = mockGrid;
    service.configureCell(mockCell, 'wall');

    expect(mockCell.isWall).toBeTrue();

    service.configureCell(mockCell, 'wall');

    expect(mockCell.isWall).toBeFalse();
  });

  it('should reset the grid and update all modified cells', () => {
    const mockGrid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: true, isStart: false, isEnd: false, isPath: true, isVisited: true, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    service.grid = mockGrid;
    service.resetGrid(true);

    expect(mockGrid[0][0].isWall).toBeFalse();
    expect(mockGrid[0][0].isPath).toBeFalse();
    expect(mockGrid[0][0].isVisited).toBeFalse();
    expect(mockSignalrService.sendMazeUpdatev2).toHaveBeenCalled();
  });

  it('should prepare and generate a random maze', async () => {
    mockRandomService.generateMaze.and.returnValue(Promise.resolve());

    await service.prepareMazeGeneration('random');

    expect(mockRandomService.generateMaze).toHaveBeenCalled();
    expect(mockSignalrService.sendIsGeneratingUpdate).toHaveBeenCalledTimes(2); // Called for start and end
  });

  it('should prepare and generate a recursive division maze', async () => {
    mockRecursiveDivisionService.generateMaze.and.returnValue(Promise.resolve());

    await service.prepareMazeGeneration('recursiveDivision');

    expect(mockRecursiveDivisionService.generateMaze).toHaveBeenCalled();
    expect(mockSignalrService.sendIsGeneratingUpdate).toHaveBeenCalledTimes(2); // Called for start and end
  });

  it('should prepare and execute BFS pathfinding', async () => {
    mockBfsService.findPath.and.returnValue(Promise.resolve());

    // Define mock start and end cells
    const mockStartCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: true, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEndCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: true, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };

    // Set start and end cells
    service['startCell'] = mockStartCell;
    service['endCell'] = mockEndCell;

    await service.preparePathFinding('bfs');

    expect(mockBfsService.findPath).toHaveBeenCalled();
    expect(mockSignalrService.sendIsGeneratingUpdate).toHaveBeenCalledTimes(2); // Called at the start and end
  });

  it('should prepare and execute DFS pathfinding', async () => {
    mockDfsService.findPath.and.returnValue(Promise.resolve());

    // Define mock start and end cells
    const mockStartCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: true, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEndCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: true, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };

    // Set start and end cells
    service['startCell'] = mockStartCell;
    service['endCell'] = mockEndCell;

    await service.preparePathFinding('dfs');

    expect(mockDfsService.findPath).toHaveBeenCalled();
    expect(mockSignalrService.sendIsGeneratingUpdate).toHaveBeenCalledTimes(2); // Called for start and end
  });

  it('should prepare and execute A* pathfinding', async () => {
    mockAStarService.findPath.and.returnValue(Promise.resolve());

    // Define mock start and end cells
    const mockStartCell: MazeCell = { x: 0, y: 0, isWall: false, isStart: true, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEndCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: true, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };

    // Set start and end cells
    service['startCell'] = mockStartCell;
    service['endCell'] = mockEndCell;

    await service.preparePathFinding('aStar');

    expect(mockAStarService.findPath).toHaveBeenCalled();
    expect(mockSignalrService.sendIsGeneratingUpdate).toHaveBeenCalledTimes(2); // Called for start and end
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(service['destroy$'], 'next');
    spyOn(service['destroy$'], 'complete');

    service.ngOnDestroy();

    expect(service['destroy$'].next).toHaveBeenCalled();
    expect(service['destroy$'].complete).toHaveBeenCalled();
  });
});
