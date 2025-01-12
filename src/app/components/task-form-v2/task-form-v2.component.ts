import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TaskStatus } from '../../enum/task-status.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Location, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskCategory } from '../../enum/task-category.model';
import { TaskPriority } from '../../enum/task-priority.model';
import { TASK_CATEGORY_MAPPER } from '../../model/mapper/task-category-mapper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskModel } from '../../model/response/task.model';

@Component({
  selector: 'app-task-form-v2',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatInputModule, NgIf, MatIconModule, MatProgressBarModule, MatFormFieldModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatChipsModule],
  templateUrl: './task-form-v2.component.html',
  styleUrl: './task-form-v2.component.scss'
})
export class TaskFormV2Component {

  @Input() task: TaskModel;
  @Input() isLoading: boolean = false;
  @Output() formSubmit = new EventEmitter();
  taskForm: FormGroup;
  constructor (
    private formBuilder: FormBuilder,
    private location: Location
  ) { }

  ngOnInit(): void {

    this.createTaskForm();
    this.taskForm.valueChanges.subscribe(() => console.log(this.taskForm));
  }
  
  createTaskForm(): void {
    this.taskForm = this.formBuilder.group({
      name: [this.task?.taskName, Validators.required],
      description: [this.task?.taskDescription],
      priority: [this.task?.taskPriority ?? TaskPriority.MEDIUM],
      category: [this.task?.taskCategory ?? TaskCategory.WORK],
      status: [this.task?.taskStatus ?? TaskStatus.UPCOMING, Validators.required],
      dueDate: [this.formatDateToMMDDYYYY(this.task?.dueDate), this.futureDateValidator()]
    });
  }

  handleSubmitEvent(): void {
    this.formSubmit.emit(this.taskForm);
  }

  formatDateToMMDDYYYY(dateNum: number): Date {
    if (dateNum && typeof (dateNum) == "number") {
      const date = new Date(dateNum);
      return date;
    }
    return new Date();
  }

  handleCancelEvent(): void {
    this.handleGoBackEvent();
  }

  handleGoBackEvent(): void {
    this.location.back();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any; } | null => {
      const selectedDate = control.value;
      const today = new Date();

      if (selectedDate && new Date(selectedDate) <= today) {
        return { pastDate: { value: selectedDate } }; // Custom error object
      }
      return null;
    };
  }

  //Helper functions
  getCategoryIcon(): string {
    return TASK_CATEGORY_MAPPER[this.taskForm.get("category")?.value as TaskCategory]?.icon;
  }
  getCategoryLabel(): string {
    return TASK_CATEGORY_MAPPER[this.taskForm.get("category")?.value as TaskCategory]?.text;
  }
  getCategoryClassName(): string {
    return TASK_CATEGORY_MAPPER[this.taskForm.get("category")?.value as TaskCategory]?.class;
  }
}
