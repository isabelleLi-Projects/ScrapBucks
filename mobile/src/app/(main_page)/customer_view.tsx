import { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, Image, Text, ScrollView, Pressable, Button } from "react-native";
import { styles } from "../../hooks/styles"
import { Profile } from "../../components/profile"
import { Post, PickupStatus, days } from "../../../../shared/types/post";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect, useRouter } from "expo-router";

//const API_URL = process.env.EXPO_PUBLIC_API_URL;
//const API_URL = "http://localhost:3000";
const API_URL = "http://10.1.10.149:3000"; // get ip with ipconfig getifaddr en0
// const API_URL = "http://10.0.0.11:3000" // Isabelle's ip

export default function CustomerView() {
  const router = useRouter();
  const customerId = 1;
  const [activeTab, setActiveTab] = useState<"current" | "old">("current");
  const [posts, setPosts] = useState<Post[]>([]);
  
  const loadPosts = useCallback(async () => {
  try {
    const url = `${API_URL}/api/customers/${customerId}/posts`;

    console.log("Fetching:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const postsFromServer: Post[] = await response.json();

    console.log("Posts loaded:", postsFromServer);

    setPosts(postsFromServer);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}, [customerId]);

useFocusEffect(
  useCallback(() => {
    loadPosts();
  }, [loadPosts])
);

  const currentPosts = posts.filter((post) => post.status !== "pickedUp");
  const archivedPosts = posts.filter((post) => post.status === "pickedUp");

  const postsToDisplay = activeTab === "current" ? currentPosts : archivedPosts;

    return (
        <View style={styles.container}>
          <Profile/>
          <View style={customerStyles.TabRow}>
            <Text style={customerStyles.Header}>My Posts</Text>
            {/* tab for switching between current post and old posts */}
            <View style={customerStyles.TabContainer}>
              <Pressable
                style={[customerStyles.Tab, activeTab === "current" && customerStyles.ActiveCurrentTab,]}
                onPress={() => setActiveTab("current")}>
                <Text style={[ customerStyles.TabText,
                  activeTab === "current" && customerStyles.ActiveTabText,
                ]}>Current</Text>
              </Pressable>
              <Pressable
                style={[customerStyles.Tab, activeTab === "old" && customerStyles.ActiveOldTab,]}
                onPress={() => setActiveTab("old")}
              >
                <Text style={[ customerStyles.TabText,
                  activeTab === "old" && customerStyles.ActiveTabText,
                ]}>Archived</Text>
              </Pressable>
            </View>
          </View>
            
          <ScrollView style={customerStyles.PostContainer} showsVerticalScrollIndicator={false}>
            {activeTab === "current" && currentPosts.length === 0 ? (
              <View style={customerStyles.EmptyPostContainer}>
                <Text style={customerStyles.EmptyPostText}>You do not have a current post.</Text>
                <Button title="Create Post" onPress={() => router.push("/create-post")}/>
              </View>
            ) : (
              postsToDisplay.map((post) => (
                <PostDisplay key={post.post_id} post={post} />
              ))
            )}
          </ScrollView>
            
        </View>
    );
}

function PostDisplay({ post }: { post: Post }) {
  const [imageIndex, setImageIndex] = useState(0);
  
  function showPreviousImage() {
    setImageIndex((currentIndex) =>
      currentIndex === 0
        ? post.photos.length - 1
        : currentIndex - 1
    );
  }

  function showNextImage() {
    setImageIndex((currentIndex) =>
      currentIndex === post.photos.length - 1
        ? 0
        : currentIndex + 1
    );
  }

  const javascriptDay = new Date().getDay();
  const today = javascriptDay === 0 ? 7 : javascriptDay;
  const [selectedDay, setSelectedDay] = useState(today);
  const selectedTimeSlots = post.time_slots.filter((slot) => slot.day_of_week === selectedDay);

  return (
    <View style={customerStyles.PostFrame}>
      <View style={customerStyles.PostTextFrame}>
        <Text style={customerStyles.PostTextHeading}>
        Pickup information
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={customerStyles.PostTextBody}>
          Price: ${post.price}
        </Text>
        <Text style={customerStyles.PostTextBody}>
          Description: {post.description}
        </Text>
        <Text style={customerStyles.PostTextBody}>
          {"\n"}Location: {post.pickup_location.address_line}, {post.pickup_location.city}
        </Text>
        <Text style={customerStyles.PostTextBody}>
          Pickup notes: {post.pickup_notes}
        </Text>

        <View style={customerStyles.TimeHeader}>
            <Text style={customerStyles.PostTextBody}>Pickup times:</Text>

            <Dropdown
              style={customerStyles.Dropdown}
              containerStyle={customerStyles.DropdownMenu}
              itemContainerStyle={customerStyles.DropdownItem}
              itemTextStyle={customerStyles.DropdownText}
              data={days}
              labelField="label"
              valueField="value"
              value={selectedDay}
              onChange={(item) => {setSelectedDay(item.value);}}
              placeholder="Select a day"
              maxHeight={200}
              selectedTextStyle={customerStyles.DropdownText}
              placeholderStyle={customerStyles.DropdownText}
            />
          </View>
          {selectedTimeSlots.length > 0 ? (selectedTimeSlots.map((slot, index) => (
              <Text key={index} style={customerStyles.PostTextBody}>
                {formatTime(slot.start_time)} -{" "}{formatTime(slot.end_time)}
              </Text>
            ))
          ) : (
            <Text style={customerStyles.PostTextBody}>
              No pickup times available.
            </Text>
          )}
        </ScrollView>
      </View>

      <View style={customerStyles.ImageSection}>
        <Image
          style={customerStyles.PostImage}
          source={{ uri: post.photos[imageIndex] }}
          resizeMode="cover"
        />

        {post.photos.length > 1 && (
          <>
            <Pressable
              style={[customerStyles.Arrow, customerStyles.LeftArrow]}
              onPress={showPreviousImage}
            >
              <Text style={customerStyles.ArrowText}>‹</Text>
            </Pressable>

            <Pressable
              style={[customerStyles.Arrow, customerStyles.RightArrow]}
              onPress={showNextImage}
            >
              <Text style={customerStyles.ArrowText}>›</Text>
            </Pressable>

            <View style={customerStyles.Dots}>
              {post.photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    customerStyles.Dot,
                    index === imageIndex && customerStyles.ActiveDot,
                  ]}
                />
              ))}
            </View>
          </>
        )}

        <View style={customerStyles.InstructionBubble}>
          <Text style={customerStyles.InstructionText}>
            {post.delivery_instruction}
          </Text>
        </View>
      </View>
      <ProgressTracker status={post.status} />
    </View>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function ProgressTracker({ status }: { status: PickupStatus }) {
  const steps = [
    { key: "findingDriver", label: "Finding driver" }, // index 0
    { key: "driverAccepted", label: "Driver accepted" }, // index 1
    { key: "pickedUp", label: "Picked up" }, // index 2
  ];

  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <View style={customerStyles.ProgressTracker}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;
        const lineIsCompleted = index < currentStep;

        return (
          <View style={customerStyles.ProgressStep} key={step.key}>
            <View style={customerStyles.CircleAndLine}>
              <View style={[customerStyles.ProgressCircle, isCompleted && customerStyles.CompletedCircle]}>
                {isCompleted}
              </View>

              {index < steps.length - 1 && (
                <View style={[customerStyles.ProgressLine, lineIsCompleted && customerStyles.CompletedLine]}/>
              )}
            </View>

            <Text style={customerStyles.ProgressLabel}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const customerStyles = StyleSheet.create({
  Screen: {
    backgroundColor: "#DCEEFF",
  },

  Header: {
    marginBottom: 8,
    fontSize: 26,
    fontWeight: "700",
    color: "#29445C",
  },

  TabRow: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    // borderWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#B7C9D8",
    marginTop: 20,
  },

  TabContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: "2.5%",
    zIndex: 1,
  },

  Tab: {
    minWidth: 100,
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginLeft: 5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#B7C9D8",
  },

  ActiveCurrentTab: {
    backgroundColor: "#FFF4C2",
  },

  ActiveOldTab: {
    backgroundColor: "#DDF3D1",
  },

  TabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7780",
  },

  ActiveTabText: {
    color: "#29445C",
    fontWeight: "700",
  },

  PostContainer: {
    width: "100%",
    paddingTop: 10,
  },

  PostContent: {
    paddingTop: 16,
    paddingBottom: 30,
  },

  PostFrame: {
    width: "95%",
    // minHeight: 300,
    height: 500,
    alignSelf: "center",
    marginBottom: 20,
    padding: 25,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",

    shadowColor: "#29445C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  Row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  ImageSection: {
    width: "100%",
    height: 150,
    position: "relative",
    marginTop: 10,
  },

  PostImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  InstructionBubble: {
    position: "absolute",
    right: -8,
    top: -10,
    backgroundColor: "#FFF4C2",
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  InstructionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5C5130",
  },
  PostTextFrame: {
    height: "50%"
  },

  PostTextHeading: {
    fontSize: 18,
    marginBottom: 7,
    fontWeight: "600",
    color: "#29445C",
  },
  PostTextBody: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "400",
    color: "#29445C",
  },
  Dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },

  Dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.6,
  },
  ActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF4C2",
    opacity: 1,
  },
  Arrow: {
    position: "absolute",
    top: "42%",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    elevation: 3,
  },
  LeftArrow: {
    left: 10,
  },

  RightArrow: {
    right: 10,
  },
  ArrowText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#29445C",
  },
  ProgressTracker: {
  flexDirection: "row",
  width: "100%",
  marginTop: 20,
},

ProgressStep: {
  flex: 1,
  alignItems: "center",
},

CircleAndLine: {
  marginLeft: 70,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
},

ProgressCircle: {
  width: 20,
  height: 20,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 13,
  backgroundColor: "#D9E1E8",
  borderWidth: 2,
  borderColor: "#B7C9D8",
},

CompletedCircle: {
  backgroundColor: "#DDF3D1",
  borderColor: "#8DBF96",
},

// Checkmark: {
//   fontSize: 14,
//   fontWeight: "700",
//   color: "#29445C",
// },

ProgressLine: {
  flex: 1,
  height: 3,
  backgroundColor: "#D9E1E8",
},

CompletedLine: {
  backgroundColor: "#8DBF96",
},

ProgressLabel: {
  marginTop: 7,
  fontSize: 11,
  textAlign: "center",
  color: "#526575",
},
TimeHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginVertical: 8,
},

Dropdown: {
  width: 145,
  height: 30,
  paddingHorizontal: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#B7C9D8",
  backgroundColor: "#DCEEFF",
},

DropdownMenu: {
  borderRadius: 10,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#B7C9D8",
},
DropdownItem: {
  height: 50,
  paddingVertical: 0,
  justifyContent: "center",
},
DropdownItemText: {
  fontSize: 14,
  lineHeight: 14,
  color: "#29445C",
},
DropdownText: {
  fontSize: 14,
  color: "#29445C",
},

EmptyPostContainer: {
  alignItems: "center",
  justifyContent: "center",
  padding: 30,
},

EmptyPostText: {
  marginBottom: 15,
  fontSize: 16,
  color: "#29445C",
},

});