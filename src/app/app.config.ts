import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { errorInterceptor } from './interceptors/error.interceptor';  // Add this import

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([errorInterceptor])  // Add interceptor here
    ),
    // Ng-Zorro global configuration
    provideNzConfig({
      theme: {
        primaryColor: '#1890ff'
      },
      message: {
        nzTop: 24,
        nzDuration: 3000,
        nzMaxStack: 7
      },
      notification: {
        nzTop: '24px',
        nzBottom: '24px',
        nzPlacement: 'topRight',
        nzDuration: 4500
      }
    })
  ]
};
