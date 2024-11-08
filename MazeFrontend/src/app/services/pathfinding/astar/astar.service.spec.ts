import { TestBed } from '@angular/core/testing';

import { AStarService } from './astar.service';
import { MazeCell } from '../../../models/maze-cell.model';
import { take } from 'rxjs';

describe('BfsService', () => {
  let service: AStarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AStarService]
    });
    service = TestBed.inject(AStarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find the shortest path and emit updates, with correct cost properties', async () => {
    // Create a simple 3x3 grid with no walls
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[2][2];

    let emittedUpdates: MazeCell[] = [];

    // Subscribe to pathUpdates$ to track updates
    service.pathUpdates$.pipe(take(1)).subscribe((updates) => {
      emittedUpdates = updates;
    });

    const result = await service.findPath(grid, startCell, endCell);

    // Check if the path was found
    expect(result).not.toBeNull();
    expect(emittedUpdates.length).toBeGreaterThan(0); // Ensure some updates were emitted

    // Check cost properties of start cell
    expect(startCell.gCost).toBe(0);
    expect(startCell.hCost).toBe(4); // Manhattan distance from (0,0) to (2,2)
    expect(startCell.fCost).toBe(4);

    // Check cost properties of the end cell
    expect(endCell.isPath).toBeTrue();
    expect(endCell.gCost).toBeLessThan(Infinity); // Ensure gCost is updated
  });

  it('should correctly calculate heuristic (H-cost)', () => {
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[1][1];

    const hCost = service['calculateHeuristic'](startCell, endCell);
    expect(hCost).toBe(2); // Manhattan distance from (0,0) to (1,1)
  });

  it('should return null if no path is found due to walls', async () => {
    // Create a grid with walls blocking the path
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 1, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 2, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 2, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[2][2];

    const result = await service.findPath(grid, startCell, endCell);

    // Check if no path was found
    expect(result).toBeNull();
  });

  it('should emit updates for each visited cell with correct cost properties', async () => {
    // Create a simple 2x2 grid
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: Infinity, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[1][1];

    let visitedCellsCount = 0;

    // Subscribe to pathUpdates$ to count the number of times cells are visited
    service.pathUpdates$.subscribe((updates) => {
      visitedCellsCount += updates.length;
    });

    await service.findPath(grid, startCell, endCell);

    // Check if cells were visited and cost properties were updated
    expect(visitedCellsCount).toBeGreaterThan(0);
    expect(startCell.gCost).toBe(0);
    expect(endCell.isVisited).toBeTrue();
  });
});
