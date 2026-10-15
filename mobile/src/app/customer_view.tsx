import { StyleSheet, View } from "react-native";
import { styles } from "./shared/styles"
import { Profile } from "./shared/components"

export default function CustomerView() {
    return (
        <View style={styles.container}>
            <Profile />
        </View>
    );
}

const customerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  
});