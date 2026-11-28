import { useEffect, useState } from "react";
import {ActivityIndicator, Alert, Button, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { uploadImage } from "../utils/cloudinary"
import { getCoordinates } from "../utils/location";
import PostForm, { PostFormData } from "@/components/post-form";
import { PostStatus } from "../../../shared/types/post";

const API_URL = "http://10.1.10.149:3000"; // get ip with ipconfig getifaddr en0

export default function EditPost() {
    const router = useRouter();
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const [initialValues, setInitialValues] = useState<Partial<PostFormData> | null>(null);
    const [postStatus, setPostStatus] = useState<PostStatus | null>(null);

    useEffect(() => {
      if (!postId) return;

      async function loadPost() {
        try {
          const response = await fetch(`${API_URL}/api/posts/${postId}`);
          if (!response.ok) {throw new Error("Could not load post");}

          const post = await response.json();

          setPostStatus(post.post_status);

          setInitialValues({
            price: String(post.price ?? ""),
            description: post.description ?? "",
            addressLine: post.address_line ?? "",
            city: post.city ?? "",
            zipCode: String(post.zip_code ?? ""),
            pickupNotes: post.pickup_notes ?? "",
            deliveryInstruction:
              post.delivery_instruction ?? "pickup outside",
            imageUris: [],
            existingPhotos: post.photos ?? [],
            timeSlots: post.time_slots ?? [],
          });
        } catch (error) {
          console.error("Error loading post:", error);
          Alert.alert("Error", "Could not load post information.");
        }
      }

      loadPost();
    }, [postId]);

    async function updatePost(formData: PostFormData) {
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
        
        const updatedPost = {
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
          time_slots: formData.timeSlots,
          photos: [...formData.existingPhotos,...uploadedPhotos],
        };
        
        if (postStatus === "expired") {
          try {
            const response = await fetch(`${API_URL}/api/posts/${postId}/reactivate`, { method: "PATCH" });

            if (!response.ok) {
              throw new Error("Could not reactivate post");
            }

          } catch (error) {
            console.error("Error reactivating post:", error);
            Alert.alert("Error", "Could not reactivate post.");
            return;
          }
        }

        try {
            const response = await fetch(
              `${API_URL}/api/posts/${postId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPost),
              }
            );

            if (!response.ok) {
              throw new Error("Could not update post");
            }

            router.back();
        } catch (error) {
            console.error("Error updating post:", error);
            Alert.alert(
                "Error",
                "Could not update post. Please try again."
            );
        }
    }

  if (!initialValues) {
    return <ActivityIndicator />;
  }

  return (
    <PostForm
          title="Edit Post"
          initialValues={initialValues}
          submitLabel={postStatus === "expired" ? "Reactivate Post" : "Save Changes"}
          onSubmit={updatePost}
        />
  );
}
