import { CameraCapturedPicture } from "expo-camera";
import { useEffect, useMemo, useState } from "react";
import { SimpleEvent } from "utils/event";

export type InAppGallery = ReturnType<typeof InAppGallery["make"]>;
export namespace InAppGallery {
  export const make = () => {
    const events = {
      change: SimpleEvent.make(),
    };
    const emitChange = () => events.change.publish();

    const photos = [] as CameraCapturedPicture[];
    const addToGallery = (pic: CameraCapturedPicture) => {
      photos.push(pic);
      emitChange();
    };

    const getPhotos = () => [...photos];
    const getLastPhoto = () => photos[photos.length - 1] || null;

    return {
      events,
      id: Symbol(),
      addToGallery,
      getPhotos,
      getLastPhoto,
    };
  };

  export const use = (deps: unknown[] = []) => {
    const memoized = useMemo(() => make(), deps);
    const [state, setState] = useState(memoized);
    useEffect(() => {
      const unsub = () =>
        memoized.events.change.subscribe(() => {
          setState({ ...state });
        });
      return () => {
        unsub();
      };
    }, [memoized.id]);
    return state;
  };
}
