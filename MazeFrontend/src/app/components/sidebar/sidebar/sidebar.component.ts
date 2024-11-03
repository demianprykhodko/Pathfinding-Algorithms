import { Component } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { MazeService } from '../../maze/services/maze.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  public sidebarOpened = true;

  public isGenerating = false;
  private isGeneratingSubscription!: Subscription;

  // Algorithm selection
  algorithms = [
    { name: 'Breadth-First Search', value: 'bfs' },
    { name: 'Depth-First Search', value: 'dfs' },
    { name: 'A*', value: 'astar' }
  ];
  selectedAlgorithm: string = 'bfs';

  // Maze generation methods
  mazeGenerations = [
    { name: 'Playground', value: 'Playground' },
    { name: 'Random', value: 'random' },
    { name: 'Recursive Division', value: 'recursiveDivision' },
    { name: 'RD (Horizontal skew)', value: 'recursiveDivisionHorizontalSkew' },
    { name: 'RD (Vertical skew)', value: 'recursiveDivisionVerticalSkew' }
  ];
  selectedMazeGeneration: string = 'Playground';

  constructor(
    private sidebarService: SidebarService,
    private mazeService: MazeService
  ) { }

  ngOnInit(): void {
    this.isGeneratingSubscription = this.mazeService.isGenerating$.subscribe(
      (generating) => this.isGenerating = generating
    );

    this.sidebarService.setSidenav(this);
  }

  closeSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
    this.sidebarService.closeSidebar();
  }

  generateMaze(): void {
    switch (this.selectedMazeGeneration) {
      case 'Playground':
        this.mazeService.clearGrid();
        break;
      case 'recursiveDivision':
        this.mazeService.generateMazeRecursiveDivision();
        break;
      case 'random':
        this.mazeService.generateRandom();
        break;
      case 'recursiveDivisionHorizontalSkew':
        this.mazeService.generateMazeRecursiveDivision(0.7);
        break;
      case 'recursiveDivisionVerticalSkew':
        this.mazeService.generateMazeRecursiveDivision(0.3);
        break;
    }
  }

  generatePath(): void {
    switch (this.selectedAlgorithm) {
      case 'bfs':
        this.mazeService.startBfs();
        break;
      case 'dfs':
        this.mazeService.startDfs();
        break;
      case 'astar':
        this.mazeService.startAStar();
        break;
    }
  }
}
