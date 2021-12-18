import React, { useState,useEffect } from "react";
import { 
    Alert, 
    Modal, 
    StyleSheet, 
    Text, 
    Pressable, 
    View,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
    FlatList,
    TouchableOpacity
} from "react-native";
import { auth,db } from "../Firebase/config";
import {onValue,ref} from 'firebase/database'
const {width, height} = Dimensions.get('window');
const FindUserModal = (props) => {
    const user = auth.currentUser;
    const [listUser,setListUser] = useState([]);
    const [search,onChangeSearch] = useState("");

    useEffect(()=>{
        onValue(ref(db,'Users'),(snapshot)=>{
            var listU = [];
            snapshot.forEach((childSnapshot)=>{
                childSnapshot.key != user.uid ? 
                listU.push({key:childSnapshot.key,val:childSnapshot.val()}):
                null
            })
            setListUser(listU)
        })
    },[])

    return (
        <View>
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
            props.setModalVisible(!visible);
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <View style={{flex:10}}>
                    <Text style={styles.modalText}>Những người dùng khác</Text>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding:5
                    }}>
                        <TextInput
                            style={chatListStyles.InputSearch}
                            onChangeText={onChangeSearch}
                            value={search}
                            placeholder="Tìm kiếm"
                        />
                    </View>
                    <View style={{flex:1,flexDirection: 'column',marginTop:0}}>
            {   
                listUser.length == 0 || listUser == null
                ?
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex:1,
                    }}
                >
                    <Image
                        style={{
                            width:width/4,
                            height:height/6
                        }}
                        resizeMode="contain"
                        source={require('../Assets/image/list-empty.png')}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16}}
                    >Danh sách người dùng rỗng</Text>
                </View>
                :
                <FlatList
                    style={chatListStyles.ChatListContent}
                    data={listUser}
                    renderItem={(data)=>
                        listUser[data.index].val.displayName.includes(search)
                        ?
                        <TouchableOpacity
                            style={{
                                flexDirection:'row',
                                paddingVertical:5,
                                borderRadius:5,
                                borderWidth:0.25,
                                paddingLeft:10,
                                marginBottom:5,
                                alignItems: "center",
                                justifyContent: "flex-start"
                            }}
                            onPress={()=>{
                                var uidPath = listUser[data.index].key;
                                var idRoom = null;

                                listUser[data.index].val.linkRoom != null ?
                                listUser[data.index].val.linkRoom.forEach((element) => {
                                    console.log(element);
                                    if(element.userPartner == user.uid)
                                    {
                                        idRoom = element.idRoom;
                                    }
                                })
                                :
                                null

                                props.setModalVisible(!props.visible)
                                props.navigation.navigate('ChatScreen',{
                                    idRoom,
                                    uid2:uidPath,
                                    name:listUser[data.index].val.displayName})
                                }
                            }
                        >
                            <Image style={{
                                width:width/10,
                                height:width/10,
                                borderRadius:width/20
                            }}
                            source={{uri:listUser[data.index].val.photoURL}}
                            />
                            <Text
                                style={{
                                    paddingLeft:10,
                                    fontWeight:'500',
                                    color:'#333'
                                }}
                            >{listUser[data.index].val.displayName}</Text>
                        </TouchableOpacity> 
                        : null
                    }
                    showsVerticalScrollIndicator={false}
                />
            }
            </View>
                </View>
                
                <View style={{flex:1}}>
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => props.setModalVisible(false)}
                    >
                    <Text style={styles.textStyle}>Đóng</Text>
                    </Pressable>
                </View>
            </View>
            </View>
            </ScrollView>
        </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:"rgba(255,255,255,0.8)"
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      width:width-40,
      height: height-60,
      padding: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      opacity:1,
    },
    button: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      width:width-60,
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });
  const chatListStyles = StyleSheet.create({
    TextHeader:{
        fontSize:16,
        paddingLeft:10,
        color:'#333',
        fontWeight:'500',
    },
    ChatListContainer:{
        //height : height,
        backgroundColor : 'white',
        flex:1,
    },
    ChatListContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingTop:10,
        
    },
    InputSearch:{
        backgroundColor:'#ececec',
        width:width-60,
        borderRadius:14,
        padding:5,
        paddingStart:25,
    },
    SearchBar:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:10,
        backgroundColor:'white'
    }
})
export default FindUserModal;