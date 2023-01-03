import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ITableColumn } from '@ui/models/table-column.interface';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { MAX_ENTRIES_TO_SHOW } from '@constants/max-entries-to-show.const';
import { PseudoSocketService } from '@services/pseudo-socket.service';
import { distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { DataEntry } from '../../classes/data-entry.class';
import { numberArraysAreEqual } from '@helpers/number-arrays-are-equal';
import { MAIN_TABLE_COLUMNS } from '@constants/main-table-columns.const';
import { CHILD_TABLE_COLUMNS } from '@constants/child-table-columns.const';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {
  public columns: ITableColumn[] = [ ...MAIN_TABLE_COLUMNS ];
  public childColumns: ITableColumn[] = [ ...CHILD_TABLE_COLUMNS ];
  public entriesToShow: DataEntry[] = [];

  private maxEntriesToShow = MAX_ENTRIES_TO_SHOW;
  private idsToShow: number[] = [];
  private destroyed$ = new Subject<void>();

  private settings: IPseudoSocketSettings = {
    arraySize: DEFAULT_ARRAY_SIZE,
    delay: DEFAULT_DELAY,
  };

  constructor(
    private pseudoSocketService: PseudoSocketService,
    private cdr: ChangeDetectorRef,
  ) {
    this.detectSettingsChanges = this.detectSettingsChanges.bind(this);
    this.updateSettingsHandler = this.updateSettingsHandler.bind(this);
  }

  ngOnInit(): void {
    this.initSettingsTracker();
    this.initEntriesUpdatesTracker();
    this.setIdsToShow();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private calculateWhichElementsToShow(mandatoryIds: number[], arraySize: number, maxEntriesToShow: number): number[] {
    if (mandatoryIds.length >= maxEntriesToShow) {
      return mandatoryIds
        .sort((a, b) => a - b)
        .slice(0, maxEntriesToShow);
    }

    let resultIds = [ ...mandatoryIds ];
    const lastIndex = arraySize - 1;

    for (let i = lastIndex; i >= arraySize - maxEntriesToShow; i--) {
      resultIds.push(i);
    }

    resultIds = resultIds
      .filter((item: number, pos: number) => resultIds.indexOf(item) === pos)
      .sort((a, b) => a - b);

    let i = 0;

    while (resultIds.length > maxEntriesToShow && i <= maxEntriesToShow) {
      if (mandatoryIds.length && !mandatoryIds.includes(resultIds[i])) {
        resultIds.splice(i, 1);

        continue;
      }

      i++;
    }

    return resultIds;
  }

  private detectSettingsChanges(prev: IPseudoSocketSettings, curr: IPseudoSocketSettings): boolean {
    return prev.delay === curr.delay
      && prev.arraySize === curr.arraySize
      && numberArraysAreEqual(prev.additionalIds, curr.additionalIds);
  }

  private updateSettingsHandler(settings: IPseudoSocketSettings): void {
    if (settings.additionalIds !== this.settings.additionalIds || settings.arraySize !== this.settings.arraySize) {
      this.idsToShow = this.calculateWhichElementsToShow(
        settings.additionalIds?.length ? [...settings.additionalIds] : [],
        settings.arraySize,
        this.maxEntriesToShow,
      );

      this.pseudoSocketService.setAllSettings({ settings, idsToShow: this.idsToShow });

      this.entriesToShow = this.pseudoSocketService.getEntries();
    }

    this.settings = settings;
    this.cdr.markForCheck();
  }

  private initSettingsTracker(): void {
    this.pseudoSocketService.settings$
      .pipe(
        distinctUntilChanged(this.detectSettingsChanges),
        tap(this.updateSettingsHandler),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  private initEntriesUpdatesTracker(): void {
    this.pseudoSocketService.dataEntries$
      .pipe(
        tap((data: DataEntry[]) => {
          this.entriesToShow = data;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  private setIdsToShow(): void {
    this.idsToShow = this.calculateWhichElementsToShow(
      this.settings.additionalIds?.length ? [...this.settings.additionalIds] : [],
      this.settings.arraySize,
      this.maxEntriesToShow,
    );

    this.pseudoSocketService.setIdsToShow(this.idsToShow);
  }
}
