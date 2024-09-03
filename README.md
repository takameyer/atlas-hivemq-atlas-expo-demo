# HiveMQ/Atlas Location Tracker App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Prerequsites

### Setup Atlas Cluster

1. Ensure you have a cluster deployed in Atlas
2. Create a new database and a TimeSeries collection with the following settings:
```
{
   timeseries: {
      timeField: "timestamp",
      metaField: "metadata"
   }
}
```

### Setup HiveMQ Broker

1. Download HiveMQ Enterprise (https://www.hivemq.com/download/)
2. Modify the `config.xml` file to enable the WebSocket Listener
```
<listeners>
    <listener>
        <name>Websocket Listener</name>
        <bind-address>

         </bind-address>
```
3. Create a `config.xml` file in `extensions/hivemq-mongodb-extension/conf` with the following content:
```
 <hivemq-mongodb-extension xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="config.xsd">
 <mongodbs>
   <mongodb>
     <id>my-mongodb-id</id>
     <connection-string>CONNECTION_STRING_FROM_ATLAS</connection-string>
   </mongodb>
 </mongodbs>

 <mqtt-to-mongodb-routes>
   <mqtt-to-mongodb-route>
     <id>my-mqtt-to-mongodb-route</id>
     <mongodb-id>my-mongodb-id</mongodb-id>
     <mqtt-topic-filters>
       <mqtt-topic-filter>#</mqtt-topic-filter>
     </mqtt-topic-filters>
     <collection>COLLECTION_NAME_IN_DATABASE</collection>
    <database>DATABASE_NAME_FROM_CLUSTER</database>
     <processor>
       <document-template>document-template.json</document-template>
     </processor>
   </mqtt-to-mongodb-route>
 </mqtt-to-mongodb-routes>
 </hivemq-mongodb-extension>
```

4. Create `document-template.json` in `extensions/hivemq-mongodb-extention` with the following content:
```
{
  "topic": "${mqtt-topic}",
  "metadata": ${mqtt-payload-utf8},
  "timestamp": ISODate("${timestamp-iso-8601}")
}
```

5. Delete the `DISABLED` file in `extensions/hivemq-mongodb-extension`

6. Start the broker by running `./bin/run.sh` from the root of the HiveMQ directory

#### Renable the MongoDB Extension
NOTE: You can the MongoDB extension for a limited amount of time with the free trial version.
In order to renable, use the following steps:

1. Stop the broker
2. Delete `DISABLED` in `/hivemq-mongodb-extension`
3. Start the broker

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

3. Choose a platform to run the app from the command line.

In the output, you'll find options to open the app in a

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
