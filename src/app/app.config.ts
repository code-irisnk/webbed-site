import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  PreloadAllModules,
  withViewTransitions,
  TitleStrategy,
} from '@angular/router';

import { APP_BASE_HREF, IMAGE_CONFIG } from '@angular/common';

import { routes } from './app.routes';
import { SiteTitleStrategy } from './services/site-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions({ skipInitialTransition: true }),
    ),

    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: TitleStrategy, useExisting: SiteTitleStrategy },

    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: false,
        disableImageLazyLoadWarning: false,
      },
    },
  ],
};
