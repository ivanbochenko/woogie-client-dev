import { manipulateAsync } from 'expo-image-manipulator'

export const getUploadedPhotoUrl = async ({photo, heigth, width, url}) => {
  const resizedImg = await manipulateAsync(
    photo.uri,
    [{ resize: { width, heigth } }],
    { compress: 1, format: 'jpeg' },
  )
  const response = await fetch(resizedImg.uri)
  const img = await response.blob()
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: img
  });
  return url.split('?')[0]
}