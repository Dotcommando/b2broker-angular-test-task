import { Injectable } from '@angular/core';
import { WORKER_EVENT } from '@constants/worker-event.enum';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { WORKER_NAME } from '@constants/worker-name.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { BehaviorSubject, Subject } from 'rxjs';
import { DataEntry } from '../classes/data-entry.class';
import { plainToClass } from 'class-transformer';
import { IDataEntry } from '@models/data-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class PseudoSocketService {
  private worker: Worker;
  private workerSettings: IPseudoSocketSettings = {
    delay: DEFAULT_DELAY,
    arraySize: DEFAULT_ARRAY_SIZE,
  };
  private dataEntriesSubject$ = new BehaviorSubject<DataEntry[]>([]);
  public dataEntries$ = this.dataEntriesSubject$.asObservable();

  private settingsSubject$ = new Subject<IPseudoSocketSettings>();
  public settings$ = this.settingsSubject$.asObservable();

  private trackUpdateSubject$ = new Subject<void>();
  public trackUpdate$ = this.trackUpdateSubject$.asObservable();

  constructor() {
  }

  public startWorker() {
    if (this.worker) return;

    this.worker = new Worker(
      new URL('../worker/web.worker', import.meta.url),
      { type: 'module', name: WORKER_NAME },
    );

    this.worker.onmessage = (msg: MessageEvent) => {
      if (Array.isArray(msg.data)) {
        this.dataEntriesSubject$
          .next(msg.data.map((entry: IDataEntry): DataEntry => plainToClass(DataEntry, entry)));
        this.trackUpdateSubject$.next();
      }
    };

    this.worker.postMessage({
      type: WORKER_EVENT.INIT,
      settings: { ...this.workerSettings },
    });
  }

  public setSettings(settings: IPseudoSocketSettings) {
    this.workerSettings = { ...settings };
    this.settingsSubject$.next({ ...settings });

    this.worker.postMessage({ type: WORKER_EVENT.CHANGE_SETTINGS, settings: this.workerSettings });
  }

  public getItemsByIds(ids: number[]): DataEntry[] {
    if (ids.length === 0) return [];

    const result: DataEntry[] = [];

    for (let i = 0; i < ids.length; i++) {
      const index = ids[i];

      if (this.dataEntriesSubject$.getValue()[index]) {
        result.push(this.dataEntriesSubject$.getValue()[index]);
      }
    }

    return result;
  }

  public terminate(): void {
    this.worker.terminate();
    this.dataEntriesSubject$.complete();
  }
}
