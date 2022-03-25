import React, { useState, useEffect } from "react";
import { Autocomplete, Box } from "@contentful/f36-components";
import { EditIcon } from "@contentful/f36-icons";
import { iAutocompleteProvincesProps } from "../models";

import COUNTRIES from "../utils/country-state.list.json";

const hoverStyle = {
  color: "black",
  textDecoration: "underline",
  fontWeight: "bold",
};

const getProvinces = (country: string) => {
  return (
    COUNTRIES.countries.find(
      (c) => c.country.toLowerCase() === country.toLowerCase()
    )?.states || []
  );
};

const AutocompleteProvinces = (props: iAutocompleteProvincesProps) => {
  const [provincesList, setProvincesList] = useState(
    getProvinces(props.country)
  );
  const { onChange } = props;

  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState(false);
  const [filteredItems, setFilteredItems] = useState<string[]>(provincesList);

  useEffect(() => {
    setProvincesList(getProvinces(props.country));
    onChange("");
  }, [props.country, onChange]);

  useEffect(() => {
    setEditMode(false);
  }, [props.value]);

  useEffect(() => {
    if (editMode) {
      setFilteredItems(provincesList);
    }
  }, [editMode, provincesList]);

  const handleInputValueChange = (value: string) => {
    const newFilteredItems = provincesList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(newFilteredItems);
  };

  const handleSelectItem = (item: string) => {
    onChange(item);
  };

  return (
    <Box style={{ width: "100%" }}>
      <Box style={{ width: "100%" }}>
        <div
          style={{
            cursor: "pointer",
            ...(hover ? hoverStyle : {}),
          }}
          onClick={() => setEditMode((prev) => !prev)}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          <span>
            {props.value && props.value !== "" && props.value}
            {(!props.value || props.value === "") && (
              <span style={{ color: "#CECECE" }}>
                Click to select a Province
              </span>
            )}
          </span>
          <EditIcon
            size="small"
            style={{
              ...(hover ? {} : { fill: "#CECECE" }),
            }}
            color="secondary"
          />
        </div>
      </Box>
      {editMode && (
        <Autocomplete
          items={filteredItems}
          onInputValueChange={handleInputValueChange}
          onSelectItem={handleSelectItem}
          listWidth="full"
          placeholder="Select State/Province"
        />
      )}
    </Box>
  );
};

export { AutocompleteProvinces };
