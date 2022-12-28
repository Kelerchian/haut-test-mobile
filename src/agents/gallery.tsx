import { CameraCapturedPicture } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ExpoImageManipulator from "expo-image-manipulator";
import { FlipType, SaveFormat } from "expo-image-manipulator";
import { useEffect, useMemo, useState } from "react";
import { SimpleEvent } from "utils/event";
import backendJson from "../utils/backEnd.json";

const postImageToBackend = ({ uri }: { uri: string }) => {
  const fetchURL = `http://${backendJson.url}/upload`;

  // fetch("http://192.168.1.6:3030/graphiql")
  //   .then((res) => {
  //     console.log("adsfasdfasdf");
  //     console.log(res);
  //   })
  //   .catch((error) => {
  //     console.log("adsfasdfasdf-errorororororo");
  //     console.error(error);
  //   });

  FileSystem.uploadAsync(`http://192.168.1.6:3030/upload`, uri, {
    fieldName: "file",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    mimeType: "image/png",
  })
    .then((res) => {
      console.log("success", res);
    })
    .catch((err) => {
      console.error("error", err);
    });
  // fetch(`http://192.168.1.6:3030/upload`, {
  //   method: "post",
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  //   body: formData,
  // })
  //   .then((result) => {
  //     console.log(result);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     console.error(222, "23233333333");
  //   });
};

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

      ExpoImageManipulator.manipulateAsync(
        pic.uri,
        [
          {
            flip: FlipType.Horizontal,
          },
        ],
        {
          format: SaveFormat.PNG,
          base64: true,
        }
      )
        .then((res) => {
          postImageToBackend({ uri: res.uri });
        })
        .catch((err) => console.error("errrrrrr", err.message));
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
