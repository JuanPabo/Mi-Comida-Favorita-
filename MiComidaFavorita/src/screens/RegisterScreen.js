import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el indicador de carga

  // Función para validar los campos del formulario
  const validateRegisterForm = () => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email); // Valida el formato del correo
    const isPasswordValid = password.length > 0; // Valida que la contraseña no esté vacía
    return isEmailValid && isPasswordValid;
  };

  const handleRegister = async () => {
    setIsLoading(true); // Activa el indicador de carga antes de la operación
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      setError('Error al registrarse: ' + error.message);
    } finally {
      setIsLoading(false); // Desactiva el indicador de carga al finalizar
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? ( // Se muestra el indicador de carga mientras isLoading es true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text h3 style={styles.title}>
            Registro
          </Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title="Registrarse"
            onPress={handleRegister}
            containerStyle={styles.button}
            disabled={!validateRegisterForm()} // Botón habilitado solo si los campos son válidos
          />
          <Button
            title="Volver al Login"
            type="outline"
            onPress={() => navigation.navigate('Login')}
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
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
