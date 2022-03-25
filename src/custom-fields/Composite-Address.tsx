import React, { useCallback, useEffect, useState } from "react";
import { TextInput, Stack } from "@contentful/f36-components";

import { AutocompleteField } from "./Autocomplete-Field";
import { iCompositeAddressProps, iValidation } from "../models";

import COUNTRIES from "../utils/country-state.list.json";

const countriesList = COUNTRIES.countries.map((item) => item.country);
const getProvinces = (country: string) => {
  return (
    COUNTRIES.countries.find(
      (c) => c.country.toLowerCase() === country.toLowerCase()
    )?.states || []
  );
};

interface iFieldValidation {
  country?: iValidation;
  province?: iValidation;
  address1?: iValidation;
  address2?: iValidation;
  address3?: iValidation;
  city?: iValidation;
  postalCode?: iValidation;
  mapUrl?: iValidation;
  type?: iValidation;
}

const CompositeAddress = (props: iCompositeAddressProps) => {
  const { item, onChange, onValidationChange } = props;
  const [validation, setValidation] = useState<iFieldValidation>({});

  const [provincesList, setProvincesList] = useState(
    getProvinces(item.country)
  );

  useEffect(() => {
    setProvincesList(getProvinces(item.country));
    onChange("province", "");
  }, [item.country, onChange]);

  useEffect(() => {
    const getV = () =>
      ({
        isValid: true,
        message: "",
      } as iValidation);
    const newValidation: iFieldValidation = {
      //   address1: getV(),
      //   address2: getV(),
      //   address3: getV(),
      city: getV(),
      //   postalCode: getV(),
      //   province: getV(),
      country: getV(),
      //   mapUrl: getV(),
      //   type: getV(),
    };
    if (!item.city || item.city === "") {
      newValidation.city = {
        isValid: false,
        message: "Required",
      };
    }
    if (!item.country || item.country === "") {
      newValidation.country = {
        isValid: false,
        message: "Required",
      };
    }
    setValidation((prev) => ({
      ...prev,
      ...newValidation,
    }));
  }, [item]);

  useEffect(() => {
    onValidationChange(
      !Object.values(validation).some((item: iValidation) => !item.isValid)
    );
  }, [validation, onValidationChange]);

  const onChangeValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.name, event.target.value);
  };

  const onChangeDDLHandler = useCallback(
    (field: string, value: string) => {
      onChange(field, value);
    },
    [onChange]
  );

  const isInValid = (field: string) => {
    if (
      typeof (validation as any)[field] !== "undefined" &&
      (validation as any)[field] !== null &&
      typeof (validation as any)[field].isValid === "boolean"
    ) {
      return !(validation as any)[field].isValid;
    }
    return false;
  };

  return (
    <Stack flexDirection="column" spacing="spacingS">
      <AutocompleteField
        label="Country"
        value={item.country}
        list={countriesList}
        onChange={onChangeDDLHandler.bind(this, "country")}
        isInvalid={isInValid("country")}
      />
      <AutocompleteField
        label="State/Province"
        value={item.province || ""}
        list={provincesList}
        onChange={onChangeDDLHandler.bind(this, "province")}
        isInvalid={isInValid("province")}
      />
      <TextInput
        aria-label="Address Line 1"
        placeholder="Address Line 1"
        type="text"
        onChange={onChangeValueHandler}
        value={item.addressLine1}
        name="addressLine1"
        isInvalid={isInValid("addressLine1")}
      />
      <TextInput
        aria-label="Address Line 2"
        placeholder="Address Line 2"
        type="text"
        onChange={onChangeValueHandler}
        value={item.addressLine2}
        name="addressLine2"
        isInvalid={isInValid("addressLine2")}
      />
      <TextInput
        aria-label="Address Line 3"
        placeholder="Address Line 3"
        type="text"
        onChange={onChangeValueHandler}
        value={item.addressLine3}
        name="addressLine3"
        isInvalid={isInValid("addressLine3")}
      />
      <TextInput
        aria-label="City"
        placeholder="City"
        type="text"
        onChange={onChangeValueHandler}
        value={item.city}
        name="city"
        isInvalid={isInValid("city")}
      />
      <TextInput
        aria-label="Postal Code"
        placeholder="Postal Code"
        type="text"
        onChange={onChangeValueHandler}
        value={item.postalCode}
        name="postalCode"
        isInvalid={isInValid("postalCode")}
      />
      <TextInput
        aria-label="Map URL>"
        placeholder="Map Url"
        type="url"
        onChange={onChangeValueHandler}
        value={item.mapUrl}
        name="mapUrl"
        isInvalid={isInValid("mapUrl")}
      />
      <TextInput
        aria-label="Address Type"
        placeholder="Address Type"
        type="text"
        onChange={onChangeValueHandler}
        value={item.type}
        name="type"
        isInvalid={isInValid("type")}
      />
    </Stack>
  );
};

export { CompositeAddress };
