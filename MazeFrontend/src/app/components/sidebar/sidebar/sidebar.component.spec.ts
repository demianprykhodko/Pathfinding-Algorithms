import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from '../services/sidebar.service';
import { MazeService } from '../../maze/services/maze.service';
import { BehaviorSubject, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockSidebarService: jasmine.SpyObj<SidebarService>;
  let mockMazeService: jasmine.SpyObj<MazeService>;
  let isGeneratingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Initialize the BehaviorSubject for testing
    isGeneratingSubject = new BehaviorSubject<boolean>(false);

    mockSidebarService = jasmine.createSpyObj('SidebarService', ['setSidenav', 'closeSidebar']);
    mockMazeService = jasmine.createSpyObj('MazeService', ['resetGrid', 'prepareMazeGeneration', 'preparePathFinding'], {
      isGenerating$: isGeneratingSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [MatIconModule, FormsModule],
      providers: [
        { provide: SidebarService, useValue: mockSidebarService },
        { provide: MazeService, useValue: mockMazeService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and subscribe to isGenerating$', () => {
    // Initial state check
    expect(component.isGenerating).toBe(false);

    // Simulate an update by pushing a new value to the subject
    isGeneratingSubject.next(true);
    fixture.detectChanges();

    // Check if `isGenerating` updated correctly
    expect(component.isGenerating).toBe(true);
    expect(mockSidebarService.setSidenav).toHaveBeenCalledWith(component);
  });

  it('should toggle sidebar and call closeSidebar on SidebarService', () => {
    component.sidebarOpened = true;
    component.closeSidebar();
    expect(component.sidebarOpened).toBe(false);
    expect(mockSidebarService.closeSidebar).toHaveBeenCalled();
  });

  it('should call resetGrid when "playground" is selected', () => {
    component.selectedMazeGeneration = 'playground';
    component.generateMaze();
    expect(mockMazeService.resetGrid).toHaveBeenCalledWith(true);
  });
  
  it('should call prepareMazeGeneration with "recursiveDivision"', () => {
    component.selectedMazeGeneration = 'recursiveDivision';
    component.generateMaze();
    expect(mockMazeService.prepareMazeGeneration).toHaveBeenCalledWith('recursiveDivision');
  });
  
  it('should call prepareMazeGeneration with skew for "recursiveDivisionHorizontalSkew"', () => {
    component.selectedMazeGeneration = 'recursiveDivisionHorizontalSkew';
    component.generateMaze();
    expect(mockMazeService.prepareMazeGeneration).toHaveBeenCalledWith('recursiveDivisionHorizontalSkew', 0.7);
  });

  it('should call preparePathFinding with the selected algorithm', () => {
    component.selectedAlgorithm = 'bfs';
    component.generatePath();
    expect(mockMazeService.preparePathFinding).toHaveBeenCalledWith('bfs');
  });
});
