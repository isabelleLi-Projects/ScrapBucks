import { useState } from "react";
import { StyleSheet, View, Image, Text, ScrollView, Pressable } from "react-native";
import { styles } from "../../hooks/styles"
import { Profile } from "../../components/profile"

export default function CustomerView() {
  const [activeTab, setActiveTab] = useState<"current" | "old">("current");
  const oldPosts: PostData[] = [
    {
      post_id: 1,
      photos: [
      "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
      "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
      "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
    ],
      delivery_instruction: "pickup outside",
      status: "pickedUp",
    },
    {
      post_id: 2,
      photos: ["https://react.dev/images/docs/scientists/MK3eW3As.jpg"],
      delivery_instruction: "knock please",
      status: "findingDriver",
    },
  ];

  const currentPost: PostData = {
    post_id: 3,
    photos: ["https://react.dev/images/docs/scientists/MK3eW3As.jpg"],
    delivery_instruction: "pickup outside",
    status: "driverAccepted",
  };

  const postsToDisplay = activeTab === "current" ? [currentPost] : oldPosts;

    return (

        <View style={styles.container}>
            <Profile />
            <View style={customerStyles.TabRow}>
              <Text style={customerStyles.Header}>My Posts</Text>
              {/* tab for switching between current post and old posts */}
              <View style={customerStyles.TabContainer}>
                <Pressable
                  style={[
                    customerStyles.Tab,
                    activeTab === "current" && customerStyles.ActiveCurrentTab,
                  ]}
                  onPress={() => setActiveTab("current")}
                >
                  <Text style={[ customerStyles.TabText,
                    activeTab === "current" && customerStyles.ActiveTabText,
                  ]}>Current</Text>
                </Pressable>
                <Pressable
                  style={[
                    customerStyles.Tab,
                    activeTab === "old" && customerStyles.ActiveOldTab,
                  ]}
                  onPress={() => setActiveTab("old")}
                >
                  <Text style={[ customerStyles.TabText,
                    activeTab === "old" && customerStyles.ActiveTabText,
                  ]}>Archived</Text>
                </Pressable>
              </View>
            </View>
            
            <ScrollView style={customerStyles.PostContainer}
              showsVerticalScrollIndicator={false}>
              {postsToDisplay.map((post) => (
                <Post key={post.post_id} post={post} />
              ))}
            </ScrollView>
            
        </View>
    );
}
type PickupStatus = "findingDriver" | "driverAccepted" | "pickedUp";

type PostData = {
  post_id: number;
  photos: string[];
  delivery_instruction: "pickup outside" | "knock please";
  status: PickupStatus;
};

function Post({ post }: { post: PostData }) {
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
  return (
    <View style={customerStyles.PostFrame}>
      <Text style={customerStyles.PostTextHeading}>
        Pickup information
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Number of cans (estimate)
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Price:
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Weight lb/kg: ...
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Description:
      </Text>
      <Text style={customerStyles.PostTextBody}>
        {"\n"}Location:
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Pickup notes:
      </Text>
      <Text style={customerStyles.PostTextBody}>
        Time available:
      </Text>

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

function ProgressTracker({ status }: { status: PickupStatus }) {
  const steps = [
    { key: "findingDriver", label: "Finding driver" },
    { key: "driverAccepted", label: "Driver accepted" },
    { key: "pickedUp", label: "Picked up" },
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
              <View style={[customerStyles.ProgressCircle, isCompleted && customerStyles.CompletedCircle,]}>
                {isCompleted}
              </View>

              {index < steps.length - 1 && (
                <View style={[customerStyles.ProgressLine, lineIsCompleted && customerStyles.CompletedLine,]}/>
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
    paddingTop: 10
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
    bottom: -10,
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

  PostTextHeading: {
    fontSize: 18,
    marginBottom: 7,
    fontWeight: "600",
    color: "#29445C",
  },
  PostTextBody: {
    fontSize: 16,
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

});