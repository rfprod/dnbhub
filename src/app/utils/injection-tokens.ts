import { InjectionToken } from '@angular/core';

import { AppEnvironmentConfig } from '../app.environment';

export const WINDOW = new InjectionToken<Window>('Window');

export const APP_ENV = new InjectionToken<AppEnvironmentConfig>('APP_ENV');
