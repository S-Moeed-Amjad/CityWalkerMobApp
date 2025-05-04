import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { ThemedText } from "./ThemedText";
import { addSavedPlace, removeSavedPlace } from "@/store/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSavePlaceActions } from "@/utils/utils";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const SavedCard = ({ item }: any) => {
  const { savePlace, unsavePlace } = useSavePlaceActions();
  const router = useRouter();
  return (
    <View style={{ maxWidth: width * 0.5, overflow: "hidden" }}>
      <TouchableOpacity
        key={item?.id}
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: `/pages/popularPlaces/[id]`,
            params: {
              id: item.id,
              title: item.title,
            },
          })
        }
      >
        <Image source={{ uri: item?.imageUrl }} style={styles?.image} />
        <TouchableOpacity
          onPress={() => {
            unsavePlace(item?.id);
          }}
          style={styles.heartIcon}
        >
          <FontAwesomeIcon icon={faHeart} size={20} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
      <ThemedText type="default">{item?.title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 0,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.5,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "left",
    color: "white",
  },
  heartIcon: {
    position: "absolute",
    top: 1,
    right: 1,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 0,
  },
});

export default SavedCard;
