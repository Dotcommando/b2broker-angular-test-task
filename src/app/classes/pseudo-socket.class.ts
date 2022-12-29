import { IDataEntry } from 'app/models/data-entry.interface';
import { DataEntry } from './data-entry.class';

export class PseudoSocket {
  private static instance: PseudoSocket;

  private constructor() {
  }

  public generateDataGrid(arraySize: number): IDataEntry[] {
    const result: IDataEntry[] = [];

    for (let i = 0; i < arraySize; i++) {
      result.push(DataEntry.generateEntry({ id: i }));
    }

    return result;
  }

  public static getInstance(): PseudoSocket {
    if (!PseudoSocket.instance) {
      PseudoSocket.instance = new PseudoSocket();
    }

    return PseudoSocket.instance;
  }
}
