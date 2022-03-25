export interface iAddress {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
  mapUrl: string;
  type: string;
}

export interface iAddressItem {
  id: string;
  value: iAddress;
  index: number;
}

export class Address implements iAddress {
  addressLine1 = "";
  addressLine2 = "";
  addressLine3 = "";
  city = "";
  postalCode = "";
  province = "";
  country = "";
  mapUrl = "";
  type = "";

  constructor(country?: string) {
    if (country) {
      this.country = country;
    }
  }
}
