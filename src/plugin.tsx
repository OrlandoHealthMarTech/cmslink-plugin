import { Builder } from "@builder.io/react";
import CMSLink from "./components/CMSLink";
import { pluginId } from "./utils";

Builder.registerEditor({
  name: "CMSLink",
  component: CMSLink,
  inputs: [
    {
      name: "defaultType",
      type: "string",
      defaultValue: "model",
    },
    {
      name: "apiKey",
      type: "string",
      required: true,
      helperText: "Enter your API key",
    },
    {
      name: "showDebug",
      type: "boolean",
      defaultValue: false,
      helperText: "Enable debug mode",
    },
  ],
});
