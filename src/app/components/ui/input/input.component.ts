import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  DEFAULT_INPUT_SIZE_VALUE,
  DEFAULT_MAX_ITEM_LENGTH_SIZE,
  IInputComponentAttributes,
  InputSize,
} from '@components/ui/models/input.model';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {

  @HostBinding('class.b2b-input-host')
  hostClass = true;

  @ViewChild('inputEl', { static: true })
  inputEl!: ElementRef;

  @Output()
  keyPressed = new EventEmitter<KeyboardEvent>();

  @Output()
  changed = new EventEmitter<string>();

  @Output()
  blurred = new EventEmitter<Event>();


  @Input()
  set prefix(value: string | null) {
    this._prefix = value;
  }

  get prefix(): string | null {
    return this._prefix;
  }

  private _prefix: string | null = null;


  @Input()
  set keyPattern(newValue: RegExp | undefined) {
    if (this._keyPattern !== newValue) {
      this._keyPattern = newValue;
    }
  }

  get keyPattern(): RegExp | undefined {
    return this._keyPattern;
  }

  private _keyPattern: RegExp | undefined;


  @Input() set value(newValue: string) {
    if (newValue !== this._value) {
      this._value = newValue;
      this.onChange(newValue);
      this.cdr.markForCheck();
    }
  }

  get value(): string {
    return this._value;
  }

  private _value = '';


  @Input() set label(newLabel: string) {
    if (newLabel !== this._label) {
      this._label = newLabel;
      this.cdr.markForCheck();
    }
  }

  get label(): string {
    return this._label;
  }

  private _label!: string;


  @Input() set width(newWidth: string) {
    if (newWidth && newWidth !== this._width) {
      this._width = newWidth;
      this.cdr.markForCheck();
    }
  }

  get width(): string {
    return this._width;
  }

  private _width!: string;


  @Input() set size(newSize: InputSize) {
    if (newSize && newSize !== this._size) {
      this._size = newSize;
      this.cdr.markForCheck();
    }
  }

  get size(): InputSize {
    return this._size;
  }

  private _size: InputSize = DEFAULT_INPUT_SIZE_VALUE;


  @Input()
  set placeholder(newPlaceholder: string) {
    if (newPlaceholder !== this._placeholder) {
      this._placeholder = newPlaceholder;
      this.cdr.markForCheck();
    }
  }

  get placeholder(): string {
    return this._placeholder;
  }

  private _placeholder = '';


  @Input()
  set disabled(isDisabled: boolean) {
    if (isDisabled !== this._isDisabled) {
      this._isDisabled = isDisabled;
      this.cdr.markForCheck();
    }
  }

  get disabled(): boolean {
    return this._isDisabled;
  }

  private _isDisabled = false;


  @Input()
  set readonly(isReadonly: boolean) {
    if (isReadonly !== this._readonly) {
      this._readonly = isReadonly;
      this.cdr.markForCheck();
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }

  private _readonly = false;


  @Input()
  set isRequired(isRequired: boolean) {
    if (this._isRequired !== isRequired) {
      this._isRequired = isRequired;
      this.cdr.markForCheck();
    }
  }

  get isRequired(): boolean {
    return this._isRequired;
  }

  private _isRequired = false;


  @Input()
  set isError(isError: boolean) {
    if (isError !== this._isError) {
      this._isError = isError;
      this.cdr.markForCheck();
    }
  }

  get isError(): boolean {
    return this._isError;
  }

  private _isError = false;


  @Input()
  set tabIndex(tabIndex: number) {
    if (tabIndex ?? tabIndex !== this.tabIndex) {
      this._tabIndex = tabIndex;
      this.cdr.markForCheck();
    }
  }

  get tabIndex(): number {
    return this._tabIndex;
  }

  private _tabIndex!: number;


  @Input()
  set showTextLength(isShown: boolean) {
    if (isShown !== this.showTextLength) {
      this._showTextLength = isShown;
      this.cdr.markForCheck();
    }
  }

  get showTextLength(): boolean {
    return this._showTextLength;
  }

  private _showTextLength = false;


  @Input()
  set maxLength(maxLength: number) {
    if (maxLength && maxLength !== this._maxLength) {
      this._maxLength = maxLength;
      this.cdr.markForCheck();
    }
  }

  get maxLength(): number {
    return this._maxLength;
  }

  private _maxLength!: number;


  focused = false;

  @Input() set attributes(attributes: IInputComponentAttributes) {
    if (attributes) {
      this._attributes = attributes;
      this.value = attributes.value || '';
      this.label = attributes.label || '';
      this.width = attributes.width || '';
      this.size = attributes.size || DEFAULT_INPUT_SIZE_VALUE;
      this.placeholder = attributes.placeholder || '';
      this.disabled = attributes.disabled || false;
      this.readonly = attributes.readonly || false;
      this.isRequired = attributes.required || false;
      this.isError = attributes.isError || false;
      this.tabIndex = attributes.tabIndex || 1;
      this.maxLength = attributes.maxLength || DEFAULT_MAX_ITEM_LENGTH_SIZE;
      this.cdr.markForCheck();
    }
  }

  get attributes(): IInputComponentAttributes {
    return this._attributes;
  }

  private _attributes!: IInputComponentAttributes;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isShortcut(event, 'c') || this.isShortcut(event, 'v') || this.isShortcut(event, 'x') || this.isShortcut(event, 'a')) {
      return;
    }

    if (this._keyPattern) {
      if (this._keyPattern.test(event.key)) {
        return;
      } else {
        event.preventDefault();
      }
    }
  }

  private isShortcut(event: KeyboardEvent, keyChar: string) {
    return event.key === keyChar && (event.ctrlKey === true || event.metaKey === true);
  }

  writeValue(val: string): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onChange: any = (): void => {}

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onTouch: any = (): void => {}

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onBlur(event: Event): void {
    this.focused = false;
    this.onTouch();

    this.blurred.emit(event);
  }

  onFocus(): void {
    if (!this.disabled && !this.readonly) {
      this.focused = true;
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.maxLength) {
      this.cutValueThatExceedsMaxLength(input);
    }
    this.value = input.value;
    this.changed.emit(this.value);
  }

  cutValueThatExceedsMaxLength(input: HTMLInputElement): void {
    if (input.value.length > this.maxLength) {
      input.value = input.value.substring(0, this.maxLength);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    this.keyPressed.emit(event);
  }

  focusOnInput(): void {
    this.inputEl.nativeElement.focus();
  }
}
