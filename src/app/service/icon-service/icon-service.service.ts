import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG_ICONS } from '../../constants/Icons-constants';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor (
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
  }

  registerSvgIcons() {
    SVG_ICONS.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(icon.path)
      );
    });
  }
}
