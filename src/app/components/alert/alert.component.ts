import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertComponentModel } from './model/alert-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  @Input() data: AlertComponentModel;

  @Output() event = new EventEmitter();

  handleCloseButton(event: MouseEvent): void {
    this.event.emit(event);
  }
}
