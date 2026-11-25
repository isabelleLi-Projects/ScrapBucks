export async function uploadImage(imageUri: string): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();

  const formData = new FormData();

  formData.append("file", imageBlob, "post-image.jpg");
  formData.append("upload_preset", uploadPreset!);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", result);
    throw new Error("Image upload failed");
  }

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
}