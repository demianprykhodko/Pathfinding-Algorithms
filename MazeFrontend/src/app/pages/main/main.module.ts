import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main/main.component';
import { MainRoutingModule } from './main-routing.module';
import { MazeModule } from '../../components/maze/maze.module';
import { HeaderModule } from '../../components/header/header.module';
import { SidebarModule } from '../../components/sidebar/sidebar.module';

@NgModule({
  imports: [CommonModule, MainRoutingModule, MazeModule, HeaderModule, SidebarModule],
  declarations: [MainComponent],
})
export class MainModule { }
