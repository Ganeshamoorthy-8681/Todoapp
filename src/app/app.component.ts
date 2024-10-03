import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from './components/navigation-sidebar/navigation-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationSidebarComponent, MatSidenavModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
