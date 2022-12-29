/// <reference lib="webworker" />

import { PseudoSocket } from '../classes/pseudo-socket.class';
import { WORKER_EVENT } from '@constants/worker-event.enum';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';

(function() {
  let arraySize = DEFAULT_ARRAY_SIZE;
  let delay = DEFAULT_DELAY;
  let timer: ReturnType<typeof setTimeout>;
  const socket = PseudoSocket.getInstance();

  return {
    setSettings: function(settings: IPseudoSocketSettings): void {
      if (!settings) return;
      arraySize = settings?.arraySize && !isNaN(settings.arraySize) ? settings.arraySize : DEFAULT_ARRAY_SIZE;
      delay = settings?.delay && !isNaN(settings.delay) ? settings.delay : DEFAULT_DELAY;
      postMessage({ redefined: true, delay, settingsDelay: settings.delay });
    },

    generateTimeout: function(evt?: MessageEvent) {
      timer = setTimeout(() => {
        postMessage(socket.generateDataGrid(arraySize));

        this.generateTimeout();
      }, delay);
    },

    eventHandler: function(evt: MessageEvent) {
      if (evt.data?.type === WORKER_EVENT.INIT) {
        clearTimeout(timer);

        this.setSettings(evt?.data?.settings);
        this.generateTimeout(evt);
      }

      if (evt.data?.type === WORKER_EVENT.CHANGE_SETTINGS) {
        clearTimeout(timer);

        this.setSettings(evt?.data?.settings);
        this.generateTimeout(evt);
      }

      if (evt.data?.type === WORKER_EVENT.COMPLETE) {
        clearTimeout(timer);
      }
    },

    init() {
      this.setSettings = this.setSettings.bind(this);
      this.generateTimeout = this.generateTimeout.bind(this);

      addEventListener('message', this.eventHandler.bind(this));
    },
  };
})().init();
