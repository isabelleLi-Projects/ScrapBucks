import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { uploadImage } from "../utils/cloudinary"
import { getCoordinates } from "../utils/location";
import PostForm, { PostFormData } from "@/components/post-form";

const API_URL = "http://10.1.10.149:3000"; // get ip with ipconfig getifaddr en0

export default function CreatePost() {
    const router = useRouter();
    const userId = 2;

    async function createPost(formData: PostFormData) {
      const hasPhoto = (formData.existingPhotos?.length ?? 0) > 0 || (formData.imageUris?.length ?? 0) > 0;
        if (!formData.price || !formData.description || !formData.addressLine || !formData.city || !formData.zipCode || !hasPhoto) {
            Alert.alert("Missing information", "Please fill out all required fields.");
            return;
        }

        const fullAddress = `${formData.addressLine}, ${formData.city}, CA ${formData.zipCode}`;
        const coordinates = await getCoordinates(fullAddress);
        if (!coordinates) { return; }

        const uploadedPhotos = formData.imageUris.length > 0
            ? await Promise.all(formData.imageUris.map((uri) => uploadImage(uri)))
            : [];
        
        const newPost = {
          price: Number(formData.price),
          description: formData.description,
          address_line: formData.addressLine,
          city: formData.city,
          state: "CA",
          zip_code: formData.zipCode,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          pickup_notes: formData.pickupNotes,
          delivery_instruction: formData.deliveryInstruction,
          photos: uploadedPhotos,
          time_slots: formData.timeSlots,
        };
        

        try {
            const response = await fetch(
                `${API_URL}/api/posts/user/${userId}`,
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

  return (
    <PostForm
      title="Create a Post"
      submitLabel="Create Post"
      onSubmit={createPost}
    />
  );
}
