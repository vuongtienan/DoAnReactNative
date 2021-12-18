import React,{useState,useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native'
import {auth,db} from '../Firebase/config'
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import {update,ref,push} from 'firebase/database'
const {width, height} = Dimensions.get('window');
const RegisterScreen = ({navigation}) => {
    const [email,onChangeEmail] = useState("");
    const [password,onChangePassword] = useState("");
    const [password2,onChangePassword2] = useState("");
    const [displayName,onChangeDisplayName] = useState("");
    const updateUser =()=> {
        const user = {
            name:'AN123',
        };
        const updates = {};
        updates['/Users/' + 1233] = user;

                //alert('Đăng ký thành công')
        return update(ref(db), updates);
    }
    const RegisterAnAccount = ()=>{
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) == true && password.length >= 6)
        {
            if(password == password2)
            {
                if(displayName != "")
                {
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        updateProfile(auth.currentUser, {
                            displayName: displayName,
                            photoURL: "https://thispersondoesnotexist.com/image"
                        })
                        const user = {
                            uid: userCredential.user.uid,
                            email : userCredential.user.email,
                            displayName: displayName,
                            photoURL : "https://thispersondoesnotexist.com/image",
                        }
                        const updates = {};
                        updates['/Users/' + userCredential.user.uid] = user;
                        alert('Đăng ký thành công')
                        return update(ref(db), updates);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        errorMessage =='Firebase: Error (auth/email-already-in-use).'?
                        alert('Tài khoản đã tồn tại'):
                        null
                    });
                }
                else{
                    alert('Tên hoặc biệt danh không được để trống')
                }
            }
            else{
                alert('Mật khẩu không trùng khớp');
            }
        }
        else{
            alert("Không hợp lệ, vui lòng kiểm tra mật khẩu hoặc email")
        }
    }
    return (
        <SafeAreaView style={RegisterStyle.Container}>
            <Text style={RegisterStyle.Title}>FUNNY CHAT</Text>
            <Text style={RegisterStyle.Title2}>Đăng ký ngay</Text>
            <View> 
                <TextInput
                    style={RegisterStyle.Input}
                    value={email}
                    placeholder="Nhập email"
                    onChangeText={onChangeEmail}
                />
                <TextInput
                    style={RegisterStyle.Input}
                    value={displayName}
                    placeholder="Nhập tên hoặc biệt danh"
                    onChangeText={onChangeDisplayName}
                />
                <TextInput
                    style={RegisterStyle.Input}
                    value={password}
                    placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                    onChangeText={onChangePassword}
                />
                <TextInput
                    style={RegisterStyle.Input}
                    value={password2}
                    placeholder="Nhập lại mật khẩu"
                    onChangeText={onChangePassword2}
                />
                <TouchableOpacity 
                    onPress={email.length==0?updateUser:RegisterAnAccount}
                    style={RegisterStyle.Button}>
                    <Text style={RegisterStyle.textButton}>Đăng ký</Text>  
                </TouchableOpacity>   
                <Text style={{textAlign: 'center',padding:10}}>Đã có tài khoản? 
                    <Text
                        onPress={()=> {navigation.goBack()}} 
                        style={RegisterStyle.Link}> Đăng nhập</Text></Text>          
            </View>
        </SafeAreaView>
    )
}

const RegisterStyle = StyleSheet.create({
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
    Title2: {
        fontSize:20,
        fontWeight: 'bold',
        color:'#333',
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
export default RegisterScreen