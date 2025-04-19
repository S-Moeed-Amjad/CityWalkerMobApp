import {
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  FlatList,
  View,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import PopularListCard from "@/components/PopularListingCard";
import { useSelector } from "react-redux";

export default function SavedPlacesScreen() {
  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedText type="subtitle">Saved Places</ThemedText>
      <SafeAreaView>
        {savedPlaces?.map((item: any) => (
          <View key={item.id}>
            <PopularListCard item={item} />
          </View>
        ))}
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
