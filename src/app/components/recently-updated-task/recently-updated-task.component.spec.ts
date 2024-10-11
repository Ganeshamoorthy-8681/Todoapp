import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyUpdatedTaskComponent } from './recently-updated-task.component';

describe('RecentlyUpdatedTaskComponent', () => {
  let component: RecentlyUpdatedTaskComponent;
  let fixture: ComponentFixture<RecentlyUpdatedTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlyUpdatedTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyUpdatedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
