import { TestBed } from '@angular/core/testing';

import { RandomService } from './random.service';
import { SignalrService } from '../../signalr/signalr.service';
import { MazeCell } from '../../../models/maze-cell.model';

describe('RandomService', () => {
  let service: RandomService;
  let mockSignalrService: jasmine.SpyObj<SignalrService>;

  beforeEach(() => {
    mockSignalrService = jasmine.createSpyObj('SignalrService', ['sendMazeUpdatev2']);

    TestBed.configureTestingModule({
      providers: [
        RandomService,
        { provide: SignalrService, useValue: mockSignalrService }
      ]
    });

    service = TestBed.inject(RandomService);
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

    await service.generateMaze(grid, undefined, undefined);

    // Check that grid updates were emitted
    expect(emittedGrids.length).toBeGreaterThan(0);
    // Check that SignalrService was called
    expect(mockSignalrService.sendMazeUpdatev2).toHaveBeenCalled();
  });

  it('should randomly set walls in the grid', async () => {
    // Create a 4x4 grid
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

    await service.generateMaze(grid, undefined, undefined);

    // Check that some cells were set as walls
    const wallCount = grid.flat().filter(cell => cell.isWall).length;
    expect(wallCount).toBeGreaterThan(0);
  });

  it('should ensure start and end cells are not walls', async () => {
    // Create a 4x4 grid and define start and end cells
    const grid: MazeCell[][] = Array.from({ length: 4 }, (_, y) =>
      Array.from({ length: 4 }, (_, x) => ({
        x,
        y,
        isWall: true, // Initially set all cells as walls
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

    await service.generateMaze(grid, startCell, endCell);

    // Check that start and end cells are not walls
    expect(grid[0][0].isWall).toBeFalse();
    expect(grid[3][3].isWall).toBeFalse();
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
    await service.generateMaze(grid, undefined, undefined);
    const end = Date.now();

    // Check that the delay was approximately correct (allowing some margin for async processing)
    expect(end - start).toBeGreaterThanOrEqual(40); // Adjust based on the total number of cells and delay
  });
});
