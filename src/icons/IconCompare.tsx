import * as React from "react";
import { ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";

const SvgComponent = (props: {
  style?: Exclude<ViewProps["style"], undefined> & {
    fill?: string;
    stroke?: string;
  };
}) => (
  <Svg {...props}>
    <Path d="m10.08 7 1 1 3.44-3.45L11 1l-1 1 1.8 1.8H2v1.4h9.82ZM5.86 9l-1-1-3.44 3.5L4.91 15l1-1-1.81-1.8H14v-1.4H4.1Z" />
  </Svg>
);

export default SvgComponent;
