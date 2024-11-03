import { Injectable } from '@angular/core';
import { SidebarComponent }from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebar!: SidebarComponent;
  private header!: HeaderComponent;

  public setSidenav(sidenav: SidebarComponent) {
    this.sidebar = sidenav;
  }

  public setHeader(header: HeaderComponent) {
    this.header = header;
  }

  public openSidebar() {
    this.sidebar.sidebarOpened = true;
  }

  public closeSidebar() {
    this.header.sidebarOpened = false;
  }
}