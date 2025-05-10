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
        <SafeAreaView style={{ minHeight: 155 }}>
          {savedPlaces.map((item: any, index: number) => (
            <View key={item.id || `${item.title}-${index}`}>
              <PopularListCard item={item} />
            </View>
          ))}
        </SafeAreaView>
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText type="default">You have no saved places.</ThemedText>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});
