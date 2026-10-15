import { Image } from "expo-image";
import {styles} from "./styles"

export function Profile() {
  return (
   <Image style={styles.profileImage}
      source={{
        uri: "https://react.dev/images/docs/scientists/MK3eW3As.jpg",
      }}
      accessibilityLabel="Profile photo"
    />
  );
}