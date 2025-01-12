import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from './components/navigation-sidebar/navigation-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './components/header/header.component';
import { IconService } from './service/icon-service/icon-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor (private iconService: IconService) {
    this.iconService.registerSvgIcons();
  }

  ngOnInit(): void {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.display = 'none';  // Hide or remove the loader
    }
  }
}
