import { IDataEntryChild } from '@models/data-entry-child.interface';

export interface IDataEntry {
  id: number;
  int: number;
  float: string;
  color: string;
  child: IDataEntryChild;
}
