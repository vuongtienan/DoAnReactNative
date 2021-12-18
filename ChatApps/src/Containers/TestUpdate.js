import React from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native'
import firebaseApp,{ auth,db } from "../Firebase/config";
import {set,onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
const {width, height} = Dimensions.get('window')
const TestUpdate = () =>{

    const UpdateRoom = ()=>
    {
        const updates = {};
        const linkRoom = [
            {
                userPartner:312312,
                idRoom:'asdasd'
            }
        ]
        updates['/UserInfo/123123/linkRoom'] = linkRoom;
        return update(ref(db),updates)
    }
    const outRoom = () => {
        const updates = {};
        updates['/RoomTestInfo/asdasd/'] = {
            Member : 
            {
                List:[
                    {
                        key:'asd123',
                        name:'User1'
                    }
                ]
            }
        }
        return update(ref(db),updates);
        // set(ref(db, '/RoomTestInfo/asdasd/asd234'), {
        //     null:[
        //         {
        //             key:'',
        //             name:'',
        //         },
        //         {
        //             key:'123',
        //             name:"User1"
        //         }
        //     ]
        // })
    }

    const removeChat = () => {
        const updates = {};
        updates['/ChatMessagesInfo/asdasd/asd234'] = {
            message:[

            ],
        }
        return update(ref(db),updates);
    }
    return(
        <SafeAreaView style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
            <TouchableOpacity
                onPress={UpdateRoom}
                style={{
                    backgroundColor:'#333',
                    width:width/2,
                    borderRadius:14,
                    padding:15,
                    marginBottom: 10,
                }}
            >
                <Text style={{fontSize:20,textAlign:'center',fontWeight:'bold',color:'#FFF'}}>Push</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={outRoom}
                style={{
                    backgroundColor:'#333',
                    width:width/2,
                    borderRadius:14,
                    padding:15,
                    marginBottom: 10,
                }}
            >
                <Text style={{fontSize:20,textAlign:'center',fontWeight:'bold',color:'#FFF'}}>Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={removeChat}
                style={{
                    backgroundColor:'#333',
                    width:width/2,
                    borderRadius:14,
                    padding:15,
                    marginBottom: 10,
                }}
            >
                <Text style={{fontSize:20,textAlign:'center',fontWeight:'bold',color:'#FFF'}}>Remove</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default TestUpdate