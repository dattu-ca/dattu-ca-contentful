import React, { useEffect } from "react";
import RepeaterFieldAndType from "../custom-components/Repeater-FieldAndType";
import { iFieldProps, iRepeaterParameters } from "../models";

const Field = (props: iFieldProps) => {
  const location = window.location.href.split("/").pop() as string;
  useEffect(() => props.sdk.window.startAutoResizer(), [props.sdk.window]);

  const parameters: iRepeaterParameters = props.sdk.parameters
    .instance as iRepeaterParameters;

  console.log("location", location)
  switch (location) {
    case "repeater-field": {
      console.log("parameters.inputType", parameters.inputType)
      switch (parameters.inputType) {
        case "url":
          console.log("in URL")
          return <RepeaterFieldAndType {...props} />;

        default:
          return null;
      }
    }
    default:
      return null;
  }
};

export default Field;
