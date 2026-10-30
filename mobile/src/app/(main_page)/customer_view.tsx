import { useState } from "react";
import { StyleSheet, View, Image, Text, ScrollView, Pressable } from "react-native";
import { styles } from "../../hooks/styles"
import { Profile } from "../../components/profile"

export default function CustomerView() {
  const [activeTab, setActiveTab] = useState<"current" | "old">("current");
  const oldPosts: PostData[] = [
    {
      post_id: 1,
      photo: "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
      delivery_instruction: "pickup outside",
    },
    {
      post_id: 2,
      photo: "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
      delivery_instruction: "knock please",
    },
  ];

  const currentPost: PostData = {
    post_id: 3,
    photo: "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
    delivery_instruction: "pickup outside",
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

type PostData = {
  post_id: number;
  photo: string;
  delivery_instruction: "pickup outside" | "knock please";
};

function Post({ post }: { post: PostData }) {
  return (
    <View style={customerStyles.PostFrame}>
      <View style={customerStyles.Row}>
        {/* Wrapper (image container) allows the bubble to be positioned over the image */}
        <View style={customerStyles.ImageContainer}>
          <Image
            style={customerStyles.PostImage}
            source={{ uri: post.photo }}
            resizeMode="cover"
          />

          <View style={customerStyles.InstructionBubble}>
            <Text style={customerStyles.InstructionText}>
              {post.delivery_instruction}
            </Text>
          </View>
        </View>

        <Text style={customerStyles.PostText}>
          Post information
        </Text>
      </View>
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
    padding: 18,
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

  ImageContainer: {
    width: "45%",
    aspectRatio: 1,
    position: "relative",
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

  PostText: {
    flex: 1,
    marginLeft: 18,
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#29445C",
  },
});