import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Text, Image } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  const [imageSelected, setImageSelected] = useState(null); // Imagen seleccionada
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    comidaFavorita: '',
  });
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  useEffect(() => {
    loadProfile();
  }, []);

  const abrirCamaraAsync = async () => {
    const permisoCamara = await ImagePicker.requestCameraPermissionsAsync();
    if (!permisoCamara.granted) {
      alert('Se requiere permiso para acceder a la cámara.');
      return;
    }

    const resultadoFoto = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (resultadoFoto.canceled) {
      return;
    }

    setImageSelected({
      direccion: resultadoFoto.assets[0].uri,
    });
  };

  const abrirArchivosAsync = async () => {
    try {
      const resultadoSeleccion = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (resultadoSeleccion.canceled) {
        return;
      }

      setImageSelected({
        direccion: resultadoSeleccion.assets[0].uri,
      });
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
      console.error(error);
    }
  };

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Image
            source={
              imageSelected
                ? { uri: imageSelected.direccion } // Si hay imagen seleccionada, usarla
                : require('../../assets/perfil.png') // Si no, usar la imagen predeterminada
            }
            style={styles.logo}
          />
          <View style={styles.buttonRow}>
            <Button
              title="Seleccionar Imagen"
              onPress={abrirArchivosAsync}
              containerStyle={styles.button}
              titleStyle={styles.buttonTitle}
            />
            <Button
              title="Tomar Foto"
              onPress={abrirCamaraAsync}
              containerStyle={styles.button}
            />
          </View>
          <Text h4 style={styles.title}>
            Mi Perfil
          </Text>
          <Input
            placeholder="Nombre"
            value={profile.nombre}
            onChangeText={(text) => setProfile({ ...profile, nombre: text })}
          />
          <Input
            placeholder="Apellido"
            value={profile.apellido}
            onChangeText={(text) => setProfile({ ...profile, apellido: text })}
          />
          <Input
            placeholder="Comida Favorita"
            value={profile.comidaFavorita}
            onChangeText={(text) =>
              setProfile({ ...profile, comidaFavorita: text })
            }
          />
          <Button
            title="Actualizar Perfil"
            onPress={handleUpdate}
            containerStyle={styles.button}
          />
          <Button
            title="Cerrar Sesión"
            type="outline"
            onPress={handleSignOut}
            containerStyle={styles.button}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center', // Centra el contenido en la pantalla
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Asegura que los botones ocupen todo el ancho disponible
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 12, // Reducir el tamaño del texto en el botón "Seleccionar Imagen"
  },
  logo: {
    height: 200,
    width: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  
});
