import React, { useState, useEffect } from "react";
import { Autocomplete, Box } from "@contentful/f36-components";
import { EditIcon } from "@contentful/f36-icons";
import { iAutocompleteProps } from "../models";

const hoverStyle = {
  color: "black",
  textDecoration: "underline",
};

const AutocompleteField = (props: iAutocompleteProps) => {
  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState(false);
  const [filteredItems, setFilteredItems] = useState<string[]>(props.list);

  useEffect(() => {
    setEditMode(false);
  }, [props.value]);

  useEffect(() => {
    if (editMode) {
      setFilteredItems(props.list);
    }
  }, [editMode, props.list]);

  const handleInputValueChange = (value: string) => {
    const newFilteredItems = props.list.filter((item) =>
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
          onClick={() => setEditMode((prev) => !prev)}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
        >
          {props.value && props.value !== "" && <strong>{props.value}</strong>}
          {(!props.value || props.value === "") && (
            <span style={{ color: props.isInvalid ? "#BD002A" : "#888888" }}>
              Click to select a {props.label}
            </span>
          )}
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
          placeholder={`Select ${props.label}`}
          isInvalid={props.isInvalid}
        />
      )}
    </Box>
  );
};

export { AutocompleteField };
