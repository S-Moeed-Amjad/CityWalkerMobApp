import React, { useEffect } from "react";

import EventCard from "@/components/nearMeCard";
import { Dimensions, StyleSheet, View, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

const EventCarosel = ({ data }: any) => {
  const list = data?.map((item: any) => {
    return { ...item, title: item?.name, image: item?.image_url };
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {list?.map((item: any) => (
          <View key={item.id} style={styles.cardWrapper}>
            <EventCard item={item} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  cardWrapper: {
    marginRight: 12, // spacing between cards
  },
});

export default EventCarosel;
