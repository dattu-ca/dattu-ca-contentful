import React, { useEffect } from "react";
import {RepeaterFieldAndType, RepeaterAddress} from "../custom-components";
import { iFieldProps, iRepeaterParameters } from "../models";

const Field = (props: iFieldProps) => {
  const location = window.location.href.split("/").pop() as string;
  useEffect(() => props.sdk.window.startAutoResizer(), [props.sdk.window]);

  const parameters: iRepeaterParameters = props.sdk.parameters
    .instance as iRepeaterParameters;

  switch (location) {
    case "repeater-field": {
      switch (parameters.inputType) {
        case "url":
        case "email":
        case "tel":
          console.log("parameters.inputType", parameters.inputType);
          return <RepeaterFieldAndType {...props} />;
        default:
          return null;
      }
    }
    case "repeater-address":{
      return <RepeaterAddress {...props} />;
    }
    default:
      return null;
  }
};

export default Field;
