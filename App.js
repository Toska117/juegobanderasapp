import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQiCrfRMs3AnCe4BIsN_hQO-aiNrCNrDg",
  authDomain: "sasa-a87eb.firebaseapp.com",
  projectId: "sasa-a87eb",
  storageBucket: "sasa-a87eb.firebasestorage.app",
  messagingSenderId: "394239044863",
  appId: "1:394239044863:web:909a2d659adbf92f4b30ca"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de Firestore
const db = getFirestore(app);

// Las URL de las banderas de los países sudamericanos
const paises = [
  { nombre: 'Colombia', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009629.png' },
  { nombre: 'Venezuela', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009838.png' },
  { nombre: 'Ecuador', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009647.png' },
  { nombre: 'Argentina', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009856.png' },
  { nombre: 'Paraguay', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009956.png' },
  { nombre: 'Uruguay', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009926.png' },
  { nombre: 'Brasil', bandera: 'https://cdn-icons-png.flaticon.com/128/10602/10602934.png' },
  { nombre: 'Bolivia', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009902.png' },
  { nombre: 'Perú', bandera: 'https://cdn-icons-png.flaticon.com/128/2151/2151362.png' },
  { nombre: 'Chile', bandera: 'https://cdn-icons-png.flaticon.com/128/14009/14009890.png' },
];

const App = () => {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [seleccion, setSeleccion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [finalizado, setFinalizado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [paisesAdivinados, setPaisesAdivinados] = useState([]);
  const [guardado, setGuardado] = useState(false);

  // Generar opciones aleatorias
  const generarOpciones = () => {
    const opciones = [paises[preguntaActual]];
    while (opciones.length < 4) {
      const paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
      if (!opciones.includes(paisAleatorio)) {
        opciones.push(paisAleatorio);
      }
    }
    return opciones.sort(() => Math.random() - 0.5);
  };

  const opciones = generarOpciones();

  const handleSeleccion = (respuesta) => {
    setSeleccion(respuesta);
  };

  const verificarRespuesta = () => {
    if (seleccion === paises[preguntaActual].nombre) {
      setRespuestasCorrectas(respuestasCorrectas + 1);
      setPaisesAdivinados([...paisesAdivinados, paises[preguntaActual].nombre]);
      setMensaje('¡Correcto! 🎉');
    } else {
      setMensaje(`¡Incorrecto! La respuesta correcta es ${paises[preguntaActual].nombre}.`);
    }
  };

  const siguientePregunta = () => {
    if (preguntaActual < 4) {
      setPreguntaActual(preguntaActual + 1);
      setSeleccion('');
      setMensaje('');
    } else {
      setFinalizado(true);
    }
  };

  // Guardar los resultados en Firebase
  const guardarResultados = async () => {
    if (nombre) {
      try {
        // Guardamos los resultados en Firestore
        await addDoc(collection(db, 'resultados'), {
          nombre: nombre,
          puntos: respuestasCorrectas,
          paises: paisesAdivinados,
        });
        setGuardado(true);
        console.log('Resultado guardado en Firestore');
      } catch (e) {
        console.error('Error al agregar documento a Firestore: ', e);
        Alert.alert('Error', 'Hubo un error al guardar los resultados.');
      }
    } else {
      Alert.alert('Nombre requerido', 'Por favor ingresa tu nombre antes de guardar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego de Banderas - Opción Múltiple</Text>

      {!finalizado ? (
        <>
          <View style={styles.flagContainer}>
            <Image source={{ uri: paises[preguntaActual].bandera }} style={styles.flagImage} />
          </View>

          <Text>Pregunta {preguntaActual + 1} de 5</Text>
          <Text>¿De qué país es esta bandera?</Text>

          {opciones.map((opcion, index) => (
            <Button key={index} title={opcion.nombre} onPress={() => handleSeleccion(opcion.nombre)} />
          ))}

          <Button title="Verificar respuesta" onPress={verificarRespuesta} />

          {mensaje && <Text>{mensaje}</Text>}

          {mensaje && <Button title="Siguiente pregunta" onPress={siguientePregunta} />}
        </>
      ) : (
        <View>
          <Text>¡Juego terminado!</Text>
          <Text>Respuestas correctas: {respuestasCorrectas} de 5</Text>
          <Text>Países adivinados: {paisesAdivinados.join(', ')}</Text>

          {!guardado ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChangeText={setNombre}
              />
              <Button title="Guardar resultado" onPress={guardarResultados} />
            </>
          ) : (
            <Text>¡Gracias por jugar! Tu resultado ha sido guardado.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  flagContainer: {
    marginBottom: 20,
  },
  flagImage: {
    width: 100,
    height: 60,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    width: '80%',
  },
});

export default App;
