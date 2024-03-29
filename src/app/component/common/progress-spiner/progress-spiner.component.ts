import { Overlay, OverlayRef,PositionStrategy } from '@angular/cdk/overlay';
import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-progress-spiner',
  templateUrl: './progress-spiner.component.html',
  styleUrl: './progress-spiner.component.scss'
})
export class ProgressSpinerComponent {

  @Input() displayProgressSpinner: boolean = false;
  @ViewChild('progressSpinnerRef') progressSpinnerRef?: TemplateRef<any>;

  color: ThemePalette = 'primary';
  backdropEnabled = true;
  positionGloballyCenter = true;

  private progressSpinnerOverlayConfig: any;
  private overlayRef!: OverlayRef;

  constructor(private vcRef: ViewContainerRef,
              private overlay: Overlay) {

  }
  ngOnInit() {
    // Config for Overlay Service
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled
    };
    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig['positionStrategy'] = this.doPositionGloballyCenter();
    }
    // Create Overlay for progress spinner
    this.overlayRef = this.overlay.create(this.progressSpinnerOverlayConfig);
  }
  ngDoCheck() {
    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
      if( this.progressSpinnerRef != null)
      this.attachTemplatePortal(this.overlayRef, this.progressSpinnerRef, this.vcRef);
    } else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<any>, vcRef: ViewContainerRef) {
      let templatePortal = new TemplatePortal(templateRef, vcRef);
      overlayRef.attach(templatePortal);
  }
  doPositionGloballyCenter(): PositionStrategy {
      return this.overlay.position()
          .global()
          .centerHorizontally()
          .centerVertically();
  }
}
