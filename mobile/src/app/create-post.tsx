import { useState } from "react";
import {Alert, Button, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { days } from "../../../shared/types/post";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../utils/cloudinary"

const API_URL = "http://10.1.10.149:3000"; // get ip with ipconfig getifaddr en0

export default function CreatePost() {
    const router = useRouter();

    const customerId = 2;

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    //const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [pickupNotes, setPickupNotes] = useState("");
    const [deliveryInstruction, setDeliveryInstruction] = useState<"outside pickup" | "knock please">("outside pickup");
    const [dayOfWeek, setDayOfWeek] = useState(1);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [imageUris, setImageUris] = useState<string[]>([]);

  

    async function createPost() {
        if (!price || !description || !addressLine || !city || !zipCode || !startTime || !endTime) {
            Alert.alert("Missing information", "Please fill out all required fields.");
            return;
        }

        const fullAddress = `${addressLine}, ${city}, CA ${zipCode}`;
        const coordinates = await getCoordinates(fullAddress);
        if (!coordinates) { return; }

        const uploadedPhotos = imageUris.length > 0
            ? await Promise.all(imageUris.map((uri) => uploadImage(uri)))
            : [];
        
        const newPost = {
            price: Number(price),
            description,

            address_line: addressLine,
            city,
            state: "CA",
            zip_code: zipCode,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,

            pickup_notes: pickupNotes,
            delivery_instruction: deliveryInstruction,

            photos: uploadedPhotos.map((photo) => ({url: photo.url, publicId: photo.publicId})),

            time_slots: [
                {
                    day_of_week: dayOfWeek,
                    start_time: startTime,
                    end_time: endTime,
                },
            ],
        };
        

        try {
            const response = await fetch(
                `${API_URL}/api/customers/${customerId}/posts`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newPost),
                }
            );

            const result = await response.json();
            console.log("Response status:", response.status);
            console.log("Response body:", result);

            if (!response.ok) {
                throw new Error(result.message || "Could not create post");
            }

            Alert.alert("Success", "Your post was created.");

            router.back();
        } catch (error) {
            console.error("Error creating post:", error);
            Alert.alert(
                "Error",
                "Could not create post. Please try again."
            );
        }
    }

    async function chooseImages() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            alert("Permission to access photos is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          selectionLimit: 5,
          quality: 0.8,
        });

        if (!result.canceled) {
          setImageUris(result.assets.map((asset) => asset.uri));
        }
    }

  return (
    <KeyboardAvoidingView style={formStyles.Screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={formStyles.Form}>
         <Pressable style={formStyles.Back} onPress={() => router.back()}><Text>← Back</Text></Pressable>
        <Text style={formStyles.Title}>Create a Post</Text>

        <Text style={formStyles.Label}>Price</Text>
        <TextInput style={formStyles.Input}
          placeholder="Example: 5.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <Text style={formStyles.Label}>Description</Text>
        <TextInput style={[formStyles.Input, formStyles.TextArea]}
          placeholder="Describe your recyclables"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={formStyles.Label}>Address</Text>
        <TextInput style={formStyles.Input}
          placeholder="Street address"
          value={addressLine}
          onChangeText={setAddressLine}
        />

        <Text style={formStyles.Label}>City</Text>
        <TextInput style={formStyles.Input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <Text style={formStyles.Label}>ZIP code</Text>
        <TextInput style={formStyles.Input}
          placeholder="ZIP code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="number-pad"
        />

        <Text style={formStyles.Label}>Delivery instruction</Text>
        <Dropdown style={formStyles.Dropdown}
          data={[
            { label: "Pickup outside", value: "pickup outside" },
            { label: "Knock please", value: "knock please" },
          ]}
          labelField="label"
          valueField="value"
          value={deliveryInstruction}
          onChange={(item) => setDeliveryInstruction(item.value)}
        />

        <Text style={formStyles.Label}>Pickup notes</Text>
        <TextInput style={[formStyles.Input, formStyles.TextArea]}
          placeholder="Ex. Please do not ring the doorbell or knock"
          value={pickupNotes}
          onChangeText={setPickupNotes}
          multiline
        />

        <Text style={formStyles.Label}>Add Photos</Text>
        <Button title="Choose Photo" onPress={chooseImages} />
        <ScrollView horizontal>
          {imageUris.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{
                width: 100,
                height: 100,
                marginRight: 10,
                borderRadius: 10,
              }}
            />
          ))}
        </ScrollView>

        <Text style={formStyles.Label}>Times Available</Text>
        <View>
            <Dropdown style={formStyles.Dropdown}
            data={days}
            labelField="label"
            valueField="value"
            value={dayOfWeek}
            onChange={(item) => setDayOfWeek(item.value)}
            />

            <Text style={formStyles.Label}>Start time</Text>
            <TextInput style={formStyles.Input}
            placeholder="Example: 09:00:00"
            value={startTime}
            onChangeText={setStartTime}
            />
        </View>
        <Text style={formStyles.Label}>End time</Text>
        <TextInput style={formStyles.Input}
          placeholder="Example: 12:00:00"
          value={endTime}
          onChangeText={setEndTime}
        />

        <View style={formStyles.Button}>
          <Button title="Create Post" onPress={createPost}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

async function getCoordinates(address: string) {
  try {
    const results = await Location.geocodeAsync(address);

    if (results.length === 0) {
      Alert.alert("Address not found", "Please check the address.");
      return null;
    }

    const { latitude, longitude } = results[0];

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    Alert.alert("Error", "Could not find that address.");
    return null;
  }
}


const formStyles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "#DCEEFF",
    padding: 10,
    paddingTop: 50,
    
  },

  Form: {
    padding: 20,
    paddingBottom: 40,
  },

  Back: {
    marginBottom: 20,
  },

  Title: {
    marginBottom: 20,
    fontSize: 26,
    fontWeight: "700",
    color: "#29445C",
  },

  Label: {
    marginTop: 12,
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "600",
    color: "#29445C",
  },

  Input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#B7C9D8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
  },

  TextArea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  Dropdown: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#B7C9D8",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  Button: {
    marginTop: 25,
  },
});