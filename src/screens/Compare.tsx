import Slider from "@react-native-community/slider";
import { CameraCapturedPicture } from "expo-camera";
import { useMemo, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useBackhandler } from "utils/backhandlerHook";
import { InAppGallery } from "../agents/gallery";

export const ComparePage = ({
  gallery,
  onBack,
}: {
  onBack: () => unknown;
  gallery: InAppGallery;
}) => {
  const [image1, setImage1] = useState<CameraCapturedPicture | null>(null);
  const [image2, setImage2] = useState<CameraCapturedPicture | null>(null);
  const [selection, setSelection] = useState<1 | 2>(1);
  const [comparing, setComparing] = useState(false);

  useBackhandler(onBack);

  const boxSide = useWindowDimensions().width / 4;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        previewContainer: { height: boxSide, flexDirection: "row" },
        previewItem: { height: boxSide, width: boxSide },
        notSelected: { borderWidth: 1, borderStyle: "dotted" },
        selected: { borderWidth: 1, borderStyle: "solid" },
        image1: { borderColor: "red" },
        image2: { borderColor: "orange" },
        boxedImage: { height: "100%", width: "100%" },
        gallery: {
          flexGrow: 1,
          flexShrink: 1,
          overflow: "scroll",
          flexDirection: "row",
          flexWrap: "wrap",
        },
        galleryItem: { width: boxSide, height: boxSide },
      }),
    [boxSide]
  );

  const image1BorderStyle =
    (selection === 1 && styles.selected) || styles.notSelected;
  const image2BorderStyle =
    (selection === 2 && styles.selected) || styles.notSelected;

  return (
    <>
      {!comparing && (
        <View>
          <View style={styles.previewContainer}>
            <View
              style={{
                ...styles.previewItem,
                ...styles.image1,
                ...image1BorderStyle,
              }}
              onTouchStart={() => setSelection(1)}
            >
              {image1 && <Image style={styles.boxedImage} source={image1} />}
              {!image1 && <Text>Click to select</Text>}
            </View>
            <View
              style={{
                ...styles.previewItem,
                ...styles.image2,
                ...image2BorderStyle,
              }}
              onTouchStart={() => setSelection(2)}
            >
              {image2 && <Image style={styles.boxedImage} source={image2} />}
              {!image2 && <Text>Click to select</Text>}
            </View>
            <Button
              title="Compare"
              disabled={!image1 || !image2}
              onPress={() => setComparing(true)}
            >
              Compare
            </Button>
          </View>
          <View style={styles.gallery}>
            {gallery.getPhotos().map((photo) => {
              const photoIsSelectedAsImage1 = photo === image1;
              const photoIsSelectedAsImage2 = photo === image2;

              const photoFrameStyle = (() => {
                if (photoIsSelectedAsImage1) {
                  return { ...styles.image1, ...image1BorderStyle };
                }

                if (photoIsSelectedAsImage2) {
                  return { ...styles.image2, ...image2BorderStyle };
                }

                return {};
              })();

              return (
                <View
                  key={photo.uri}
                  style={{ ...styles.galleryItem, ...photoFrameStyle }}
                  onTouchStart={() => {
                    switch (selection) {
                      case 1:
                        return setImage1(photo);
                      case 2:
                        return setImage2(photo);
                    }
                  }}
                >
                  <Image source={photo} style={styles.boxedImage} />
                </View>
              );
            })}
          </View>
        </View>
      )}
      {comparing && image1 && image2 && (
        <CompareScreen
          onBack={() => {
            setComparing(false);
          }}
          image1={image1}
          image2={image2}
        />
      )}
    </>
  );
};

const CompareScreen = (props: {
  onBack: () => unknown;
  image1: CameraCapturedPicture;
  image2: CameraCapturedPicture;
}) => {
  const [sideBySideMode, setSideBySide] = useState(false);
  const [opacity, setOpacity] = useState(0.2);
  const windowWidth = useWindowDimensions().width;
  useBackhandler(props.onBack);
  return (
    <>
      <View>
        {!sideBySideMode && (
          <>
            <View
              style={{
                width: windowWidth,
                height: windowWidth,
                position: "relative",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%", opacity: 1 - opacity }}
                source={props.image1}
              />
            </View>
            <View
              style={{
                width: windowWidth,
                height: windowWidth,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Image
                style={{ width: "100%", height: "100%", opacity: opacity }}
                source={props.image2}
              />
            </View>
            <View
              style={{
                position: "relative",
                padding: "5%",
              }}
            >
              <Slider
                step={0.1}
                value={opacity}
                onValueChange={(value) => {
                  if (typeof value === "number") {
                    setOpacity(value);
                  } else {
                    const num = value[0];
                    if (num) {
                      setOpacity(num);
                    }
                  }
                }}
              />
              <Text>
                Use this slider to fade in-between picture you have chosen
              </Text>
            </View>
          </>
        )}
        {sideBySideMode && (
          <View
            style={{
              width: windowWidth,
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                width: windowWidth / 2,
                height: windowWidth / 2,
              }}
              source={props.image1}
            />
            <Image
              style={{
                width: windowWidth / 2,
                height: windowWidth / 2,
              }}
              source={props.image2}
            />
          </View>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <Button
          onPress={() => setSideBySide(!sideBySideMode)}
          title={
            sideBySideMode
              ? "Switch to superimposed mode"
              : "Switch to side-by-side mode"
          }
        />
      </View>
    </>
  );
};
