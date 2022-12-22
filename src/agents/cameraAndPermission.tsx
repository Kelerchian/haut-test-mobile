import { Camera } from "expo-camera";
import { useEffect, useMemo, useState } from "react";
import { SimpleEvent } from "utils/event";

export type CameraAndPermissionManager = ReturnType<
  typeof CameraAndPermissionManager["make"]
>;
export namespace CameraAndPermissionManager {
  export const make = () => {
    const events = {
      change: SimpleEvent.make(),
    };
    const emitChange = () => events.change.publish();

    const prv = {
      /**
       * Act as mutex for critical section `checkAndRequestPermission`
       */
      requestingPermissionLock: null as null | ReturnType<
        typeof checkAndRequestPermissionImpl
      >,
      /**
       * boolean when the result is known
       * null otherwise
       */
      authorized: null as null | boolean,
    };

    const checkAndRequestPermission = () => {
      // Critical section
      if (prv.requestingPermissionLock) {
        return prv.requestingPermissionLock;
      }

      const promise = checkAndRequestPermissionImpl();
      prv.requestingPermissionLock = promise;
      promise.finally(() => {
        prv.requestingPermissionLock = null;
        emitChange();
      });
      return promise;
    };

    const checkAndRequestPermissionImpl = async () => {
      prv.authorized = null;

      // Status check phase
      let camStat = (await Camera.getCameraPermissionsAsync()).granted;
      let micStat = (await Camera.getMicrophonePermissionsAsync()).granted;

      prv.authorized = camStat && micStat;
      emitChange();

      // Request phase, if any is not authorized
      camStat =
        camStat || (await Camera.requestCameraPermissionsAsync()).granted;
      micStat =
        micStat || (await Camera.requestMicrophonePermissionsAsync()).granted;

      prv.authorized = camStat && micStat;

      // device query

      emitChange();
    };

    const isAuthorizedToUseCamera = () => prv.authorized;
    const isRequestingPermission = () => prv.requestingPermissionLock !== null;

    const self = {
      id: Symbol,
      events,
      isAuthorizedToUseCamera,
      isRequestingPermission,
      checkAndRequestPermission,
    };
    return self;
  };

  export const use = (deps: unknown[] = []) => {
    const memoized = useMemo(() => make(), deps);
    const [state, setState] = useState(memoized);

    useEffect(() => {
      const unsub = memoized.events.change.subscribe(() => {
        setState({ ...memoized });
      });

      return () => {
        unsub();
      };
    }, [memoized.id]);

    return state;
  };
}
