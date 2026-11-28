import { useState } from "react";
import { days, TimeSlot } from "../../../shared/types/post";
import { Button, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import { router } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export type PostFormData = {
    price: string;
    description: string;
    addressLine: string;
    city: string;
    zipCode: string;
    pickupNotes: string;
    deliveryInstruction: "pickup outside" | "knock please";
    imageUris: string[];
    timeSlots: TimeSlot[];
};

type PostFormProps = {
    title: string;
    initialValues?: Partial<PostFormData>;
    submitLabel: string;
    onSubmit: (data: PostFormData) => void;
};

export default function PostForm({title, initialValues, submitLabel, onSubmit}: PostFormProps) {
  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [addressLine, setAddressLine] = useState(initialValues?.addressLine ?? "");
  const [city, setCity] = useState(initialValues?.city ?? "");
  const [zipCode, setZipCode] = useState(initialValues?.zipCode ?? "");
  const [pickupNotes, setPickupNotes] = useState(initialValues?.pickupNotes ?? "");
  const [deliveryInstruction, setDeliveryInstruction] =useState<"pickup outside" | "knock please">(initialValues?.deliveryInstruction ?? "pickup outside");
  const [imageUris, setImageUris] = useState<string[]>(initialValues?.imageUris ?? []);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    initialValues?.timeSlots ?? [
      {
        day_of_week: 1,
        start_time: "",
        end_time: "",
      },
    ]
  );

  async function handleSubmit() {
    await onSubmit({price, description, addressLine, city, zipCode, pickupNotes, deliveryInstruction, imageUris, timeSlots });
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
  
      function updateTimeSlot(index: number, field: keyof TimeSlot, value: number | string) {
        setTimeSlots((currentSlots) =>
          currentSlots.map((slot, slotIndex) => slotIndex === index
              ? { ...slot, [field]: value }
              : slot
          )
        );
      }
  
    function addTimeSlot() {
        setTimeSlots((currentSlots) => [...currentSlots,
          {
            day_of_week: 1,
            start_time: "",
            end_time: "",
          },
        ]);
      }

    function removeTimeSlot(index: number) {
        setTimeSlots((currentSlots) =>
        currentSlots.filter((_, slotIndex) => slotIndex !== index)
        );
    }

    function timeStringToDate(time: string) {
        const date = new Date();

        if (time) {
            const [hours, minutes] = time.split(":").map(Number);
            date.setHours(hours, minutes, 0, 0);
        } else {
            date.setHours(0, 0, 0, 0);
        }

        return date;
    }

    function formatTimeForDatabase(date: Date) {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}:00`;
    }
    
  return (
    <KeyboardAvoidingView style={formStyles.Screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={formStyles.Form}>
         <Pressable style={formStyles.Back} onPress={() => router.back()}><Text>← Back</Text></Pressable>
        <Text style={formStyles.Title}>{title}</Text>

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

        {timeSlots.map((slot, index) => (
          <View key={index} style={formStyles.TimeSlot}>
            <Text style={formStyles.Label}>
              Availability {index + 1}
            </Text>

            <Dropdown
              style={formStyles.Dropdown}
              data={days}
              labelField="label"
              valueField="value"
              value={slot.day_of_week}
              onChange={(item) =>
                updateTimeSlot(index, "day_of_week", item.value)
              }
            />
            <View style={formStyles.TimePicker}>
                <DateTimePicker value={timeStringToDate(slot.start_time)}
                    mode="time"
                    is24Hour={false}
                    onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        const newTime = formatTimeForDatabase(selectedDate);

                        console.log("New start time:", newTime);

                        updateTimeSlot(index, "start_time", newTime);
                    }
                    }}
                />
                
                <Text>   to </Text>

                <DateTimePicker value={timeStringToDate(slot.end_time)}
                    mode="time"
                    is24Hour={false}
                    onChange={(event, selectedDate) => {
                    if (selectedDate) {
                        updateTimeSlot(index, "end_time", formatTimeForDatabase(selectedDate));
                    }
                    }}
                />
            </View>

            <Button title="Remove Time" onPress={() => removeTimeSlot(index)}/>
          </View>
        ))}

        <Button title="Add Another Time" onPress={addTimeSlot} />

        <View style={formStyles.Button}>
          <Button title={submitLabel} onPress={handleSubmit} />
        </View> 
      </ScrollView>
    </KeyboardAvoidingView>
  );
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

  TimePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  TimeSlot: {
    marginVertical: 10,
    padding: 10,
    paddingTop: 0,
    borderWidth: 1,
    borderColor: "#B7C9D8",
    borderRadius: 10,
    backgroundColor: "#ffffff7d",
  }
});