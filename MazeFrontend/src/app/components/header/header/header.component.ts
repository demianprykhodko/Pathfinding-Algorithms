import { Component, input, OnInit } from '@angular/core';
import { SidebarService } from '../../sidebar/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent implements OnInit {
  public sidebarOpened: boolean = true;
  public showModal: boolean = false;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.setHeader(this);
  }

  openSidebar() {
    this.sidebarOpened = true;
    this.sidebarService.openSidebar();
  }
}
