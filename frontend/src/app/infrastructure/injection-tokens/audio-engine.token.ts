
import { InjectionToken } from '@angular/core';
import { IAudioEngine } from '../../core/domain/ports/secondary/i-audio-engine';

export const AUDIO_ENGINE = new InjectionToken<IAudioEngine>('AudioEngine');
