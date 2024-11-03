import { Component, input, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent implements OnInit {
  // users: any = input('users');
  public sidebarOpened = true;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.setHeader(this);
  }

  openSidebar() {
    this.sidebarOpened = true;
    this.sidebarService.openSidebar();
  }
}
