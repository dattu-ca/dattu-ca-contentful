import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Flex, IconButton, TextInput } from "@contentful/f36-components";
import { DeleteIcon, CloseIcon, PlusIcon } from "@contentful/f36-icons";
import { iFieldProps, iRepeaterParameters, iListItem } from "../models";
import { isValidWebsite } from "../utils";

const RepeaterFieldAndType = (props: iFieldProps) => {
  const parameters = props.sdk.parameters.instance as iRepeaterParameters;

  const [list, setList] = useState(props.sdk.field.getValue() as iListItem[]);
  const [newItem, setNewItem] = useState({
    id: uuidv4(),
    value: "",
    type: "",
    index: 0,
  } as iListItem);

  const [validation, setvalidation] = useState({
    value: {
      valid: false,
      message: "Required",
    },
    type: {
      valid: false,
      message: "Required",
    },
  });

  props.sdk.field.onValueChanged((value) => {
    if (value !== list) {
      setList(value as iListItem[]);
    }
  });

  const inputType = useMemo(() => {
    if (parameters.inputType === "url") {
      return "url";
    }
    return "text";
  }, [parameters.inputType]);

  const resetNewValue = () => {
    setNewItem({
      id: uuidv4(),
      value: "",
      type: "",
      index: 0,
    } as iListItem);
  };

  const doValidation = useCallback(() => {
    let isValid = true;
    if (newItem.value.length === 0) {
      isValid = false;
      setvalidation((prev) => ({
        ...prev,
        value: {
          valid: false,
          message: "Required",
        },
      }));
    } else if (inputType === "url" && !isValidWebsite(newItem.value)) {
      isValid = false;
      setvalidation((prev) => ({
        ...prev,
        value: {
          valid: false,
          message: "Invalid Format",
        },
      }));
    } else {
      setvalidation((prev) => ({
        ...prev,
        value: {
          valid: true,
          message: "",
        },
      }));
    }

    if (newItem.type.length === 0) {
      isValid = false;
      setvalidation((prev) => ({
        ...prev,
        type: {
          valid: false,
          message: "Required",
        },
      }));
    } else {
      setvalidation((prev) => ({
        ...prev,
        type: {
          valid: true,
          message: "",
        },
      }));
    }

    return isValid;
  }, [inputType, newItem.value, newItem.type]);

  useEffect(() => {
    doValidation();
  }, [doValidation]);

  const onDeleteHandler = (id: string) => {
    const newList = list.filter((item) => item.id !== id);
    newList.forEach((item, index) => ({
      ...item,
      index: index,
    }));
    props.sdk.field.setValue(newList);
  };

  const onCancelAddHandler = () => {
    resetNewValue();
  };

  const onChangeValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const isValid = () => {
    return !Object.values(validation).some((item) => !item.valid);
  };

  const onSaveHandler = () => {
    if (isValid()) {
      const newList = [
        ...list,
        {
          ...newItem,
          index: list.length,
        } as iListItem,
      ];
      props.sdk.field.setValue(newList);
      resetNewValue();
    }
  };

  return (
    <Box>
      {list
        .sort((a, b) => a.index - b.index)
        .map((item) => {
          return (
            <Flex
              key={item.id}
              justifyContent="space-between"
              alignItems="center"
              fullWidth={true}
              gap="spacingS"
            >
              <Flex
                justifyContent="space-between"
                alignItems="center"
                fullWidth={true}
                gap="spacingS"
              >
                <Box>{item.value}</Box>
                <Box>{item.type}</Box>
              </Flex>

              <Box>
                <IconButton
                  variant="transparent"
                  aria-label="Delete"
                  size="small"
                  icon={<DeleteIcon />}
                  onClick={onDeleteHandler.bind(this, item.id)}
                />
              </Box>
            </Flex>
          );
        })}
      <Flex
        key={newItem.id}
        justifyContent="space-between"
        alignItems="center"
        fullWidth={true}
        gap="spacingS"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          fullWidth={true}
          gap="spacingS"
        >
          <Box style={{ width: "100%" }}>
            <TextInput
              aria-label={parameters.label}
              placeholder={parameters.label}
              type={inputType}
              onChange={onChangeValueHandler}
              value={newItem.value}
              name="value"
              isInvalid={!validation.value.valid}
            />
          </Box>
          <Box style={{ width: "100%" }}>
            <TextInput
              aria-label="Type"
              placeholder="Type"
              type="text"
              onChange={onChangeValueHandler}
              value={newItem.type}
              name="type"
              isInvalid={!validation.type.valid}
            />
          </Box>
        </Flex>
        <Flex justifyContent="flex-end" alignItems="flex-end" gap="spacingS">
          <Box>
            <IconButton
              variant="positive"
              aria-label="Add"
              size="small"
              icon={<PlusIcon />}
              onClick={onSaveHandler}
            />
          </Box>
          <Box>
            <IconButton
              variant="negative"
              aria-label="Clear"
              size="small"
              icon={<CloseIcon />}
              onClick={onCancelAddHandler}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RepeaterFieldAndType;
