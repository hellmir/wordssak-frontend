import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import TeacherLoginScreen from './screens/TeacherLoginScreen';
import TeacherSignUpScreen from './screens/TeacherSignUpScreen';
import DashboardScreen from "./screens/DashboardScreen";
import OurClassInfoScreen from "./screens/OurClassInfoScreen";

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Main" component={MainScreen}/>
                <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen}/>
                <Stack.Screen name="TeacherSignUp" component={TeacherSignUpScreen}/>
                <Stack.Screen name="Dashboard" component={DashboardScreen}/>
                <Stack.Screen name="OurClassInfo" component={OurClassInfoScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
