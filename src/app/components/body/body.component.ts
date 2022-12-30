import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ITableColumn } from '@ui/models/table-column.interface';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { MAX_ENTRIES_TO_SHOW } from '@constants/max-entries-to-show.const';
import { PseudoSocketService } from '@services/pseudo-socket.service';
import { distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { DataEntry } from '../../classes/data-entry.class';
import { numberArraysAreEqual } from '@helpers/number-arrays-are-equal';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {
  public columns: ITableColumn[] = [
    {
      title: 'Id',
      width: 12,
    },
    {
      title: 'Int',
      width: 17,
    },
    {
      title: 'Float',
      width: 17,
    },
    {
      title: 'Color',
      width: 24.5,
    },
    {
      title: 'Child',
      width: 29.5,
    },
  ];

  public childColumns: ITableColumn[] = [
    {
      title: 'Id',
      width: 50,
    },
    {
      title: 'Color',
      width: 50,
    },
  ];

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
    this.pseudoSocketService.settings$
      .pipe(
        distinctUntilChanged(this.detectSettingsChanges),
        tap(this.updateSettingsHandler),
        takeUntil(this.destroyed$),
      )
      .subscribe();

    this.pseudoSocketService.dataEntries$
      .pipe(
        tap(() => {
          this.entriesToShow = this.pseudoSocketService.getItemsByIds(this.idsToShow);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();

    this.idsToShow = this.calculateWhichElementsToShow(
      this.settings.additionalIds?.length ? [...this.settings.additionalIds] : [],
      this.settings.arraySize,
      this.maxEntriesToShow,
    );
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
    if (settings.additionalIds !== this.settings.additionalIds) {
      this.idsToShow = this.calculateWhichElementsToShow(
        settings.additionalIds?.length ? [...settings.additionalIds] : [],
        settings.arraySize,
        this.maxEntriesToShow,
      );

      this.entriesToShow = this.pseudoSocketService.getItemsByIds(this.idsToShow);
    }

    this.settings = settings;
    this.cdr.markForCheck();
  }
}
