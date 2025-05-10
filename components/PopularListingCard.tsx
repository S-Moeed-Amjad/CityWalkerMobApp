import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { useSavePlaceActions } from "@/utils/utils";

const { width } = Dimensions.get("window");

const PopularListCard = ({
  item,
  isSaveable = true,
}: {
  item: any;
  isSaveable?: boolean;
}) => {
  const { savePlace, unsavePlace } = useSavePlaceActions();
  const router = useRouter();

  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  const savedIds = savedPlaces?.map((savedItem: any) => savedItem?.id);

  const handlePress = () => {
    router.push({
      pathname: isSaveable ? `/pages/popularPlaces/[id]` : `/pages/events/[id]`,
      params: {
        id: item.id,
        title: item.title,
      },
    });
  };

  const handleLongPress = () => {
    savedIds.includes(item?.id) ? unsavePlace(item?.id) : savePlace(item);
  };

  return (
    <View style={{ maxWidth: width, overflow: "hidden" }}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress} //redirects to detail page
        onLongPress={isSaveable ? handleLongPress : () => {}}
      >
        <View style={{ position: "relative", width: "100%" }}>
          <Image //background Image
            source={{
              uri: isSaveable ? item?.imageUrl : item?.xlargeimageurl,
            }}
            resizeMode="cover"
            style={styles.image}
          />
          <Text style={styles.overlayTitle}>{item?.title}</Text>
          {isSaveable && ( //conditional rendering for the heart icon to generalize the component
            <TouchableOpacity
              onPress={() =>
                savedIds.includes(item?.id)
                  ? unsavePlace(item?.id)
                  : savePlace(item)
              }
              style={styles.heartIcon}
            >
              <FontAwesomeIcon
                icon={savedIds.includes(item?.id) ? faHeart : faHeartRegular}
                size={24}
                color="red"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 0,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    width: width * 0.83,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 1,
    right: 1,
    backgroundColor: "transparent",
    padding: 5,
  },
  overlayTitle: {
    position: "absolute",
    bottom: 5,
    left: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    width: width * 0.5,
  },
});

export default PopularListCard;
