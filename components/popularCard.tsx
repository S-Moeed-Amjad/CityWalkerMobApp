import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { ThemedText } from "./ThemedText";
import { addSavedPlace, removeSavedPlace } from "@/store/eventSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { useSavePlaceActions } from "@/utils/utils";

const { width } = Dimensions.get("window");

const Card = ({ item }: any, key?: any) => {
  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  const savedIds = savedPlaces?.map((item: any) => {
    return item?.id;
  });
  const [error, setError] = useState(false);
  const router = useRouter();
  const { savePlace, unsavePlace } = useSavePlaceActions();
  return (
    <View style={{ maxWidth: width * 0.7, overflow: "hidden" }}>
      <TouchableOpacity
        key={key}
        style={styles.card}
        onPress={() => {
          router.push({
            pathname: `/pages/popularPlaces/[id]`,
            params: {
              id: item.id,
              title: item.title,
            },
          });
        }}
      >
        <Image //image background
          source={{
            uri: error
              ? "https://via.placeholder.com/150?text=No+Image"
              : item?.imageUrl,
          }}
          onError={() => setError(true)}
          // style={{ width: 300, height: 200, borderRadius: 10 }}
          resizeMode="cover"
          style={styles?.image}
        />
        <TouchableOpacity //heart icon to save
          onPress={() => {
            savedIds.includes(item?.id)
              ? unsavePlace(item?.id)
              : savePlace(item);
          }}
          key={key}
          style={styles.heartIcon}
        >
          {savedIds.includes(item?.id) ? (
            <FontAwesomeIcon icon={faHeart} size={20} color="red" />
          ) : (
            <FontAwesomeIcon icon={faHeartRegular} size={24} color="red" />
          )}
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
    marginRight: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.7, // Card width is 80% of screen width
  },
  image: {
    width: "100%",
    height: 150,
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

export default Card;
