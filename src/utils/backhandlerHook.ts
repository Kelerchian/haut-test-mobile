import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackhandler = (fn: () => unknown, deps: unknown[] = []) => {
  useEffect(() => {
    const fnWrapper = () => {
      fn();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", fnWrapper);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", fnWrapper);
    };
  }, deps);
};
