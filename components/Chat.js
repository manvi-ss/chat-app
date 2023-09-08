import { useEffect, useState } from "react";
import CustomsActions from "./CustomActions";
import MapView from "react-native-maps";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]); //Creating message state

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  useEffect(() => {
    let unsubMessages;
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  //onsend function addMessage()
  const addMessage = async (newMessages) => {
    const newMessageRef = await addDoc(
      collection(db, "messages"),
      newMessages[0]
    );
    if (!newMessageRef.id) {
      Alert.alert("Unable to add. Please try later");
    }
  };

  // const onSend = (newMessages) => {
  //   addDoc(collection(db, "messages"), newMessages[0]);
  // };

  const renderInputToolbar = (props) => {
    //render input toolbar function
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };
  const renderCustomActions = (props) => {
    return <CustomsActions storage={storage} userID={userID} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(message) => addMessage(message)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
