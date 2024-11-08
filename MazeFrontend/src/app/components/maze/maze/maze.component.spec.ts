import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MazeComponent } from './maze.component';
import { MazeService } from '../services/maze.service';
import { MazeCell } from '../../../models/maze-cell.model';
import { Subject } from 'rxjs';

describe('MazeComponent', () => {
  let component: MazeComponent;
  let fixture: ComponentFixture<MazeComponent>;
  let mockMazeService: jasmine.SpyObj<MazeService>;
  let gridSubject: Subject<MazeCell[][]>;

  beforeEach(async () => {
    gridSubject = new Subject<MazeCell[][]>();

    mockMazeService = jasmine.createSpyObj('MazeService', ['configureCell'], {
      gridSubject: gridSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [MazeComponent],
      providers: [
        { provide: MazeService, useValue: mockMazeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    gridSubject.complete(); // Complete the subject to prevent memory leaks
  });

  it('should subscribe to gridSubject and update grid on initialization', () => {
    const mockGrid: MazeCell[][] = [[{ x: 0, y: 0, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 }]];
    gridSubject.next(mockGrid);
    expect(component.grid).toEqual(mockGrid);
  });

  it('should unsubscribe from gridSubject on destroy', () => {
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should call configureCell with "start" when shift key is pressed', () => {
    const mockCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEvent = new MouseEvent('click', { shiftKey: true });

    component.onCellClick(mockCell, mockEvent);

    expect(mockMazeService.configureCell).toHaveBeenCalledWith(mockCell, 'start');
  });

  it('should call configureCell with "end" when alt key is pressed', () => {
    const mockCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEvent = new MouseEvent('click', { altKey: true });

    component.onCellClick(mockCell, mockEvent);

    expect(mockMazeService.configureCell).toHaveBeenCalledWith(mockCell, 'end');
  });

  it('should call configureCell with "wall" when no modifier key is pressed', () => {
    const mockCell: MazeCell = { x: 1, y: 1, isWall: false, isStart: false, isEnd: false, isPath: false, isVisited: false, gCost: 0, hCost: 0, fCost: 0 };
    const mockEvent = new MouseEvent('click');

    component.onCellClick(mockCell, mockEvent);

    expect(mockMazeService.configureCell).toHaveBeenCalledWith(mockCell, 'wall');
  });
});
