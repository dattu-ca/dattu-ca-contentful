import { Address } from "./AddressItem";

export interface iCompositeAddressProps {
  item: Address;
  onValidationChange: (isValid: boolean) => void;
  onChange: (field: string, value: string) => void;
}
