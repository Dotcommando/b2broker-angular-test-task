/// <reference lib="webworker" />

import { PseudoSocket } from '../classes/pseudo-socket.class';
import { WORKER_EVENT } from '@constants/worker-event.enum';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { IDataEntry } from '@models/data-entry.interface';

(function() {
  let arraySize = DEFAULT_ARRAY_SIZE;
  let delay = DEFAULT_DELAY;
  let timer: ReturnType<typeof setTimeout>;
  let idsToShow: string[] = [];
  let dataGrid: IDataEntry[] = [];
  const socket = PseudoSocket.getInstance();

  return {
    setSettings: function(settings: IPseudoSocketSettings): void {
      if (!settings) return;
      arraySize = settings?.arraySize && !isNaN(settings.arraySize) ? settings.arraySize : DEFAULT_ARRAY_SIZE;
      delay = settings?.delay && !isNaN(settings.delay) ? settings.delay : DEFAULT_DELAY;
    },

    setIdsToShow: function(ids: number[] | undefined): void {
      if (!ids?.length) return;

      idsToShow = ids.map((id: number): string => String(id));
    },

    getData: function(idsToShow: string[]): IDataEntry[] {
      if (!idsToShow?.length) return [];

      return dataGrid.filter((dataEntry: IDataEntry) => idsToShow.includes(dataEntry.id));
    },

    generateTimeout: function() {
      timer = setTimeout(() => {
        dataGrid = socket.generateDataGrid(arraySize);

        postMessage(this.getData(idsToShow));

        this.generateTimeout();
      }, delay);
    },

    eventHandler: function(evt: MessageEvent) {
      if (evt.data?.type === WORKER_EVENT.INIT) {
        clearTimeout(timer);

        this.setSettings(evt?.data?.settings);
        this.setIdsToShow(evt?.data?.idsToShow);
        this.generateTimeout();
      }

      if (evt.data?.type === WORKER_EVENT.CHANGE_SETTINGS) {
        clearTimeout(timer);

        this.setSettings(evt?.data?.settings);
        this.setIdsToShow(evt?.data?.idsToShow);
        this.generateTimeout();

        const setArraySize = Boolean(evt?.data?.settings?.arraySize?.length);
        const setIds = Boolean(evt?.data?.idsToShow?.length);

        if (setArraySize || setIds) {
          dataGrid = socket.generateDataGrid(arraySize);

          postMessage(this.getData(idsToShow));
        }
      }

      if (evt.data?.type === WORKER_EVENT.COMPLETE) {
        clearTimeout(timer);
      }
    },

    init() {
      this.setSettings = this.setSettings.bind(this);
      this.setIdsToShow = this.setIdsToShow.bind(this);
      this.generateTimeout = this.generateTimeout.bind(this);
      this.getData = this.getData.bind(this);

      addEventListener('message', this.eventHandler.bind(this));
    },
  };
})().init();
