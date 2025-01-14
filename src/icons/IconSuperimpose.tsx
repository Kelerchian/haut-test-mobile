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
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 3.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-6Zm0 7.415A1.5 1.5 0 0 1 1 9.5v-6A1.5 1.5 0 0 1 2.5 2h10A1.5 1.5 0 0 1 14 3.5v6a1.5 1.5 0 0 1-1 1.415v.585a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 2 11.5v-.585ZM12 11v.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5V11h9Z"
      fill="currentColor"
    />
  </Svg>
);

export default SvgComponent;
