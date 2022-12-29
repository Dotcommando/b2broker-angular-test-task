import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { PseudoSocketService } from '@services/pseudo-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private pseudoSocketService: PseudoSocketService,
  ) {
  }

  ngOnInit(): void {
    this.pseudoSocketService.startWorker();
  }

  handleEvent(event: IPseudoSocketSettings) {
    console.log('Set delay:', event);
    this.pseudoSocketService.setSettings(event);
  }

  ngOnDestroy(): void {
    this.pseudoSocketService.terminate();
  }
}
