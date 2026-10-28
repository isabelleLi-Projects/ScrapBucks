import { StyleSheet, View, Image, Text, ScrollView} from "react-native";
import { styles } from "../../hooks/styles"
import { Profile } from "../../components/profile"

export default function CustomerView() {
  const posts: PostData[]  = [
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
    return (
        <View style={styles.container}>
            <Profile />
            <Text>Posted:</Text>
            <ScrollView>
              {posts.map((post) => (
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
  PostFrame: {
    height: 500,
    width: "100%",
    borderRadius: 20,
    marginBottom: 40,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  Row: {
    flexDirection: "row",
    //alignItems: "center",
  },

  ImageContainer: {
    width: "45%",
    aspectRatio: 1,
    position: "relative",
  },

  PostImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  }, 

  InstructionBubble: {
    position: "absolute",
    right: -8,
    bottom: -12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  InstructionText: {
    fontSize: 12,
    fontWeight: "600",
  },

  PostText: {
    marginLeft: 20,
    fontSize: 16,
  },
});