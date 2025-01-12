import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationSidebarComponent } from '../navigation-sidebar/navigation-sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-app-base',
  standalone: true,
  imports: [RouterOutlet, NavigationSidebarComponent, HeaderComponent],
  templateUrl: './app-base.component.html',
  styleUrl: './app-base.component.scss'
})
export class AppBaseComponent {

}
