import { StyleSheet, SafeAreaView, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import PopularListCard from "@/components/PopularListingCard";
import { useSelector } from "react-redux";

export default function SavedPlacesScreen() {
  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedText type="subtitle">Saved Places</ThemedText>
      {savedPlaces.length > 0 ? (
        <SafeAreaView>
          {savedPlaces?.map((item: any) => (
            <View key={item.id}>
              <PopularListCard item={item} />
            </View>
          ))}
        </SafeAreaView>
      ) : (
        <ThemedText>You have no saved places</ThemedText>
      )}{" "}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
