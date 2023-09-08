import { useEffect } from "react";
//import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

//import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { LogBox, Alert } from "react-native";

//import the database
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

//creating the navigator
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDK-MGjKlfbpZo6_AP3rGfdiKaaqPad3iM",
    authDomain: "chatapp-53084.firebaseapp.com",
    projectId: "chatapp-53084",
    storageBucket: "chatapp-53084.appspot.com",
    messagingSenderId: "237066426709",
    appId: "1:237066426709:web:63c806512c73c5063bf7dc",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              db={db}
              storage={storage}
              {...props}
              isConnected={connectionStatus.isConnected}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
