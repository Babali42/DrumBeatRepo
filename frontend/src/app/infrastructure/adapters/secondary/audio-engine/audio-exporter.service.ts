import { Injectable } from '@angular/core';
import { ExportOptions } from '../../../../core/domain/export-options';
import { Track } from '../../../../core/domain/track';
import { TempoAdapterService } from '../tempo-control/tempo-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class AudioExporterService {
  constructor(private readonly tempoService: TempoAdapterService) {}

  async exportBeat(
    tracks: readonly Track[],
    options: ExportOptions
  ): Promise<Blob> {
    const barDurationSeconds = this.tempoService.barDuration;
    const totalDurationSeconds = barDurationSeconds * options.loopCount;
    const sampleRate = 44100;

    const rawBuffers = await this.loadAllBuffers(tracks);
    const maxBufferDuration = this.getMaxBufferDuration(rawBuffers);
    const totalWithTail = totalDurationSeconds + maxBufferDuration;
    const totalSamples = Math.ceil(totalWithTail * sampleRate);

    const offlineContext = new OfflineAudioContext(2, totalSamples, sampleRate);
    const stepDurationSeconds = this.tempoService.stepDuration;

    const audioBuffers = await this.loadAllTracks(tracks, offlineContext);

    for (const track of tracks) {
      const audioBuffer = audioBuffers.get(track.fileName);
      if (!audioBuffer) continue;

      for (let loop = 0; loop < options.loopCount; loop++) {
        const loopStartTime = loop * barDurationSeconds;

        for (let stepIndex = 0; stepIndex < track.steps.steps.length; stepIndex++) {
          if (track.steps.steps[stepIndex]) {
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);

            const when = loopStartTime + (stepIndex * stepDurationSeconds);
            source.start(when);
          }
        }
      }
    }

    const renderedBuffer = await offlineContext.startRendering();
    return this.bufferToWav(renderedBuffer);
  }

  private async loadAllBuffers(
    tracks: readonly Track[]
  ): Promise<Map<string, ArrayBuffer>> {
    const buffers = new Map<string, ArrayBuffer>();

    const loadPromises = tracks.map(async (track) => {
      try {
        const response = await fetch(`/assets/sounds/${track.fileName}`);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          buffers.set(track.fileName, arrayBuffer);
        }
      } catch (error) {
        console.warn(`Failed to load ${track.fileName}:`, error);
      }
    });

    await Promise.all(loadPromises);
    return buffers;
  }

  private getMaxBufferDuration(buffers: Map<string, ArrayBuffer>): number {
    let maxDuration = 0;
    buffers.forEach((arrayBuffer) => {
      const duration = arrayBuffer.byteLength / (44100 * 2 * 2);
      if (duration > maxDuration) {
        maxDuration = duration;
      }
    });
    return maxDuration;
  }

  private async loadAllTracks(
    tracks: readonly Track[],
    context: OfflineAudioContext
  ): Promise<Map<string, AudioBuffer>> {
    const buffers = new Map<string, AudioBuffer>();

    const loadPromises = tracks.map(async (track) => {
      try {
        const response = await fetch(`/assets/sounds/${track.fileName}`);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          buffers.set(track.fileName, audioBuffer);
        }
      } catch (error) {
        console.warn(`Failed to load ${track.fileName}:`, error);
      }
    });

    await Promise.all(loadPromises);
    return buffers;
  }

  private bufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = buffer.length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = headerSize;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
