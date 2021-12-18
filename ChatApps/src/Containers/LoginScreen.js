import React,{useState,useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native'
import {auth,db} from '../Firebase/config'
import { signInWithEmailAndPassword} from 'firebase/auth'
const {width, height} = Dimensions.get('window');
const LoginScreen = ({navigation}) => {
    const [email,onChangeEmail] = useState("");
    const [password,onChangePassword] = useState("");

    const LoginChatApps = ()=>{
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == true && password.length >= 6)
        {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigation.replace('ChatListScreen')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                errorMessage == 'Firebase: Error (auth/user-not-found).'?
                alert('Không tìm thấy tài khoản trong hệ thống'):
                null
            })
        }
        else{
            alert("Tài khoản không hợp lệ")
        }
    }
    return (
        <SafeAreaView style={LoginStyles.Container}>
            <Text style={LoginStyles.Title}>FUNNY CHAT</Text>
            <View> 
                <TextInput
                    style={LoginStyles.Input}
                    value={email}
                    placeholder="Nhập email"
                    onChangeText={onChangeEmail}
                />
                <TextInput
                    style={LoginStyles.Input}
                    value={password}
                    placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                    onChangeText={onChangePassword}
                    secureTextEntry={password==''?false:true}
                />
                <TouchableOpacity 
                    onPress={email.length==0?null:LoginChatApps}
                    style={LoginStyles.Button}>
                    <Text style={LoginStyles.textButton}>Đăng nhập</Text>  
                </TouchableOpacity>   
                <Text style={{textAlign: 'center',padding:10}}>Chưa có tài khoản? 
                    <Text
                        onPress={()=>navigation.navigate('RegisterScreen')} 
                        style={LoginStyles.Link}> Đăng ký</Text></Text>          
            </View>
        </SafeAreaView>
    )
}

const LoginStyles = StyleSheet.create({
    Container: {
        flex:1,
        paddingHorizontal:20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Title: {
        fontSize:24,
        textAlign: 'center',
        fontWeight: 'bold',
        color:'#6C3483',
        marginBottom:20
    },
    Input:{
        backgroundColor:'#F2F4F4',
        marginBottom:10,
        borderRadius:5,
        borderWidth:0.25,
        padding:5,
        paddingLeft:15

    },
    textButton: {
        color:'#FFFF',
        fontWeight:'bold',
        textAlign:'center',
    },
    Button: {
        backgroundColor:'#333',
        width:width-40,
        borderRadius:10,
        paddingVertical:10,
    },
    Link:{
        color:'#3498DB',
        fontWeight:'400',
    }
})
export default LoginScreen