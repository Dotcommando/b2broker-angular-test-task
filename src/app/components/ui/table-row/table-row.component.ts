import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent implements OnInit {
  @Input()
  @HostBinding('class.reduce-bottom-margin')
  reduceBottomMargin = false;

  constructor() { }

  ngOnInit(): void {
  }

}
