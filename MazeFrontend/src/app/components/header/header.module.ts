import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ControlsModalModule } from '../controls-modal/controls-modal.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, ControlsModalModule],
  exports: [HeaderComponent]
})
export class HeaderModule { }
