import { StyleSheet, SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
import { useState } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import PopularListCard from "@/components/PopularListingCard";
import MultiSelectDropdown from "@/components/filterDropdown";

export default function PopularPlacesScreen() {
  const popularPlacesList = useSelector(
    (state: any) => state.events.popularPlaces
  );

  const [value, setValue] = useState<string[]>();
  const [items, setItems] = useState([
    { label: "Entertainment", value: "tourist_attraction" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Historical", value: "historical_place" },
  ]);

  const filteredPlaces = popularPlacesList?.filter((item: any) => {
    return item?.types?.some((type: string) => value?.includes(type));
  });

  const renderPlaces =
    value?.length && filteredPlaces?.length > 0
      ? filteredPlaces
      : !value?.length
      ? popularPlacesList
      : [];

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
        {renderPlaces?.length > 0 ? (
          renderPlaces.map((item: any, index: number) => (
            <View key={item.id || `${item.name}-${index}`}>
              <PopularListCard item={item} />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText type="default">No places found.</ThemedText>
          </View>
        )}
      </SafeAreaView>
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
