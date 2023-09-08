import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const image = require("../media/images/background-image.png");

const backgroundColors = {
  a: "#757083",
  b: "#474056",
  c: "#8A95A5",
  d: "#B9C6AE",
};

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState("");
  const [color, setColor] = useState(backgroundColors.d);

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          name: name,
          userID: result.user.uid,
          color: color,
        });
        Alert.alert("Signed in Succesfully");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in , try later again.");
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.appTitle}> Chit-Chat</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />
          <Text style={styles.textColorSelect}> Choose Background Color</Text>
          <View style={styles.colorSelector}>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.a && styles.selectedCircle,
                { backgroundColor: backgroundColors.a },
              ]}
              onPress={() => setColor(backgroundColors.a)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.b && styles.selectedCircle,
                { backgroundColor: backgroundColors.b },
              ]}
              onPress={() => setColor(backgroundColors.b)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.c && styles.selectedCircle,
                { backgroundColor: backgroundColors.c },
              ]}
              onPress={() => setColor(backgroundColors.c)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.d && styles.selectedCircle,
                { backgroundColor: backgroundColors.d },
              ]}
              onPress={() => setColor(backgroundColors.d)}
            ></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={signInUser}>
            <Text style={styles.buttonstyle}> Start Chatting Here!</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    padding: "6%",
  },
  appTitle: {
    flex: 2,
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "center",
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: "6%",
    flexBasis: 150,
  },
  textInput: {
    width: "88%",
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    borderColor: "#757083",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
  },
  textColorSelect: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "300",
    color: "#000000",
  },
  colorSelector: {
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#000000",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#757083",
    padding: 10,
    borderRadius: 10,
  },
  buttonstyle: {
    fontSize: 20,
    fontWeight: "600",
  },
});
export default Start;
