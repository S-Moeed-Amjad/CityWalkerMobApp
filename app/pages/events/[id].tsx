import { Key, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useLocalSearchParams, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Feather } from "@expo/vector-icons";
import { StarRating } from "@/utils/utils";

const { width } = Dimensions.get("window");

const EventDetail = () => {
  const { id } = useLocalSearchParams();

  const events = useSelector((state: any) => state.events.events);

  const data = events?.filter((item: any) => item?.id === id);
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Can't open the link: " + url);
    }
  };

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${data[0]?.venue?.latitude},${data[0]?.venue?.longitude}&zoom=15&size=600x300&markers=color:red%7C${data[0]?.venue?.latitude},${data[0]?.venue?.longitude}&key=${process.env.EXPO_PUBLIC_API_KEY}`;

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const getDayFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${data[0]?.venue?.latitude},${data[0]?.venue?.longitude}`;
  return (
    <ScrollView showsVerticalScrollIndicator>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Back",
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <ThemedView>
        {data[0]?.xlargeimageurl?.length > 0 ? ( // Cover Image
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            <Image
              key={id as Key}
              source={{ uri: data[0]?.xlargeimageurl }}
              resizeMode="cover"
              style={styles.image}
            />
          </ScrollView>
        ) : (
          <Image
            key={id as Key}
            source={{
              uri: "https://via.placeholder.com/300x200?text=No+Image",
            }}
            resizeMode="cover"
            style={styles.image}
          />
        )}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">{data[0]?.eventname}</ThemedText>

          <ThemedText type="title">About</ThemedText>
          {
            //summary
          }
          <StarRating rating={data[0]?.venue?.rating ?? 0} />
          {
            //rating
          }
          <ThemedText type="default">{data[0]?.description}</ThemedText>
          <ThemedView style={styles.callendarContainer}>
            {
              //date and time
            }
            <Feather name="calendar" size={20} color="#40bfff" />
            <ThemedText>
              {getDayFromDate(data[0]?.date)} {data[0]?.date}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.callendarContainer}>
            <Feather name="clock" size={20} color="#40bfff" />
            <ThemedText>
              {data[0]?.openingtimes?.doorsopen} till{" "}
              {data[0]?.openingtimes?.doorsclose}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.callendarContainer}>
            {
              //min age
            }
            <Feather name="user" size={20} color="#40bfff" />
            <ThemedText>
              Minimum Age:
              {data[0]?.minage}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.callendarContainer}>
            {
              //price
            }
            <Feather name="dollar-sign" size={20} color="#40bfff" />
            <ThemedText>
              Ticket Price: £{data[0]?.ticketpricing?.minPrice}
            </ThemedText>
          </ThemedView>
          <ThemedText type="subtitle">Address:</ThemedText>
          <ThemedText>
            {data[0]?.venue?.name}, {data[0]?.venue?.address},
            {data[0]?.venue?.town}, {data[0]?.venue?.postcode},
          </ThemedText>
          <ThemedText type="subtitle">Contact:</ThemedText>
          {data[0]?.vanue?.phone && (
            <TouchableOpacity onPress={() => makeCall(data[0]?.vanue?.phone)}>
              <ThemedText
                style={{ color: "lightblue", textDecorationLine: "underline" }}
              >
                Phone: {data[0]?.vanue?.phone ?? "N/A"}
              </ThemedText>
            </TouchableOpacity>
          )}
          <ThemedText>Website:</ThemedText>
          <TouchableOpacity
            onPress={() => openLink(data[0]?.link)}
            style={styles.container}
          >
            <ThemedText
              style={{ color: "lightblue", textDecorationLine: "underline" }}
            >
              {data[0]?.link}
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">Location</ThemedText>
        </ThemedView>
        <TouchableOpacity
          onPress={() => openLink(mapsLink)}
          style={styles.container}
        >
          <Image source={{ uri: staticMapUrl }} style={styles.mapImage} />
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
    padding: 10,
  },
  container: {
    borderRadius: 0,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: 200,
  },
  image: {
    width: width,
    height: 250,
    borderRadius: 0,
    marginRight: 0,
  },
  scrollContent: {
    paddingHorizontal: 0,
    alignItems: "center",
  },
  callendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

export default EventDetail;
