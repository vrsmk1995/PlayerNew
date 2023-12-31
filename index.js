import { registerRootComponent } from 'expo';

import App from './App';
import PushNotification from "react-native-push-notification";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const loadPrefData = async () => {
    var receivenotification = await AsyncStorage.getItem('receivenotification');
    var dndpref = await AsyncStorage.getItem('dndpref');
    if (receivenotification == "yes") {
        if (dndpref == 'no') {
            PushNotification.configure({
                onNotification: function (notification) {
                    console.log("NOTIFICATION:", notification);
                },
                requestPermissions: Platform.OS == 'ios'

            });
        }
        else
        {
            var dndStartTime = await AsyncStorage.getItem('dndStartTime');
            var dndEndTime = await AsyncStorage.getItem('dndEndTime');
            var starttime = dndStartTime.split(":");
            var endtime = dndEndTime.split(":");
            var now = new Date();
            if(now.getHours()<starttime[0] && now.getHours()>=endtime[0])
            {
                PushNotification.configure({
                    onNotification: function (notification) {
                        console.log("NOTIFICATION:", notification);
                    },
                    requestPermissions: Platform.OS == 'ios'
    
                });
            }
        }
    }

}
loadPrefData()

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);