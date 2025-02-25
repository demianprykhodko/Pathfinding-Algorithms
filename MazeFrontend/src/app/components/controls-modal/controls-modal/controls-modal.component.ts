import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-controls-modal',
  templateUrl: './controls-modal.component.html',
  styleUrl: './controls-modal.component.less'
})
export class ControlsModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
