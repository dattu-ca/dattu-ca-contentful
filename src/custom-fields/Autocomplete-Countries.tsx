import React, { useState, useEffect } from "react";
import { Autocomplete, Box } from "@contentful/f36-components";
import { EditIcon } from "@contentful/f36-icons";
import { iAutocompleteCountriesProps } from "../models";

import COUNTRIES from "../utils/country-state.list.json";

const hoverStyle = {
  color: "black",
  textDecoration: "underline",
  fontWeight: "bold",
};

const countriesList = COUNTRIES.countries.map((item) => item.country);

const AutocompleteCountries = (props: iAutocompleteCountriesProps) => {
  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState(false);
  const [filteredItems, setFilteredItems] = useState<string[]>(countriesList);

  useEffect(() => {
    setEditMode(false);
  }, [props.value]);

  useEffect(() => {
    if (editMode) {
      setFilteredItems(countriesList);
    }
  }, [editMode]);

  const handleInputValueChange = (value: string) => {
    const newFilteredItems = countriesList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(newFilteredItems);
  };

  const handleSelectItem = (item: string) => {
    props.onChange(item);
  };

  return (
    <Box style={{ width: "100%" }}>
      <Box style={{ width: "100%" }}>
        <div
          style={{
            cursor: "pointer",
            ...(hover ? hoverStyle : {}),
          }}
          onClick={() => setEditMode(prev => !prev)}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          {props.value}
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
          placeholder="Select Country"
        />
      )}
    </Box>
  );
};

export  {AutocompleteCountries};
