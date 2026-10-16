import { StyleSheet, View, Image, Text, ScrollView} from "react-native";
import { styles } from "../shared/styles"
import { Profile } from "../shared/components"

export default function CustomerView() {
    return (
        <View style={styles.container}>
            <Profile />
            <Text>Posted:</Text>
            <ScrollView>
              <Post />
            </ScrollView>
            
        </View>
    );
}

function Post() {
  return (
     <View style={customerStyles.PostFrame}>
      <View style={customerStyles.Row}>
        <Image style={customerStyles.PostImage}
            source={{
              uri: "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
            }}
            accessibilityLabel="Profile photo"
        />
        <Text>hello</Text>
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
  PostImage: {

    width: "45%",
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 20
  }, 

  Row: {
    flexDirection: "row",
    //alignItems: "center",
  },
  
});