import { supabase } from '@/config/initSupabase';
import { Ionicons } from '@expo/vector-icons';
import { FileObject } from '@supabase/storage-js';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// Image item component that displays the image from Supabase Storage and a delete button
const ImageItem = ({
  item,
  userId,
  onRemoveImage,
}: {
  item: FileObject
  userId: string
  onRemoveImage: () => void
}) => {
  const [image, setImage] = useState<string>('');

  const loadImage = async () => {
    try {
      const { data } = supabase.storage
      .from('images')
      .getPublicUrl(`${userId}/${item.name}`);

      if (data && data.publicUrl) {
        setImage(data.publicUrl);
      }
    } catch (error) {
      console.error('Error loading image.', error);
    }
  };


  // supabase.storage
  // .from('images')
  // .download(`${userId}/${item.name}`)
  // .then(({ data }) => {
  //   const fr = new FileReader()
  //   fr.readAsDataURL(data!)
  //   fr.onload = () => {
  //     setImage(fr.result as string)
  //   }
  // });

  useEffect(() => {
    loadImage();
  })



  return (
    <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>
      {image ? (
        <Image style={{ width: 80, height: 80 }} source={{ uri: image }} />
      ) : (
        <View style={{ width: 80, height: 80, backgroundColor: '#1A1A1A' }} />
      )}
      <Text style={{ flex: 1, color: '#fff' }}>{item.name}</Text>
      {/* Delete image button */}
      <TouchableOpacity onPress={onRemoveImage}>
        <Ionicons name="trash-outline" size={20} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
}

export default ImageItem