import { IDataEntry } from '@models/data-entry.interface';
import { IDataEntryChild } from '@models/data-entry-child.interface';
import { getRandomInteger } from '@helpers/get-random-integer';
import { WEB_COLOR_ARRAY } from '@constants/colors.enum';
import { HEX_CHARACTERS } from '@constants/hex-characters.const';

export class DataEntry implements IDataEntry {
  id: number;
  int: number;
  float: string;
  color: string;
  child: IDataEntryChild;

  constructor(data?: Partial<IDataEntry> & Pick<IDataEntry, 'id'>) {
    this.id = data?.id ?? this.generateId();
    this.int = data?.int ?? this.generateInt();
    this.float = data?.float ?? this.generateFloat();
    this.color = data?.color ?? this.generateColor();
    this.child = data?.child ? { ...data.child } : this.generateChild();
  }

  private generateId(): number {
    return getRandomInteger(0, 1000);
  }

  private generateInt(): number {
    return getRandomInteger(0, 100000000);
  }

  private generateFloat(): string {
    return String(getRandomInteger(0, 10000000)) + '.' + Math.random().toFixed(18).substring(2);
  }

  private generateWebColor(): string {
    return WEB_COLOR_ARRAY[getRandomInteger(0, WEB_COLOR_ARRAY.length - 1)];
  }

  private generateHexColor(): string {
    let result = '#';

    for (let i = 0; i < 6; i++) {
      const pos = getRandomInteger(0, HEX_CHARACTERS.length - 1);

      result += HEX_CHARACTERS[pos];
    }

    return result;
  }

  private generateRGBColor(): string {
    return `rgb(${getRandomInteger(0, 127)}, ${getRandomInteger(0, 127)}, ${getRandomInteger(0, 127)})`;
  }

  private generateColor(): string {
    const option = getRandomInteger(0, 2);

    return option === 0
      ? this.generateWebColor()
      : option === 1
        ? this.generateHexColor()
        : this.generateRGBColor();
  }

  private generateChild(): IDataEntryChild {
    return {
      id: this.generateId(),
      color: this.generateColor(),
    };
  }

  public toString(): string {
    return DataEntry.generateEntryString(this);
  }

  public static generateEntry(data?: Partial<IDataEntry> & { id: number }): IDataEntry {
    const newEntry = new DataEntry(data);

    return {
      id: newEntry.id,
      int: newEntry.int,
      float: newEntry.float,
      color: newEntry.color,
      child: { ...newEntry.child },
    };
  }

  public static generateEntryString(data?: Partial<IDataEntry> & { id: number }): string {
    return JSON.stringify(DataEntry.generateEntry(data));
  }
}
