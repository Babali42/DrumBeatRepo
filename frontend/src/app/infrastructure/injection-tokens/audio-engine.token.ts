
import { InjectionToken } from '@angular/core';
import { IAudioEngine } from '../../domain/ports/i-audio-engine';

export const AUDIO_ENGINE = new InjectionToken<IAudioEngine>('AudioEngine');
