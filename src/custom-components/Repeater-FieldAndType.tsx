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
  EditIcon,
  DoneIcon,
  PlusIcon,
  ArrowUpTrimmedIcon,
  ArrowDownIcon,
} from "@contentful/f36-icons";
import { iFieldProps, iRepeaterParameters, iListItem } from "../models";
import { isValidWebsite, isValideEmail } from "../utils";

const RepeaterFieldAndType = (props: iFieldProps) => {
  const parameters = props.sdk.parameters.instance as iRepeaterParameters;
  const [list, setList] = useState(props.sdk.field.getValue() as iListItem[]);
  const [editItem, setEditItem] = useState<iListItem | undefined>(undefined);

  const [validation, setValidation] = useState({
    value: {
      valid: false,
      message: "Required",
    },
    type: {
      valid: true,
      message: "",
    },
  });
  const [editItemValidation, setEditItemValidation] = useState({
    value: {
      valid: true,
      message: "",
    },
    type: {
      valid: true,
      message: "",
    },
  });

  const [newItem, setNewItem] = useState({
    id: uuidv4(),
    value: "",
    type: "",
    index: 0,
  } as iListItem);

  useEffect(() => {
    if (typeof list === "undefined") {
      props.sdk.field.setValue([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const isValid = (validation: any) =>
    !Object.values(validation).some((item: any) => !item.valid);

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

  const doValidation = useCallback(
    (item) => {
      let newValidation = {
        value: {
          valid: true,
          message: "",
        },
        type: {
          valid: true,
          message: "",
        },
      };
      if (item) {
        if (item.value.length === 0) {
          newValidation = {
            ...newValidation,
            value: {
              valid: false,
              message: "Required",
            },
          };
        } else if (inputType === "url" && !isValidWebsite(item.value)) {
          newValidation = {
            ...newValidation,
            value: {
              valid: false,
              message: "Invalid Format",
            },
          };
        } else if (inputType === "email" && !isValideEmail(item.value)) {
          newValidation = {
            ...newValidation,
            value: {
              valid: false,
              message: "Invalid Format",
            },
          };
        }

        // if (item.type.length === 0) {
        //   newValidation = {
        //     ...newValidation,
        //     type: {
        //       valid: false,
        //       message: "Required",
        //     },
        //   };
        // }
      }

      return newValidation;
    },
    [inputType]
  );

  useEffect(() => {
    const newValidation = doValidation(newItem);
    setValidation(newValidation);
  }, [doValidation, newItem]);

  useEffect(() => {
    const newValidation = doValidation(editItem);
    setEditItemValidation(newValidation);
  }, [doValidation, editItem]);

  const onEditStartHandler = (id: string) => {
    const item = list.find((item) => item.id === id);
    setEditItem(item);
  };

  const onCancelEditHandler = () => {
    setEditItem(undefined);
  };

  const onChangeEditItemValueHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditItem(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as iListItem)
    );
  };

  const onEditSaveHandler = () => {
    if (isValid(editItemValidation)) {
      const newList = [...list];
      const item = newList.find((item) => item.id === editItem?.id);
      if (item && editItem) {
        item.value = editItem.value;
        item.type = editItem.type;
        props.sdk.field.setValue(newList);
        setEditItem(undefined);
      }
    }
  };

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

  const onSaveHandler = () => {
    if (isValid(validation)) {
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
                        isDisabled={item.index === 0 || Boolean(editItem)}
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
                        isDisabled={
                          item.index === (list || []).length - 1 ||
                          Boolean(editItem)
                        }
                      />
                    </Stack>
                  </TableCell>
                  <TableCell
                    style={{ wordBreak: "break-all", verticalAlign: "middle" }}
                  >
                    {typeof editItem !== "undefined" &&
                    editItem.id === item.id ? (
                      <TextInput
                        aria-label={`Edit ${parameters.label}`}
                        placeholder={`Edit ${parameters.label}`}
                        type={inputType}
                        onChange={onChangeEditItemValueHandler}
                        value={editItem.value}
                        name="value"
                        isInvalid={!editItemValidation.value.valid}
                      />
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {typeof editItem !== "undefined" &&
                    editItem.id === item.id ? (
                      <TextInput
                        aria-label={`Edit Type`}
                        placeholder={`Edit Type`}
                        type="text"
                        onChange={onChangeEditItemValueHandler}
                        value={editItem.type}
                        name="type"
                        isInvalid={!editItemValidation.type.valid}
                      />
                    ) : (
                      <span>{item.type}</span>
                    )}
                  </TableCell>
                  <TableCell align="right" style={{ verticalAlign: "middle" }}>
                    {typeof editItem !== "undefined" &&
                    editItem.id === item.id ? (
                      <ButtonGroup>
                        <IconButton
                          variant="transparent"
                          aria-label="Save"
                          size="small"
                          icon={<DoneIcon />}
                          onClick={onEditSaveHandler}
                          isDisabled={!isValid(editItemValidation)}
                        />
                        <IconButton
                          variant="transparent"
                          aria-label="Cancel Edit"
                          size="small"
                          icon={<CloseIcon />}
                          onClick={onCancelEditHandler}
                        />
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup>
                        <IconButton
                          variant="transparent"
                          aria-label="Edit"
                          size="small"
                          icon={<EditIcon />}
                          isDisabled={Boolean(editItem)}
                          onClick={onEditStartHandler.bind(this, item.id)}
                        />
                        <IconButton
                          variant="transparent"
                          aria-label="Delete"
                          size="small"
                          icon={<DeleteIcon />}
                          isDisabled={Boolean(editItem)}
                          onClick={onDeleteHandler.bind(this, item.id)}
                        />
                      </ButtonGroup>
                    )}
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
                    variant="transparent"
                    aria-label="Add"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={onSaveHandler}
                    isDisabled={!isValid(validation)}
                  />
                  <IconButton
                    variant="transparent"
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
