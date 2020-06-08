import { InjectionToken } from '@angular/core';

import { DnbhubEnvironmentConfig } from '../app.environment';

export const WINDOW = new InjectionToken<Window>('Window');

export const APP_ENV = new InjectionToken<DnbhubEnvironmentConfig>('APP_ENV');
