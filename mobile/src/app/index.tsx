import { View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ marginTop: 100 }}>
      <Button
        title="Go to Login"
        onPress={() => router.push("/login")}
      />
    </View>
  );
}