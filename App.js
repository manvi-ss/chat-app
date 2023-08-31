//import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

//import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox } from "react-native";

//import the database
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//creating the navigator
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
