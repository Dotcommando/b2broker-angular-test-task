import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { PseudoSocketService } from '@services/pseudo-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private pseudoSocketService: PseudoSocketService,
  ) {
  }

  public settings!: IPseudoSocketSettings;

  ngOnInit(): void {
    this.pseudoSocketService.startWorker();
  }

  ngOnDestroy(): void {
    this.pseudoSocketService.terminate();
  }
}
