import Slider from "@react-native-community/slider";
import { CameraCapturedPicture } from "expo-camera";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewProps,
} from "react-native";
import { useBackhandler } from "utils/backhandlerHook";
import { InAppGallery } from "../agents/gallery";
import { Frame, FrameStyles, MenuButton, MenuText } from "../components/Frame";
import IconCompare from "../icons/IconCompare";

type ComparePageControl = ReturnType<typeof useComparePageControl>;
export const useComparePageControl = () => {
  const [image1, setImage1] = useState<CameraCapturedPicture | null>(null);
  const [image2, setImage2] = useState<CameraCapturedPicture | null>(null);
  const [selection, setSelection] = useState<1 | 2>(1);
  const [comparing, setComparing] = useState(false);

  return {
    image1,
    image2,
    setImage1,
    setImage2,
    setSelection,
    selection,
    comparing,
    setComparing,
  };
};

export const ComparePage = ({
  gallery,
  onBack,
}: {
  onBack: () => unknown;
  gallery: InAppGallery;
}) => {
  useBackhandler(onBack);

  const comparePageControl = useComparePageControl();

  const { comparing, image1, image2, setComparing } = comparePageControl;

  return (
    <>
      {!comparing && (
        <CompareSelection
          gallery={gallery}
          comparePageControl={comparePageControl}
        />
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

const styles = StyleSheet.create({
  previewContainer: { flexDirection: "column", alignItems: "center" },
  previewItemList: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    padding: 20,
  },
  previewItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  selected: { borderWidth: 3, borderStyle: "solid" },
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
});

const PreviewItem = (props: {
  selected?: boolean;
  style?: ViewProps["style"];
  onPress?: () => unknown;
  image: ImageSourcePropType | null;
}) => (
  <Pressable
    style={[styles.previewItem, props.selected && styles.selected, props.style]}
    onTouchStart={props.onPress}
  >
    {props.image && <Image style={styles.boxedImage} source={props.image} />}
    {!props.image && <Text>Choose</Text>}
  </Pressable>
);

const CompareSelection = ({
  gallery,
  comparePageControl,
}: {
  gallery: InAppGallery;
  comparePageControl: ComparePageControl;
}) => {
  const {
    image1,
    image2,
    selection,
    setComparing,
    setImage1,
    setImage2,
    setSelection,
  } = comparePageControl;

  useEffect(() => {
    if (image1 && !image2) {
      setSelection(2);
    }
  }, [image1, image2]);

  const boxSide = useWindowDimensions().width / 4;
  const derivedStyles = useMemo(
    () =>
      StyleSheet.create({
        previewItem: {
          height: boxSide - 5,
          width: boxSide - 5,
        },
        galleryItem: { width: boxSide, height: boxSide },
      }),
    [boxSide]
  );

  return (
    <Frame
      menu={
        <MenuButton
          disabled={!image1 || !image2}
          onPress={() => setComparing(true)}
        >
          <IconCompare style={FrameStyles.menuButtonIcon} />
          <MenuText>Compare</MenuText>
        </MenuButton>
      }
    >
      <View style={styles.previewContainer}>
        <Text>Selected photos:</Text>
        <View style={styles.previewItemList}>
          <PreviewItem
            style={derivedStyles.previewItem}
            selected={selection === 1}
            image={image1}
            onPress={() => setSelection(1)}
          />
          {image1 && (
            <PreviewItem
              style={derivedStyles.previewItem}
              selected={selection === 2}
              image={image2}
              onPress={() => setSelection(2)}
            />
          )}
        </View>
      </View>
      <Text>Select from the pictures below:</Text>
      <View style={styles.gallery}>
        {gallery.getPhotos().map((photo) => {
          const selected =
            (selection === 1 && image1 === photo) ||
            (selection === 2 && image2 === photo);

          return (
            <PreviewItem
              key={photo.uri}
              style={{
                ...derivedStyles.galleryItem,
                ...(selected && styles.selected),
              }}
              onPress={() => {
                switch (selection) {
                  case 1:
                    return setImage1(photo);
                  case 2:
                    return setImage2(photo);
                }
              }}
              image={photo}
            />
          );
        })}
      </View>
    </Frame>
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
