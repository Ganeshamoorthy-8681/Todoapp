import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormV2Component } from './task-form-v2.component';

describe('TaskFormV2Component', () => {
  let component: TaskFormV2Component;
  let fixture: ComponentFixture<TaskFormV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFormV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
