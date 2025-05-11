import { Key, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Linking,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { useLocalSearchParams, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StarRating, useSavePlaceActions } from "@/utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const { width } = Dimensions.get("window");

const PopularDetail = () => {
  const { id } = useLocalSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  const savedIds = savedPlaces?.map((item: any) => {
    return item?.id;
  });
  const popularPlacesList = useSelector(
    (state: any) => state.events.popularPlaces
  );
  const data = popularPlacesList?.filter((item: any) => item?.id === id);
  const { savePlace, unsavePlace } = useSavePlaceActions();
  const photos = data[0]?.photos || [];

  const getPhotoUrl = (photoName: string) => {
    return `https://places.googleapis.com/v1/${photoName}/media?key=${process.env.EXPO_PUBLIC_API_KEY}&maxHeightPx=400&maxWidthPx=400`;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Can't open the link: " + url);
    }
  };

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${data[0]?.location?.latitude},${data[0]?.location?.longitude}&zoom=15&size=600x300&markers=color:red%7C${data[0]?.location?.latitude},${data[0]?.location?.longitude}&key=${process.env.EXPO_PUBLIC_API_KEY}`;

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  return (
    <ScrollView showsVerticalScrollIndicator>
      <Stack.Screen //header option including Logo, save/ unsave, back button
        options={{
          title: "",
          headerBackTitle: "Back",
          headerBackButtonDisplayMode: "minimal",

          headerRight: () => (
            <Pressable
              onPress={() => {
                savedIds.includes(id) ? unsavePlace(id) : savePlace(data[0]);
              }}
              style={{ marginRight: 15 }}
            >
              {savedIds.includes(id) ? (
                <FontAwesomeIcon icon={faHeart} size={24} color="red" />
              ) : (
                <FontAwesomeIcon
                  icon={faHeartRegular}
                  size={24}
                  color="#40bfff"
                />
              )}
            </Pressable>
          ),
        }}
      />
      <ThemedView>
        {photos?.length > 0 ? (
          <ScrollView //images carosell
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            {photos.map((item: any, index: number) => (
              <Image
                key={index}
                source={{ uri: getPhotoUrl(item.name) }}
                resizeMode="cover"
                style={styles.image}
              />
            ))}
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
        <View //Pagination Dots
          style={styles.dotsContainer}
        >
          {photos?.map((_: any, index: number) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : {},
              ]}
            />
          ))}
        </View>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">{data[0]?.title}</ThemedText>
          <ThemedText type="title">About</ThemedText>
          <StarRating rating={data[0]?.rating ?? 0} />
          <ThemedText type="default">
            {data[0]?.editorialSummary?.text}
          </ThemedText>
          <ThemedText type="subtitle">Address:</ThemedText>
          <ThemedText>{data[0]?.formattedAddress}</ThemedText>
          <ThemedText type="subtitle">Contact:</ThemedText>
          <TouchableOpacity //phone number
            onPress={() => makeCall(data[0]?.nationalPhoneNumber)}
          >
            <ThemedText
              style={{ color: "lightblue", textDecorationLine: "underline" }}
            >
              Local: {data[0]?.nationalPhoneNumber}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => makeCall(data[0]?.internationalPhoneNumber)}
          >
            <ThemedText
              style={{ color: "lightblue", textDecorationLine: "underline" }}
            >
              International: {data[0]?.internationalPhoneNumber}
            </ThemedText>
          </TouchableOpacity>
          <ThemedText>Website:</ThemedText>
          <TouchableOpacity
            onPress={() => openLink(data[0]?.websiteUri)}
            style={styles.container}
          >
            <ThemedText
              style={{ color: "lightblue", textDecorationLine: "underline" }}
            >
              {data[0]?.websiteUri}
            </ThemedText>
          </TouchableOpacity>
          <ThemedText // Timimgs
            type="subtitle"
          >
            <Text>Timings</Text>
          </ThemedText>
          {data[0]?.regularOpeningHours?.weekdayDescriptions?.map(
            (item: any, index: number) => (
              <ThemedView key={index}>
                <ThemedText>{item}</ThemedText>
              </ThemedView>
            )
          )}
          <ThemedText type="title">Location</ThemedText>
        </ThemedView>
        <TouchableOpacity //location Pin & redirect to ggogle maps
          onPress={() => openLink(data[0]?.googleMapsUri)}
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
    paddingLeft: 10,
    paddingRight: 10,
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#40bfff",
    width: 10,
    height: 10,
  },
});

export default PopularDetail;
