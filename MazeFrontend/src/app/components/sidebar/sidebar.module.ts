import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarComponent],
  imports: [CommonModule, MatIconModule, FormsModule],
  exports: [SidebarComponent]
})
export class SidebarModule { }
