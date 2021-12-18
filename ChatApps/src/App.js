import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Containers/LoginScreen';
import RegisterScreen from './Containers/RegisterScreen';
import ChatListScreen from './Containers/ChatList';
import ChatScreen from './Containers/ChatScreen';
import ProfileScreen from './Containers/Profile';
import FindUserModal from './Components/FindUserModal';
const Stack = createNativeStackNavigator();
const App = ()=>{
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='LoginScreen' component={LoginScreen}/>
                <Stack.Screen name='RegisterScreen' component={RegisterScreen}/>
                <Stack.Screen name='ChatListScreen' component={ChatListScreen}/>
                <Stack.Screen name='ChatScreen' component={ChatScreen} 
                initialParams={{ idRoom: null }}/>
                <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
                <Stack.Screen name='FindUserModal' component={FindUserModal}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App