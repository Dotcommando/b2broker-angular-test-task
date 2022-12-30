import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent implements OnInit {
  @Input()
  @HostBinding('style.width.%')
  set width(width: number) {
    if (width !== this._width) {
      this._width = width;
      this.cdr.markForCheck();
    }
  }

  get width(): number {
    return this._width;
  }

  private _width: number = 0;


  @Input()
  @HostBinding('style.backgroundColor')
  set bgColor(bgColor: string) {
    if (bgColor !== this._bgColor) {
      this._bgColor = bgColor;
      this.cdr.markForCheck();
    }
  }

  get bgColor(): string {
    return this._bgColor;
  }

  private _bgColor = '#f7f7f7';


  constructor(
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
  }
}
