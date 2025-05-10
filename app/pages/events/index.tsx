import { StyleSheet, SafeAreaView, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import PopularListCard from "@/components/PopularListingCard";
import { useSelector } from "react-redux";
import MultiSelectDropdown from "@/components/filterDropdown";
import { useState } from "react";

export default function EventsScreen() {
  const events = useSelector((state: any) => state.events.events);

  const EventsList = events?.map((item: any) => ({
    ...item,
    title: item?.eventname,
    image: item?.xlargeimageurlWebP,
  }));

  const [value, setValue] = useState<string>();
  const [items, setItems] = useState([
    //Filter Values
    { label: "All", value: undefined },
    { label: "Festivals", value: "FEST" },
    { label: "Live music", value: "LIVE" },
    { label: "Clubbing/Dance music", value: "CLUB" },
    { label: "Dating event", value: "DATE" },
    { label: "Theatre/Dance", value: "THEATRE" },
    { label: "Comedy", value: "COMEDY" },
    { label: "Exhibitions and Attractions", value: "EXHIB" },
    { label: "Kids/Family event", value: "KIDS" },
    { label: "Bar/Pub event", value: "BARPUB" },
    { label: "Gay/Lesbian event", value: "LGB" },
    { label: "Sporting event", value: "SPORT" },
    { label: "The Arts", value: "ARTS" },
  ]);

  const filteredEvents = EventsList?.filter((item: any) =>
    value ? item?.EventCode === value : true
  );

  const renderEvents = filteredEvents ?? [];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedText type="subtitle">Events Nearby</ThemedText>

      <MultiSelectDropdown
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
        isMulti={false}
      />

      <SafeAreaView style={{ minHeight: 155 }}>
        {renderEvents.length > 0 ? (
          renderEvents.map((item: any, index: number) => (
            <PopularListCard
              key={item.id || `${item.title}-${index}`}
              item={item}
              isSaveable={false}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText type="default">No events found.</ThemedText>
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
