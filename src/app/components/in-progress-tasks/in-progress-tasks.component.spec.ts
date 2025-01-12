import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressTasksComponent } from './in-progress-tasks.component';

describe('InProgressTasksComponent', () => {
  let component: InProgressTasksComponent;
  let fixture: ComponentFixture<InProgressTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InProgressTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
