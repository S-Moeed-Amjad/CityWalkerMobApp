import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const EventCard = ({ item }: any) => {
  const router = useRouter();

  return (
    <View style={{ maxWidth: width * 0.4, overflow: "hidden" }}>
      <TouchableOpacity
        key={item?.id}
        style={styles.card}
        onPress={() => {
          router.push({
            pathname: `/pages/events/[id]`,
            params: {
              id: item.id,
              title: item.title,
            },
          });
        }}
      >
        <Image source={{ uri: item?.xlargeimageurl }} style={styles?.image} />
      </TouchableOpacity>
      <ThemedText type="default">{item?.eventname}</ThemedText>
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
    width: width * 0.4,
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
});

export default EventCard;
