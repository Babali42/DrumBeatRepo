import { isDevMode } from '@angular/core';

export const DEV_FEATURES = {
  showAddTrackButton: true,
} as const;

export function isEnabled(feature: keyof typeof DEV_FEATURES): boolean {
  return isDevMode() && DEV_FEATURES[feature];
}
