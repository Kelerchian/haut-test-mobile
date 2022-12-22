import React, { Suspense, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ComparePage } from "screens/Compare";
import { InAppCamera } from "screens/InAppCamera";
import { InAppGallery } from "../agents/gallery";

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
  galleryItem: { flexGrow: 0, flexShrink: 0 },
  image: { width: "100%", height: "100%" },
});

const HomePage = (): JSX.Element => {
  const gallery = InAppGallery.use();
  const [pageMode, setPageMode] = useState<null | "compare" | "capture">(null);

  const data = useLazyLoadQuery(HomeQuery, {}, { fetchPolicy: "network-only" });

  return (
    <>
      <Text>{JSON.stringify(data)}</Text>
      {pageMode === null && (
        <DefaultPage
          gallery={gallery}
          onComparePrompt={() => setPageMode("compare")}
          onTakePicturePrompt={() => setPageMode("capture")}
        />
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

const DefaultPage = (props: {
  gallery: InAppGallery;
  onTakePicturePrompt: () => unknown;
  onComparePrompt: () => unknown;
}) => {
  const width = useWindowDimensions().width / 4;
  return (
    <>
      {/* <Text>{JSON.stringify(data)}</Text> */}
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Button
          title="Take picture"
          onPress={() => {
            props.onTakePicturePrompt();
          }}
        >
          Take picture
        </Button>
        <Button
          title="Compare"
          onPress={() => {
            props.onComparePrompt();
          }}
        >
          Take picture
        </Button>
      </View>
      <View style={styles.gallery}>
        {props.gallery.getPhotos().map((photo) => (
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
    </>
  );
};
