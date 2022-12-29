export type InputSize = 'sm' | 'm' | 'lg';

export interface IInputComponentAttributes {
  value?: string;
  label?: string;
  width?: string;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  isError?: boolean;
  tabIndex?: number;
  maxLength?: number;
}

export const DEFAULT_INPUT_SIZE_VALUE: InputSize = 'lg';
export const DEFAULT_MAX_ITEM_LENGTH_SIZE = 32;
