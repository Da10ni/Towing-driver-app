declare module "react-native-flags" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface FlagProps extends ViewProps {
    code: string;
    size?: number;
    type?: "flat" | "shiny";
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
