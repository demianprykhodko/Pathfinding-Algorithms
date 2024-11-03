import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MazeComponent } from './maze/maze.component';

@NgModule({
  declarations: [MazeComponent],
  imports: [CommonModule],
  exports: [MazeComponent]
})
export class MazeModule { }
