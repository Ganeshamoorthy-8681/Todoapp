import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListV2Component } from './task-list-v2.component';

describe('TaskListV2Component', () => {
  let component: TaskListV2Component;
  let fixture: ComponentFixture<TaskListV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
