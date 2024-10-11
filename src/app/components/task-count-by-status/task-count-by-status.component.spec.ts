import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCountByStatusComponent } from './task-count-by-status.component';

describe('TaskCountByStatusComponent', () => {
  let component: TaskCountByStatusComponent;
  let fixture: ComponentFixture<TaskCountByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCountByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCountByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
