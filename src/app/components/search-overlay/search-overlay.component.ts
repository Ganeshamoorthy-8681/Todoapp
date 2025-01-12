import { Component } from '@angular/core';
import { SearchService } from '../../service/search-service/search.service';
import { debounceTime, Subscription } from 'rxjs';
import { TaskModel } from '../../model/response/task.model';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskCategory } from '../../enum/task-category.model';
import { TASK_CATEGORY_MAPPER } from '../../model/mapper/task-category-mapper';
import { TASK_PRIORITY_MAPPER } from '../../model/mapper/task-priority-mapper';
import { TASK_STATUS_MAPPER } from '../../model/mapper/task-status-mapper';
import { TaskPriority } from '../../enum/task-priority.model';
import { TaskStatus } from '../../enum/task-status.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavigationService } from '../../service/navigation-service/navigation-service.service';
import { AlertService } from '../../service/alert-service/alert.service';


@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [NgTemplateOutlet, DatePipe, MatTooltipModule, NgClass, MatProgressBarModule],
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss'
})

export class SearchOverlayComponent {
  isLoading = false;
  taskList: TaskModel[];

  //Subscription
  private searchInputChangeSubscription: Subscription;

  constructor (
    private searchService: SearchService,
    private navigationService: NavigationService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.listenSearchInput();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.searchInputChangeSubscription?.unsubscribe();
  }

  listenSearchInput() {
    this.searchInputChangeSubscription?.unsubscribe();
    this.searchInputChangeSubscription = this.searchService.searchInputFormControl.valueChanges.pipe(debounceTime(600)).subscribe((data) => {
      if (data) {
        this.getTaskBasedOnQuery(data);
      }
    });
  }

  getTaskBasedOnQuery(data: string) {
    this.isLoading = true;
    this.searchService.getTaskBasedOnQuery(data).subscribe({
      next: (response) => this.handleSearchResponse(response),
      error: () => this.alertService.openToaster("Unable to fetch the data")
    });
  }

  handleSearchResponse(response: TaskModel[]) {
    this.isLoading = false;
    this.taskList = response;
  }

  handleSearchItemClickEvent(id: number) {
    this.searchService.$closeOverlaySubject.next(true);
    this.navigationService.navigate(["app", "tasks", id.toString()]);
  }


  //Helper functions
  getCategoryDisplayName(category: TaskCategory): string {
    return TASK_CATEGORY_MAPPER[category]?.text;
  }

  getPriorityDisplayName(priority: TaskPriority): string {
    return TASK_PRIORITY_MAPPER[priority].displayName;
  }

  isTaskOverdue(dueDate: number): boolean {
    return dueDate < Date.now();
  }

  getStatusDisplayName(status: TaskStatus): string {
    return TASK_STATUS_MAPPER[status].displayName;
  }
}
