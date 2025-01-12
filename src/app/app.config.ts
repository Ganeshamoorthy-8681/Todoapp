import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { requestInterceptorInterceptor } from './service/interceptors/request-interceptor.interceptor';
// import { AuthService } from './service/auth-service/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([requestInterceptorInterceptor])
    ),
    provideNativeDateAdapter(),
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeApp,
    //   deps:[AuthService],
    //   multi: true
    // }
  ]
};


// function initializeApp(authService:AuthService) {
//   authService.
// }
