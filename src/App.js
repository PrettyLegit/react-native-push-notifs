import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View, Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions."
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log("pushTokenData", pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("received", notification.request.content.data);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("response", response);
      }
    );

    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "questionable mental state",
        body: "drop out of school to save a couple bands",
        data: { userName: "Bruh" },
      },
      trigger: {
        seconds: 1,
      },
    });
  }

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: `ExponentPushToken[${process.env.push_token}]`,
        title: "push notification",
        body: "drop out of school to save a couple bands",
        data: { userName: "Bruh" },
      }),
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title="Schedule Notifications"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Send Push Notifications"
        onPress={sendPushNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

registerRootComponent(App);
