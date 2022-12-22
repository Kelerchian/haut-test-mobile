import { InAppGallery } from "agents/gallery";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import * as ExpoImageManipulator from "expo-image-manipulator";
import { FlipType, ImageResult } from "expo-image-manipulator";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useBackhandler } from "utils/backhandlerHook";
import { CameraAndPermissionManager } from "../agents/cameraAndPermission";

const PREFERRED_RATIO = "1:1";

export const InAppCamera = (props: {
  gallery: InAppGallery;
  onPicture: (pic: CameraCapturedPicture) => unknown;
  onBack: () => unknown;
}) => {
  const camAndPermManager = CameraAndPermissionManager.use();

  useEffect(() => {
    camAndPermManager.checkAndRequestPermission();
  }, []);

  const isAuthorized = camAndPermManager.isAuthorizedToUseCamera();
  const isRequesting = camAndPermManager.isRequestingPermission();
  return (
    <>
      {isRequesting && <RequestingPermissionNotice />}
      {!isRequesting && (
        <>
          {isAuthorized === false && (
            <PermissionDeniedNotice
              onRetry={() => camAndPermManager.checkAndRequestPermission()}
            />
          )}
          {isAuthorized === true && (
            <CameraOnPhase {...props} onBack={props.onBack} />
          )}
        </>
      )}
    </>
  );
};

const RequestingPermissionNotice = () => <Text>RequestingPermission</Text>;
const PermissionDeniedNotice = (props: { onRetry: () => unknown }) => (
  <>
    <Text>Permission Denied</Text>
    <Text>
      [Explain here why the user needs to approve the permission and for them to
      click the button]
    </Text>
    <Button title="Request Permission" onPress={() => {}}>
      Request Permission
    </Button>
  </>
);

const useMirroredPhoto = (lastPhoto: CameraCapturedPicture | null) => {
  const [mirroredLastPhoto, setMirroredLastPhoto] =
    useState<ImageResult | null>(null);
  useEffect(() => {
    if (!lastPhoto) return;
    (async () => {
      const mirroredLastPhoto = await ExpoImageManipulator.manipulateAsync(
        lastPhoto.uri,
        [
          {
            flip: FlipType.Horizontal,
          },
        ]
      );
      setMirroredLastPhoto(mirroredLastPhoto);
    })();
  }, [lastPhoto?.uri]);
  return mirroredLastPhoto;
};

const CameraOnPhase = (props: {
  gallery: InAppGallery;
  onPicture: (pic: CameraCapturedPicture) => unknown;
  onBack: () => unknown;
}) => {
  const width = useWindowDimensions().width;
  const [camera, setCamera] = useState<null | Camera>(null);
  const [ready, setReady] = useState(false);
  const [ratio, setRatio] = useState<undefined | string>(undefined);

  const mirroredLastPhoto = useMirroredPhoto(props.gallery.getLastPhoto());

  const [superimpose, setSuperimpose] = useState(false);

  useBackhandler(props.onBack);

  useEffect(() => {
    // `getSupportedRatiosAsync` will reject if camera is not ready
    if (!camera || !ready) return;
    // Get preferred ratio
    (async () => {
      const ratios = await camera.getSupportedRatiosAsync();
      const preferredRatio =
        ratios.filter((ratio) => ratio === PREFERRED_RATIO)[0] ||
        ratios[0] ||
        undefined;
      setRatio(preferredRatio);
    })();
  }, [camera, ready]);

  const heightByRatio = useMemo(() => {
    if (!ratio) return width;

    const [hR, wR] = (() => {
      const [h, w] = ratio.split(":");
      return [Number(h), Number(w)];
    })();
    if (Number.isNaN(hR)) return width;
    if (Number.isNaN(wR)) return width;

    const height = (hR / wR) * width;
    return height;
  }, [ratio]);

  return (
    <View
      style={{
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      {mirroredLastPhoto && (
        <View style={{ zIndex: 3 }}>
          <Text>You have another photo you can superimpose with:</Text>
          <Button
            title={`Toggle Superimpose: ${superimpose ? "On" : "Off"}`}
            onPress={() => setSuperimpose(!superimpose)}
          />
        </View>
      )}
      <View
        style={{
          ...styles.absoluteFullFrame,
          justifyContent: "center",
          position: "absolute",
        }}
      >
        {/* Crop view to 1:1 because some camera cannot be forced to have 1:1 ratio */}
        <View
          style={{
            width: width,
            height: width,
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {mirroredLastPhoto && superimpose && (
            <Image
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: 0.4,
                zIndex: 2,
              }}
              source={mirroredLastPhoto}
            />
          )}
          <Camera
            ratio={ratio}
            style={{ width, height: heightByRatio }}
            type={CameraType.front}
            onCameraReady={() => {
              setReady(true);
            }}
            ref={(ref) => {
              setCamera(ref);
            }}
          />
          <View
            style={{
              flexDirection: "column-reverse",
              width: "100%",
              position: "absolute",
              bottom: 20,
              left: 0,
              zIndex: 3,
            }}
          >
            <Button
              title="Take Picture"
              onPress={async () => {
                if (!camera) return;
                props.onPicture(
                  await camera.takePictureAsync({
                    // Doesn't quite work, at least on my phone
                    isImageMirror: true,
                  })
                );
              }}
            >
              <Text>Take Picture</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFullFrame: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
});
