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
  Paragraph,
  Autocomplete,
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
import { AutocompleteCountries, AutocompleteProvinces } from "../custom-fields";
import { iFieldProps, iAddressItem, Address } from "../models";

const RepeaterAddress = (props: iFieldProps) => {
  const [list, setList] = useState(
    props.sdk.field.getValue() as iAddressItem[]
  );
  const [editItem, setEditItem] = useState<iAddressItem | undefined>(undefined);
  const [newItem, setNewItem] = useState(new Address("Canada"));

  const [validation, setValidation] = useState({});
  const [editItemValidation, setEditItemValidation] = useState({});

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

  const isValid = (validation: any) =>
    !Object.values(validation).some((item: any) => !item.valid);

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

  const onChangeValueHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onChangeCountryHandler = useCallback((value: string) => {
    setNewItem((prev) => ({
      ...prev,
      country: value,
    }));
  }, []);

  const onChangeProvinceHandler = useCallback((value: string) => {
    setNewItem((prev) => ({
      ...prev,
      province: value,
    }));
  }, []);

  const onSaveHandler = () => {
    if (isValid(validation)) {
      const newAddress: iAddressItem = {
        id: uuidv4(),
        value: newItem,
        index: list.length,
        type: "Official",
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
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  </TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <IconButton
                        variant="transparent"
                        aria-label="Delete"
                        size="small"
                        icon={<DeleteIcon />}
                        isDisabled={Boolean(editItem)}
                        onClick={onDeleteHandler.bind(this, item.id)}
                      />
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell />
              <TableCell>
                <Stack flexDirection="column" spacing="spacingS">
                  <Paragraph>New Address</Paragraph>
                  <AutocompleteCountries
                    value={newItem.country}
                    onChange={onChangeCountryHandler}
                  />
                  <AutocompleteProvinces
                    country={newItem.country}
                    value={newItem.province}
                    onChange={onChangeProvinceHandler}
                  />
                  <TextInput
                    aria-label="Address Line 1"
                    placeholder="Address Line 1"
                    type="text"
                    onChange={onChangeValueHandler}
                    value={newItem.addressLine1}
                    name="addressLine1"
                  />
                  <TextInput
                    aria-label="Address Line 2"
                    placeholder="Address Line 2"
                    type="text"
                    onChange={onChangeValueHandler}
                    value={newItem.addressLine2}
                    name="addressLine2"
                  />
                  <TextInput
                    aria-label="Address Line 3"
                    placeholder="Address Line 3"
                    type="text"
                    onChange={onChangeValueHandler}
                    value={newItem.addressLine3}
                    name="addressLine3"
                  />
                  <TextInput
                    aria-label="City"
                    placeholder="City"
                    type="text"
                    onChange={onChangeValueHandler}
                    value={newItem.city}
                    name="city"
                  />
                  <TextInput
                    aria-label="Postal Code"
                    placeholder="Postal Code"
                    type="text"
                    onChange={onChangeValueHandler}
                    value={newItem.postalCode}
                    name="postalCode"
                  />
                </Stack>
              </TableCell>
              <TableCell style={{ verticalAlign: "bottom" }}>
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

export default RepeaterAddress;
