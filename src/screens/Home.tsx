import React, { Suspense, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ComparePage } from "screens/Compare";
import { InAppCamera } from "screens/InAppCamera";
import { InAppGallery } from "../agents/gallery";
import { Frame, FrameStyles, MenuButton, MenuText } from "../components/Frame";
import IconCamera from "../icons/IconCamera";
import IconCompare from "../icons/IconCompare";

const HomeQuery = graphql`
  query HomeQuery {
    dummy
  }
`;

export default function Home(): JSX.Element {
  return (
    <Suspense fallback={<ActivityIndicator />}>
      <HomePage />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  gallery: { flexDirection: "row", flexWrap: "wrap" },
  galleryEmpty: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  galleryItem: { flexGrow: 0, flexShrink: 0 },
  image: { width: "100%", height: "100%" },
});

const RelayCallExample = () => {
  return (
    <Suspense fallback={<Text>Failed to call network</Text>}>
      <RelayCallExampleImpl />
    </Suspense>
  );
};

const RelayCallExampleImpl = () => {
  const data = useLazyLoadQuery(HomeQuery, {}, { fetchPolicy: "network-only" });
  return <Text>{JSON.stringify(data)}</Text>;
};

const HomePage = (): JSX.Element => {
  const gallery = InAppGallery.use();
  const [pageMode, setPageMode] = useState<null | "compare" | "capture">(null);

  return (
    <>
      {pageMode === null && (
        <Frame
          menu={
            <MenuButtons
              gallery={gallery}
              onComparePrompt={() => setPageMode("compare")}
              onTakePicturePrompt={() => setPageMode("capture")}
            />
          }
        >
          <RelayCallExample />
          <GalleryShowcase
            gallery={gallery}
            onTakeAPicture={() => {
              setPageMode("capture");
            }}
          />
        </Frame>
      )}
      {pageMode === "compare" && (
        <ComparePage onBack={() => setPageMode(null)} gallery={gallery} />
      )}
      {pageMode === "capture" && (
        <InAppCamera
          gallery={gallery}
          onBack={() => setPageMode(null)}
          onPicture={(pic) => {
            gallery.addToGallery(pic);
            setPageMode(null);
          }}
        />
      )}
    </>
  );
};

const GalleryShowcase = (props: {
  gallery: InAppGallery;
  onTakeAPicture: () => unknown;
}) => {
  const width = useWindowDimensions().width / 4;
  const photos = props.gallery.getPhotos();
  return (
    <>
      {photos.length === 0 && (
        <Pressable
          style={styles.galleryEmpty}
          onPress={() => props.onTakeAPicture()}
        >
          <Text>Your photos will appear here. Take a picture!</Text>
        </Pressable>
      )}
      {photos.length > 0 && (
        <View style={styles.gallery}>
          {photos.map((photo) => (
            <View
              key={photo.uri}
              style={{
                ...styles.galleryItem,
                width: width,
                height: width,
              }}
            >
              <Image style={styles.image} source={photo} />
            </View>
          ))}
        </View>
      )}
    </>
  );
};

const MenuButtons = (props: {
  gallery: InAppGallery;
  onTakePicturePrompt: () => unknown;
  onComparePrompt: () => unknown;
}) => {
  return (
    <>
      <MenuButton
        onPress={() => {
          props.onTakePicturePrompt();
        }}
      >
        <IconCamera style={FrameStyles.menuButtonIcon} />
        <MenuText>Take picture</MenuText>
      </MenuButton>
      {props.gallery.getPhotos().length > 0 && (
        <MenuButton
          onPress={() => {
            props.onComparePrompt();
          }}
        >
          <IconCompare style={FrameStyles.menuButtonIcon} />
          <MenuText>Compare</MenuText>
        </MenuButton>
      )}
    </>
  );
};
