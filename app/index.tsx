import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import mqtt from "mqtt";
const client = mqtt.connect("ws://localhost:8000", {
  path: "/mqtt",
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
});

client.on("error", (error) => {
  console.log("hivemq error: ", error)
})

client.on("connect", () => {
  console.log("connected")
  client.subscribe("location", (err) => {
    if (!err) {
      client.publish("location", `{lat: 25, long: 'c', sensor: 'ios'}`);
    }
  })
});

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      TaskManager.defineTask("location", ({ data: { locations }, error }) => {
        if (error) {
          setErrorMsg(`An error occurred while tracking location: ${error.message}` );
        }
        console.log('Received new locations', locations);
        const message = JSON.stringify({...locations[0], sensor: 'ios'})
        client.publish("location", message);
        setLocation(locations[0]);
       });

      await Location.startLocationUpdatesAsync("location")

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      console.log("connecting to mqtt");
  })();

  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
