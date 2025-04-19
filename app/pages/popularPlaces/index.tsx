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
import MultiSelectDropdown from "@/components/filterDropdown";
import { useState } from "react";

export default function PopularPlacesScreen() {
  const popularPlacesList = useSelector(
    (state: any) => state.events.popularPlaces
  );
  const [value, setValue] = useState<string[]>();
  const [items, setItems] = useState([
    { label: "Entertainment", value: "tourist_attraction" },
    { label: "restaurant", value: "restaurant" },
    { label: "Historical", value: "historical_place " },
  ]);

  const filteredEvents = popularPlacesList?.filter((item: any) => {
    const hasCommonType = item?.types?.some((type: string) =>
      value?.includes(type)
    );
    return hasCommonType;
  });

  console.log("filteredEvents", filteredEvents);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedText type="subtitle">Popular Places</ThemedText>
      <MultiSelectDropdown
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
      />
      <SafeAreaView style={{ minHeight: 155 }}>
        {value
          ? filteredEvents?.map((item: any) => (
              <View key={item.id}>
                <PopularListCard item={item} />
              </View>
            ))
          : popularPlacesList?.map((item: any) => (
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
