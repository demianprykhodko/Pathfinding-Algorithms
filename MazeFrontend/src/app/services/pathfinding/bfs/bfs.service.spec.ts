import { TestBed } from '@angular/core/testing';

import { BreadthFirstSearchService } from './bfs.service';
import { MazeCell } from '../../../models/maze-cell.model';
import { take } from 'rxjs';

describe('BfsService', () => {
  let service: BreadthFirstSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreadthFirstSearchService]
    });
    service = TestBed.inject(BreadthFirstSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find a simple path and emit updates', async () => {
    // Create a simple 2x2 grid with no walls
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }]
    ];
    
    const startCell = grid[0][0];
    const endCell = grid[1][1];

    let emittedUpdates: MazeCell[] = [];

    // Subscribe to pathUpdates$ to track updates
    service.pathUpdates$.pipe(take(1)).subscribe((updates) => {
      emittedUpdates = updates;
    });

    const result = await service.findPath(grid, startCell, endCell);

    // Check if the path was found
    expect(result).not.toBeNull();
    expect(emittedUpdates.length).toBeGreaterThan(0); // Check if updates were emitted
    expect(grid[1][1].isPath).toBeTrue(); // Ensure the end cell is part of the path
  });

  it('should return null if no path is found', async () => {
    // Create a 2x2 grid with walls blocking the path
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[1][1];

    const result = await service.findPath(grid, startCell, endCell);

    // Check if no path was found
    expect(result).toBeNull();
  });

  it('should emit updates for visited cells', async () => {
    // Create a simple 3x3 grid
    const grid: MazeCell[][] = [
      [{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 2, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 1, isWall: true, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 2, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }],
      [{ x: 0, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 1, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 },
       { x: 2, y: 2, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }]
    ];

    const startCell = grid[0][0];
    const endCell = grid[2][2];

    let visitedCellsCount = 0;

    // Subscribe to pathUpdates$ to count visited cells
    service.pathUpdates$.subscribe((updates) => {
      visitedCellsCount += updates.length;
    });

    await service.findPath(grid, startCell, endCell);

    // Check if visited cells were emitted
    expect(visitedCellsCount).toBeGreaterThan(0);
  });
});
