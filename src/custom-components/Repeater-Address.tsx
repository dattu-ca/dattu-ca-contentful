import React, { Fragment, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  ButtonGroup,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Paragraph,
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
import { CompositeAddress } from "../custom-fields";
import { iFieldProps, iAddressItem, iAddress, Address } from "../models";

const RepeaterAddress = (props: iFieldProps) => {
  const [list, setList] = useState(
    props.sdk.field.getValue() as iAddressItem[]
  );

  const [newItem, setNewItem] = useState(new Address("Canada"));
  const [editItemId, setEditItemId] = useState<string | undefined>(undefined);
  const [editItem, setEditItem] = useState<iAddress | undefined>(undefined);

  const [newItemIsValid, setNewItemIsValid] = useState(false);
  const [editItemIsValid, setEditItemIsValid] = useState(true);

  useEffect(() => {
    if (typeof list === "undefined") {
      props.sdk.field.setValue([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  props.sdk.field.onValueChanged((value) => {
    if (value !== list && typeof value !== "undefined") {
      setList(value as iAddressItem[]);
    }
  });

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

  const resetNewItem = () => {
    setNewItem(new Address("Canada"));
  };

  const onEditStartHandler = (id: string) => {
    const item = list.find((item) => item.id === id);
    setEditItemId(item?.id);
    setEditItem(item?.value);
  };

  const onCancelEditHandler = () => {
    setEditItemId(undefined);
    setEditItem(undefined);
  };

  const onChangeEditItem = useCallback((field: string, value: string) => {
    setEditItem(
      (prev) =>
        ({
          ...prev,
          [field]: value,
        } as iAddress)
    );
  }, []);

  const onValidationChangeEditItem = useCallback((isValid: boolean) => {
    setEditItemIsValid(isValid);
  }, []);

  const onEditSaveHandler = () => {
    if (editItemIsValid) {
      const newList = [...list];
      const item = newList.find((item) => item.id === editItemId);
      if (item && editItem) {
        item.value = { ...editItem };
        props.sdk.field.setValue(newList);
        setEditItem(undefined);
        setEditItemId(undefined);
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
    resetNewItem();
  };

  const onChangeNewItem = useCallback((field: string, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const onValidationChangeNewItem = useCallback((isValid: boolean) => {
    setNewItemIsValid(isValid);
  }, []);

  const onSaveHandler = () => {
    if (newItemIsValid) {
      const newAddress: iAddressItem = {
        id: uuidv4(),
        value: newItem,
        index: list.length,
      };
      const newList: iAddressItem[] = [...list, newAddress];
      props.sdk.field.setValue(newList);
      resetNewItem();
    }
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell style={{ width: "80%" }}>Address</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <Fragment>
            {(list || [])
              .sort((a, b) => a.index - b.index)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
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
                  <TableCell>
                    {typeof editItem !== "undefined" &&
                    editItemId === item.id ? (
                      <CompositeAddress
                        item={editItem}
                        onChange={onChangeEditItem}
                        onValidationChange={onValidationChangeEditItem}
                      />
                    ) : (
                      <div>
                        <Paragraph>{item.value.country}</Paragraph>
                        <Paragraph>{item.value.province}</Paragraph>
                        <Paragraph>{item.value.addressLine1}</Paragraph>
                        <Paragraph>{item.value.addressLine2}</Paragraph>
                        <Paragraph>{item.value.addressLine3}</Paragraph>
                        <Paragraph>{item.value.city}</Paragraph>
                        <Paragraph>{item.value.postalCode}</Paragraph>
                        <Paragraph>{item.value.mapUrl}</Paragraph>
                        <Paragraph>{item.value.type}</Paragraph>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {typeof editItem !== "undefined" &&
                    editItemId === item.id ? (
                      <ButtonGroup>
                        <IconButton
                          variant="transparent"
                          aria-label="Save"
                          size="small"
                          icon={<DoneIcon />}
                          onClick={onEditSaveHandler}
                          isDisabled={!editItemIsValid}
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
                <Paragraph>New Address</Paragraph>
                <CompositeAddress
                  item={newItem}
                  onChange={onChangeNewItem}
                  onValidationChange={onValidationChangeNewItem}
                />
              </TableCell>
              <TableCell style={{ verticalAlign: "bottom" }}>
                <ButtonGroup>
                  <IconButton
                    variant="transparent"
                    aria-label="Add"
                    size="small"
                    icon={<PlusIcon />}
                    onClick={onSaveHandler}
                    isDisabled={!newItemIsValid}
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

export default RepeaterAddress;
