import { React, useRef, useEffect, useState, Image } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from 'axios';


export default function App() {

  const refMap = useRef(null)

  const [coordinatesClient, setCoordinatesClient] = useState();
  const [pharmacies, setPharmacies] = useState();

  useEffect(() => {
    getMyLocation()
    getPharmacies()

  })

  const getMyLocation = async () => {
    //let myLocation = { latitude, longitude };
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return
    }
    let { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setCoordinatesClient({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5
    })

    refMap.current.animateToRegion({
      center: {
        latitude: coords.latitude,
        longitude: coords.longitude,

      },
      zoom: 5,
      heading: 0,
      pitch: 0,
      altitude: 5

    })
  }

  const getPharmacies = async () => {
    axios.get(" https://f90b-105-67-129-201.eu.ngrok.io/pharmacies/all")
      .then(response => {
        //zonef 
        setPharmacies(response.data)
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }
  return (

    <View style={styles.container}>

      <MapView
        style={styles.map}
        //specify our coordinates.
        ref={refMap}
        initialRegion={coordinatesClient}
      >
        {coordinatesClient &&
          <Marker
            coordinate={coordinatesClient}
            title="Your Localisation"
          >

          </Marker>

        }
        {pharmacies && pharmacies.map(pharmacie => (
          <Marker coordinate={
            {
              "latitude": pharmacie.latitude,
              "longitude": pharmacie.longitude
            }
          }
            title={pharmacie.nom}
            key={pharmacie.id} 
            icon={require('./assets/mark.png')}
            />
           

        ))}

      </MapView>
    </View>

  );
}
//create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    flex: 1,
    //the container will fill the whole screen.
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});