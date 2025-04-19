import { StyleSheet, SafeAreaView, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import PopularListCard from "@/components/PopularListingCard";
import { useSelector } from "react-redux";
import MultiSelectDropdown from "@/components/filterDropdown";
import { useState } from "react";

export default function EventsScreen() {
  const events = useSelector((state: any) => state.events.events);
  const EventsList = events?.map((item: any) => {
    return { ...item, title: item?.eventname, image: item?.xlargeimageurlWebP };
  });
  const [value, setValue] = useState<string>();
  const [items, setItems] = useState([
    { label: "None", value: undefined },
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

  const filteredEvents = EventsList?.filter((item: any) => {
    return item?.EventCode === value;
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedText type="subtitle">Events Near by</ThemedText>
      <MultiSelectDropdown
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
        isMulti={false}
      />
      <SafeAreaView style={{ minHeight: 155 }}>
        {value
          ? filteredEvents?.map((item: any) => (
              <View key={item.id}>
                <PopularListCard item={item} isSaveable={false} />
              </View>
            ))
          : EventsList?.map((item: any) => (
              <View key={item.id}>
                <PopularListCard item={item} isSaveable={false} />
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
