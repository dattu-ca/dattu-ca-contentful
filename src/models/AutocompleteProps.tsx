export interface iAutocompleteProps {
  label?: string;
  list: string[];
  value: string;
  onChange: (value: string) => void;
  isInvalid: boolean;
}
