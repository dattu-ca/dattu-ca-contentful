import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  ButtonGroup,
  IconButton,
  TextInput,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from "@contentful/f36-components";
import {
  DeleteIcon,
  CloseIcon,
  PlusIcon,
  ArrowUpTrimmedIcon,
  ArrowDownIcon,
} from "@contentful/f36-icons";
import { iFieldProps, iRepeaterParameters, iListItem } from "../models";
import { isValidWebsite, isValideEmail } from "../utils";

const RepeaterFieldAndType = (props: iFieldProps) => {
  const parameters = props.sdk.parameters.instance as iRepeaterParameters;
  const [list, setList] = useState(props.sdk.field.getValue() as iListItem[]);

  useEffect(() => {
    if (typeof list === "undefined") {
      props.sdk.field.setValue([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

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
    if (value !== list && typeof value !== "undefined") {
      setList(value as iListItem[]);
    }
  });

  const inputType = useMemo(() => {
    if (parameters.inputType === "url") {
      return "url";
    } else if (parameters.inputType === "tel") {
      return "tel";
    } else if (parameters.inputType === "email") {
      return "email";
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
    } else if (inputType === "email" && !isValideEmail(newItem.value)) {
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

  const onMoveUpHandler = (id: string) => {
    const index = list.find((item) => item.id === id)?.index;
    if (typeof index !== "undefined" && index > 0) {
      const newList = [...list];
      newList[index - 1].index = index;
      newList[index].index = index - 1;
      props.sdk.field.setValue(newList.sort((a, b) => a.index - b.index));
    }
  };
  const onMoveDownHandler = (id: string) => {
    const index = list.find((item) => item.id === id)?.index;
    if (
      list.length > 1 &&
      typeof index !== "undefined" &&
      index < list.length
    ) {
      const newList = [...list];
      newList[index + 1].index = index;
      newList[index].index = index + 1;
      props.sdk.field.setValue(newList.sort((a, b) => a.index - b.index));
    }
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell style={{ width: "50%" }}>{parameters.label}</TableCell>
            <TableCell style={{ width: "30%" }}>Type</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <Fragment>
            {(list || [])
              .sort((a, b) => a.index - b.index)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    <Stack
                      flexDirection="column"
                      margin="none"
                      style={{ gap: "unset" }}
                    >
                      <IconButton
                        style={{
                          minHeight: "auto",
                          padding: 0,
                        }}
                        variant="transparent"
                        aria-label="move up"
                        size="small"
                        icon={<ArrowUpTrimmedIcon />}
                        onClick={onMoveUpHandler.bind(this, item.id)}
                        isDisabled={item.index === 0}
                      />
                      <IconButton
                        style={{
                          minHeight: "auto",
                          padding: 0,
                        }}
                        variant="transparent"
                        aria-label="move up"
                        size="small"
                        icon={<ArrowDownIcon />}
                        onClick={onMoveDownHandler.bind(this, item.id)}
                        isDisabled={item.index === (list || []).length - 1}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell
                    style={{ wordBreak: "break-all", verticalAlign: "middle" }}
                  >
                    {item.value}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {item.type}
                  </TableCell>
                  <TableCell align="right" style={{ verticalAlign: "middle" }}>
                    <IconButton
                      variant="transparent"
                      aria-label="Delete"
                      size="small"
                      icon={<DeleteIcon />}
                      onClick={onDeleteHandler.bind(this, item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell />
              <TableCell>
                <TextInput
                  aria-label={`New ${parameters.label}`}
                  placeholder={`New ${parameters.label}`}
                  type={inputType}
                  onChange={onChangeValueHandler}
                  value={newItem.value}
                  name="value"
                  isInvalid={!validation.value.valid}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  aria-label="Type"
                  placeholder="Type"
                  type="text"
                  onChange={onChangeValueHandler}
                  value={newItem.type}
                  name="type"
                  isInvalid={!validation.type.valid}
                />
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <IconButton
                    variant="positive"
                    aria-label="Add"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={onSaveHandler}
                  />
                  <IconButton
                    variant="negative"
                    aria-label="Clear"
                    size="small"
                    icon={<CloseIcon />}
                    onClick={onCancelAddHandler}
                  />
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </Fragment>
        </TableBody>
      </Table>
    </Box>
  );
};

export default RepeaterFieldAndType;
