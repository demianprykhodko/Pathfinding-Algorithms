import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../../sidebar/services/sidebar.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockSidebarService: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    mockSidebarService = jasmine.createSpyObj('SidebarService', ['setHeader', 'openSidebar']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MatToolbarModule, MatIconModule],
      providers: [
        { provide: SidebarService, useValue: mockSidebarService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call setHeader on SidebarService during ngOnInit', () => {
    expect(mockSidebarService.setHeader).toHaveBeenCalledWith(component);
  });

  it('should set sidebarOpened to true and call openSidebar on SidebarService when openSidebar is called', () => {
    component.sidebarOpened = false; // Set initial state to false
    component.openSidebar();

    expect(component.sidebarOpened).toBe(true);
    expect(mockSidebarService.openSidebar).toHaveBeenCalled();
  });
});
