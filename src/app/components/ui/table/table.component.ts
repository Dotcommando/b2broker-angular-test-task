import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ITableColumn } from '@ui/models/table-column.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  @Input()
  set columns(value: ITableColumn[]) {
    if (this.columnsNeedToBeUpdated(this._columns, value)) {
      this._columns = value;
      this.cdr.markForCheck();
    }
  }

  get columns(): ITableColumn[] {
    return this._columns;
  }

  private _columns: ITableColumn[] = [];

  private columnsNeedToBeUpdated(oldColumns: ITableColumn[], newColumns: ITableColumn[]): boolean {
    if (oldColumns.length !== newColumns.length) return true;

    const length = oldColumns.length;

    for (let i = 0; i < length; i++) {
      if (oldColumns[i].width !== newColumns[i].width) return true;
      if (oldColumns[i].title !== newColumns[i].title) return true;
    }

    return false;
  }

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
  }

}
