import * as React from 'react';
import { StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/home';
import Video from './screens/videoPlayer';
import News from './screens/news';

const Stack = createStackNavigator();
export default function App() {
    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{header:()=>null,}}/>
        <Stack.Screen name="CustomeVideoPlayer" component={Video} options={{header:()=>null,}}/>
        <Stack.Screen name="News" component={News} options={{header:()=>null,}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}