import * as React from "react";
import { ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";

const SvgComponent = (props: {
  style?: Exclude<ViewProps["style"], undefined> & {
    fill?: string;
    stroke?: string;
  };
}) => (
  <Svg viewBox="0 0 315 315" {...props}>
    <Path d="M307.5 53.5H81V41a7.5 7.5 0 0 0-7.5-7.5h-36A7.5 7.5 0 0 0 30 41v12.5H7.5A7.5 7.5 0 0 0 0 61v213a7.5 7.5 0 0 0 7.5 7.5h300a7.5 7.5 0 0 0 7.5-7.5V61a7.5 7.5 0 0 0-7.5-7.5zM45 48.5h21v5H45v-5zm255 218H15v-198h285v198z" />
    <Path d="M157.5 228.5c36.117 0 65.5-29.383 65.5-65.5s-29.383-65.5-65.5-65.5S92 126.883 92 163s29.383 65.5 65.5 65.5zm0-116c27.846 0 50.5 22.654 50.5 50.5s-22.654 50.5-50.5 50.5S107 190.846 107 163s22.654-50.5 50.5-50.5z" />
    <Path d="M157.5 203.5c22.332 0 40.5-18.169 40.5-40.5s-18.168-40.5-40.5-40.5S117 140.669 117 163s18.168 40.5 40.5 40.5zm0-66c14.061 0 25.5 11.439 25.5 25.5s-11.439 25.5-25.5 25.5S132 177.061 132 163s11.439-25.5 25.5-25.5zM245.5 130.5h32a7.5 7.5 0 0 0 7.5-7.5V91a7.5 7.5 0 0 0-7.5-7.5h-32A7.5 7.5 0 0 0 238 91v32a7.5 7.5 0 0 0 7.5 7.5zm7.5-32h17v17h-17v-17zM38.5 230.5h29A7.5 7.5 0 0 0 75 223a7.5 7.5 0 0 0-7.5-7.5h-29A7.5 7.5 0 0 0 31 223a7.5 7.5 0 0 0 7.5 7.5zM38.5 251.5h29A7.5 7.5 0 0 0 75 244a7.5 7.5 0 0 0-7.5-7.5h-29A7.5 7.5 0 0 0 31 244a7.5 7.5 0 0 0 7.5 7.5z" />
  </Svg>
);

export default SvgComponent;
