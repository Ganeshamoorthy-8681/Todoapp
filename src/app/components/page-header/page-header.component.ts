import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderModel } from './model/page-header.model';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {

  @Input() data: PageHeaderModel;

  constructor (private navigationService: NavigationService) { }

  handleCreateTaskEvent(): void {
    this.navigationService.navigate(['app', "tasks", "create"]);
  }
}
