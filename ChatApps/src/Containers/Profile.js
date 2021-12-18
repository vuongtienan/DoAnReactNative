import React,{useState,useEffect,useRef} from "react"
import { 
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    FlatList,
    Image
} from 'react-native'
import {auth,db} from '../Firebase/config'
const {width,height} = Dimensions.get('window');

const ProfileScreen = ({navigation})=>{
    const user = auth.currentUser;
    return(
        <SafeAreaView style={ProfileStyles.Container}>
            <View style={ProfileStyles.Container}>
                <Image 
                    style={{
                        width:width/2,
                        height:width/2,
                        borderRadius:width/2
                    }}
                    source={{uri:user.photoURL}}/>
                <Text style={ProfileStyles.Title}>{user.displayName}</Text>
                <Text style={ProfileStyles.info}>{user.email}</Text>
                <Text style={ProfileStyles.info}>-- Waiting for update --</Text>
                <TouchableOpacity
                    style={{
                        width:width/2,
                        backgroundColor:'#EC7063',
                        paddingVertical:10,
                        alignItems: 'center',
                        marginTop:50,
                        borderRadius:10
                    }}
                    onPress={()=>{
                        auth.signOut();
                        navigation.replace('LoginScreen');
                    }}
                >
                    <Text style={{color:'#FFF',fontWeight:'bold'}}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

const ProfileStyles = StyleSheet.create({
    Container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    Title:{
        fontWeight:'bold',
        fontSize:24,
        color:'#000',
        marginVertical:5
    },
    info:{
        color:'#333',
        fontWeight:'bold',
    }
})

export default ProfileScreen;