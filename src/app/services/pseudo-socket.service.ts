import { Injectable } from '@angular/core';
import { WORKER_EVENT } from '@constants/worker-event.enum';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { WORKER_NAME } from '@constants/worker-name.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';

@Injectable({
  providedIn: 'root'
})
export class PseudoSocketService {
  private worker: Worker;
  private workerSettings: IPseudoSocketSettings = {
    delay: DEFAULT_DELAY,
    arraySize: DEFAULT_ARRAY_SIZE,
  };

  constructor() {
  }

  public startWorker() {
    if (this.worker) return;

    this.worker = new Worker(
      new URL('../worker/web.worker', import.meta.url),
      { type: 'module', name: WORKER_NAME },
    );

    this.worker.onmessage = (msg: MessageEvent) => {
      console.log('Worker message:', msg.data);
    };

    this.worker.postMessage({
      type: WORKER_EVENT.INIT,
      // settings: { ...this.workerSettings },
      settings: { arraySize: 1000, delay: 3000 },
    });
  }

  public setSettings(settings: IPseudoSocketSettings) {
    this.workerSettings = { ...settings };

    this.worker.postMessage({ type: WORKER_EVENT.CHANGE_SETTINGS, settings: this.workerSettings });
  }

  public terminate(): void {
    this.worker.terminate();
  }
}
