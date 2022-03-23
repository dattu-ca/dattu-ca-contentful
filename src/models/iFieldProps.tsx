import { PlainClientAPI } from "contentful-management";
import { FieldExtensionSDK } from "@contentful/app-sdk";

export interface iFieldProps {
  sdk: FieldExtensionSDK;
  cma: PlainClientAPI;
}