import ImageItem from '@/components/ImageItem';
import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { FileObject } from '@supabase/storage-js';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const list = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<FileObject[]>([]);

  useEffect(() => {
    if (!user) return

    // Load user images
    loadImages()
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from('images').list(user!.id)
    if (data) {
      setImages(data)
    }
  }

  const onSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert('Appen krever tillatelse for å laste opp bilder fra kamerarullen.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      // Get selected image
      const selectedImage = result.assets[0];

      // Generate unique filename
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const fileExtenion = selectedImage.uri.split('.').pop();
      const filePath = `${fileName}.${fileExtenion}`;

      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();

      // Upload to Supabase
      const { data, error } = await supabase.storage
      .from('images')
      .upload(`${user!.id}/${filePath}`, blob, {
        contentType: `image/${fileExtenion}`,
        cacheControl: '3600',
      });

      if (error) {
        console.error('Kunne ikke laste opp bildet.', error);
        alert('Kunne ikke laste opp bildet. Vennligst prøv igjen.');
        return;
      }

      loadImages();
      

    } catch (error) {
      console.error('Error selecting/uploading image.');
      alert('En feil oppstod. Vennligst prøv igjen.');
    }

  }

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    supabase.storage.from('images').remove([`${user!.id}/${item.name}`])
    const newImages = [...images]
    newImages.splice(listIndex, 1)
    setImages(newImages)
  }
  

  return (
    <View style={styles.container}>
      <ScrollView>
        {images.map((item, index) => (
          <ImageItem
            key={item.id}
            item={item}
            userId={user!.id}
            onRemoveImage={() => onRemoveImage(item, index)}
          />
        ))}
      </ScrollView>
  
      {/* FAB to add images */}
      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>
    </View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
  },
})

export default list
