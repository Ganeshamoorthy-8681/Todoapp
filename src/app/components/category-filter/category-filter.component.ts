import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonToggleModule, MatIconModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss'
})
export class CategoryFilterComponent {

  @Output() selectionChange = new EventEmitter();

  onSelectionChange(event: MatButtonToggleChange): void {
    this.selectionChange.emit(event.value);
  }
}
