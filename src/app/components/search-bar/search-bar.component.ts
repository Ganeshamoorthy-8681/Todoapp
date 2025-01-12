import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ElementRef, InjectionToken, Injector, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { SearchService } from '../../service/search-service/search.service';
import { Subscription } from 'rxjs';

export const OverLayRef = new InjectionToken("search");

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  private overlayRef: OverlayRef | null = null;
  searchFormControl = new FormControl();
  isFocused: boolean = false;

  //Subscriptions
  searchInputValueChangesSubscription: Subscription;
  closeOverlaySubscription: Subscription;

  @ViewChild("searchElement", { static: true }) searchInput: ElementRef;

  constructor (
    private overlay: Overlay,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.searchService.searchInputFormControl = this.searchFormControl;
    this.listenSearchInputValueChanges();
    this.listenOverlayCloseSubject();
  }

  ngOnDestroy(): void {
    this.closeOverlay();
    this.searchInputValueChangesSubscription?.unsubscribe();
    this.closeOverlaySubscription?.unsubscribe();
    this.searchService.$closeOverlaySubject.next(false);
  }


  listenSearchInputValueChanges() {
    this.searchInputValueChangesSubscription?.unsubscribe();
    this.searchInputValueChangesSubscription = this.searchFormControl.valueChanges.subscribe((data) => {
      if (data?.length == 0) {
        this.closeOverlay();
      }
    });
  }

  listenOverlayCloseSubject() {
    this.closeOverlaySubscription?.unsubscribe();
    this.searchService.$closeOverlaySubject.subscribe((close: boolean) => {
      if (close) {
        this.closeOverlay();
      }
    });
  }

  handleSearchBarClick() {
    this.isFocused = true;
    this.showOverlay();
  }


  showOverlay(): void {
    if (this.overlayRef) {
      return;
    }
    this.createOverlay();
  }

  getPositionStrategy() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.searchInput.nativeElement)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetX: 4, offsetY: 4 },
      ]);
    return positionStrategy;
  }

  createOverlay() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'app-backdrop'
    });

    const overlayPortal = new ComponentPortal(SearchOverlayComponent);
    this.overlayRef.attach(overlayPortal);
    this.listenBackdropClickEvent();
  }

  listenBackdropClickEvent(): void {
    this.overlayRef?.backdropClick().subscribe(() => this.closeOverlay());
  }

  closeOverlay(): void {
    this.isFocused = false;
    this.searchFormControl.reset();
    this.searchInput.nativeElement.blur();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  handleCloseIconClick(event: MouseEvent): void {
    event.stopPropagation();
    this.closeOverlay();
  }

}
