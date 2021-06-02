import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';

export const OVERLAY_REFERENCE = new InjectionToken<OverlayRef>('OverlayReference');
