import { TestBed } from '@angular/core/testing';

import { RecursiveDivisionService } from './recursive-division.service';
import { MazeCell } from '../../../models/maze-cell.model';
import { SignalrService } from '../../signalr/signalr.service';

describe('RecursiveDivisionService', () => {
  let service: RecursiveDivisionService;
  let mockSignalrService: jasmine.SpyObj<SignalrService>;

  beforeEach(() => {
    mockSignalrService = jasmine.createSpyObj('SignalrService', ['sendMazeUpdatev2']);

    TestBed.configureTestingModule({
      providers: [
        RecursiveDivisionService,
        { provide: SignalrService, useValue: mockSignalrService }
      ]
    });

    service = TestBed.inject(RecursiveDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit grid updates and call SignalrService during maze generation', async () => {
    // Create a simple 4x4 grid
    const grid: MazeCell[][] = Array.from({ length: 4 }, (_, y) =>
      Array.from({ length: 4 }, (_, x) => ({
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
      }))
    );

    let emittedGrids: MazeCell[][][] = [];
    service.gridUpdates$.subscribe((updatedGrid) => {
      emittedGrids.push(updatedGrid);
    });

    await service.generateMaze(grid, undefined, undefined, 0.5);

    // Check that grid updates were emitted
    expect(emittedGrids.length).toBeGreaterThan(0);
    // Check that SignalrService was called
    expect(mockSignalrService.sendMazeUpdatev2).toHaveBeenCalled();
  });

  it('should clear start and end cells if specified and ensure they are not walls', async () => {
    // Create a 4x4 grid and define start and end cells
    const grid: MazeCell[][] = Array.from({ length: 4 }, (_, y) =>
      Array.from({ length: 4 }, (_, x) => ({
        x,
        y,
        isWall: true,
        isStart: false,
        isEnd: false,
        isPath: false,
        isVisited: false,
        gCost: 0,
        hCost: 0,
        fCost: 0,
      }))
    );
    const startCell: MazeCell = { x: 0, y: 0, isWall: true, isStart: true, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const endCell: MazeCell = { x: 3, y: 3, isWall: true, isStart: false, isEnd: true, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };

    grid[0][0] = startCell;
    grid[3][3] = endCell;

    await service.generateMaze(grid, startCell, endCell, 0.5);

    // Check that start and end cells are not walls
    expect(grid[0][0].isWall).toBeFalse();
    expect(grid[3][3].isWall).toBeFalse();
  });

  it('should correctly divide the grid and set walls', async () => {
    // Create a simple 4x4 grid
    const grid: MazeCell[][] = Array.from({ length: 4 }, (_, y) =>
      Array.from({ length: 4 }, (_, x) => ({
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
      }))
    );

    await service.generateMaze(grid, undefined, undefined, 0.5);

    // Check that some cells have been set as walls
    const wallCount = grid.flat().filter(cell => cell.isWall).length;
    expect(wallCount).toBeGreaterThan(0);
  });

  it('should handle an edge case of a very small grid without errors', async () => {
    // Create a 1x1 grid
    const grid: MazeCell[][] = [[{
      x: 0,
      y: 0,
      isWall: false,
      isStart: false,
      isEnd: false,
      isPath: false,
      isVisited: false,
      gCost: 0,
      hCost: 0,
      fCost: 0,
    }]];

    await service.generateMaze(grid, undefined, undefined, 0.5);

    // Check that no walls were set and no errors occurred
    expect(grid[0][0].isWall).toBeFalse();
  });

  it('should delay correctly during wall creation', async () => {
    // Create a simple 4x4 grid
    const grid: MazeCell[][] = Array.from({ length: 4 }, (_, y) =>
      Array.from({ length: 4 }, (_, x) => ({
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
      }))
    );

    const start = Date.now();
    await service.generateMaze(grid, undefined, undefined, 0.5);
    const end = Date.now();

    // Check that the delay was approximately correct (allowing some margin for async processing)
    expect(end - start).toBeGreaterThanOrEqual(60);
  });
});
