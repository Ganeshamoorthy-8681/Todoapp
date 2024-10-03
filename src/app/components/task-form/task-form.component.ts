import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskModel } from '../../model/response/task.model';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormModel, TaskFormOutputEventModel } from './task-form.model';
import { FormFooterActions } from '../../enum/form-footer-actions.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, CommonModule, MatDatepickerModule, MatSelectModule, MatChipsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {


  @Output() event: EventEmitter<TaskFormOutputEventModel> = new EventEmitter();

  taskForm: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TaskModel
  ) { }

  ngOnInit(): void {
    this.createTaskForm();
    // this.taskForm = new FormGroup<TaskFormModel>({
    //   name: new FormControl<string>(, Validators.required),
    //   description: new FormControl(),
    //   status: new FormControl(this.data.taskStatus, Validators.required),
    //   dueDate: new FormControl(this.formatDateToMMDDYYYY(this.data?.dueDate), [Validators.required])
    // });

    this.taskForm.valueChanges.subscribe(console.log);
  }


  createTaskForm(): void {
    this.taskForm = this.formBuilder.group({
      name: [this.data?.taskName, Validators.required],
      description: [''],
      status: [this.data?.taskStatus, Validators.required],
      dueDate: [this.formatDateToMMDDYYYY(this.data?.dueDate), Validators.required]
    });
  }

  formatDateToMMDDYYYY(dateNum: number): Date {
    const date = new Date(dateNum);
    return date;
  }

  handleSubmitEvent(): void {
    const event: TaskFormOutputEventModel = {
      eventType: FormFooterActions.SUBMIT,
      data: this.taskForm
    };
    this.event.emit(event);
  }

  handleCancelEvent(): void {
    const event: TaskFormOutputEventModel = {
      eventType: FormFooterActions.CANCEL,
      data: null
    };
    this.event.emit(event);
  }


}
