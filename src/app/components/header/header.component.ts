import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { numbersOnlyValidator } from '@helpers/number-only-validator';
import { positiveIntegerNumberValidator } from '@helpers/positive-integer-number-validator';
import { positiveIntegerSeriesValidator } from '@helpers/positive-integer-series-validator';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  NEVER,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { IPseudoSocketSettings } from '@models/pseudo-socket-settings.interface';
import { IPseudoSocketSettingsRawData } from '@models/pseudo-socket-settings-raw-data.interface';
import { DEFAULT_DELAY } from '@constants/default-delay.const';
import { DEFAULT_ARRAY_SIZE } from '@constants/default-array-size.const';
import { PseudoSocketService } from '@services/pseudo-socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  private flowPause$ = new BehaviorSubject<boolean>(true);
  dataFlowControlForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private pseudoSocketService: PseudoSocketService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.checkFormStatus();
    this.runDataFlow(this.dataFlowControlForm.value);

    this.dataFlowControlForm
      .valueChanges
      .pipe(
        // tap((data) => console.log('BEFORE', data)),
        debounceTime(500),
        switchMap((data: IPseudoSocketSettingsRawData) => this.runDataFlow(data)),
        map((data: IPseudoSocketSettingsRawData) => this.calculateFormData(data)),
        tap((data: IPseudoSocketSettings) => this.pseudoSocketService.setSettings(data)),
        // tap((data) => console.log('AFTER', data)),
        takeUntil(this.destroyed$),
      )
      .subscribe();

    this.pseudoSocketService.setSettings(this.calculateFormData(this.dataFlowControlForm.value));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private checkFormStatus(): void {
    this.dataFlowControlForm
      .statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(status => this.flowPause$.next(status === 'INVALID')),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  private runDataFlow(data: IPseudoSocketSettingsRawData): Observable<IPseudoSocketSettingsRawData> {
    return this.flowPause$
      .pipe(
        // tap((isPaused: boolean) => console.log('isPaused', isPaused)),
        switchMap((isPaused: boolean) => {
          return isPaused ? NEVER : of(data);
        }),
      );
  }

  private getParsedNumbersArray(value: string): number[] {
    if (!value) {
      return [];
    }

    const numberMatches = value.match((/(\d)*/g));

    if (!numberMatches || numberMatches.length === 1) {
      return [];
    }

    const unsortedResult: number[] = [];

    for (let i = 0; i < numberMatches.length; i++) {
      const parsedNumber = parseInt(numberMatches[i]);

      if (unsortedResult.indexOf(parsedNumber) > -1 || numberMatches[i] === '') continue;

      unsortedResult.push(parsedNumber);
    }

    return unsortedResult.sort((a, b) => a - b);
  }

  private validateDataFlowControlForm(formGroup: FormGroup): ValidationErrors | null {
    const arraySizeValue = formGroup.get('arraySize')?.value;

    if (!arraySizeValue || isNaN(parseInt(arraySizeValue))) {
      return null;
    }

    const additionalIdsValue = formGroup.get('additionalIds')?.value;

    if (additionalIdsValue === '') {
      return null;
    }

    const additionalIds = this.getParsedNumbersArray(additionalIdsValue);

    if (!additionalIds.length) {
      return null;
    }

    const arrayLastIndex = parseInt(arraySizeValue) - 1;

    return additionalIds.some((id) => id > arrayLastIndex)
      ? { someValueIsBiggerArraySize: true }
      : null;
  }

  private initForm(): void {
    this.dataFlowControlForm = this.formBuilder.group({
      delay: [ DEFAULT_DELAY, [ Validators.required, numbersOnlyValidator ] ],
      arraySize: [ DEFAULT_ARRAY_SIZE, [ Validators.required, positiveIntegerNumberValidator ] ],
      additionalIds: [ '', positiveIntegerSeriesValidator ],
    }, {
      validators: this.validateDataFlowControlForm.bind(this),
    });
  }

  private calculateFormData(data: IPseudoSocketSettingsRawData): IPseudoSocketSettings {
    const additionalIds = data.additionalIds ? this.getParsedNumbersArray(data.additionalIds) : [];

    return {
      delay: parseInt(data.delay),
      arraySize: parseInt(data.arraySize),
      ...(data.additionalIds && additionalIds.length && { additionalIds }),
    };
  }
}
