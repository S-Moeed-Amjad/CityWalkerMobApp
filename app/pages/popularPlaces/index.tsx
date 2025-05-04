import { StyleSheet, SafeAreaView, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import PopularListCard from "@/components/PopularListingCard";
import { useSelector } from "react-redux";
import MultiSelectDropdown from "@/components/filterDropdown";
import { useEffect, useState } from "react";

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
        {value?.length
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
