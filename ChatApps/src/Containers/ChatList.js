import React,{useState,useEffect,useRef} from "react"
import { 
    Alert,
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
import ChatListItem from '../Components/ChatListItem'
import FindUserModal from "../Components/FindUserModal"
import {auth,db} from '../Firebase/config'
import {onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const ChatListScreen = ({navigation}) => {
    const user = auth.currentUser;
    const [chats,setChats] =  useState([])
    const [search,onChangeSearch] = useState("");
    const [messages,onChangeMessages] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const scrollViewRef = useRef();

    const addRoom = ()=>{
        setModalVisible(!modalVisible);
    //     var datetime = new Date();
    //     var date = datetime.toLocaleDateString('en-GB');
    //     const Room = {
    //         CreateAt:date,
    //         LastMessage:'Hello Quan',
    //         Member:[
    //             {
    //                 displayName:'Tran Minh Quan',
    //                 uid:user.uid,
    //             },
    //             {
    //                 displayName:'Test User',
    //                 uid:'DDjvPDAPd5cyVeg6G2ZbZnbZqt',
    //             }
    //         ]
    //     }
    //     const newRoom = push(child(ref(db), 'Chasts')).key;
    //     const updates = {};
    //     updates['Chats/'+newRoom] = Room;
    //     return update(ref(db),updates);
    }
    const RemoveChatRoom = (props)=>{
        Alert.alert(
            "Cảnh báo",
            "Xác nhận xóa đoạn hội thoại với "+props.name,
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "OK", onPress: () =>{
                const updates = {};
                updates['/Chats/'+props.idRoom+'/Member/'] = 
                        [
                            {
                                uid:'',
                                displayName:user.displayName
                            },
                            {
                                uid:props.uid2,
                                displayName:props.name
                            }
                        ]
                updates['/ChatMessage/'+props.idRoom+'/'+user.uid] = {
                    message:[
                    ],
                }
                return update(ref(db),updates);
              } }
            ]
          );
    }
    const OpenChatScreen = (props)=>{
        navigation.navigate('ChatScreen',{idRoom:props.idRoom,name:props.nameAnotherUser,uid2:props.uid2})
    }

    //useEffect
    useEffect(()=>{
        onValue(ref(db,'Chats'),(snapshot)=>{
            var listRoom = [];
            snapshot.forEach((childSnapshot)=>{
                childSnapshot.val().Member[0].uid == user.uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):
                childSnapshot.val().Member[1].uid == user.uid ? 
                listRoom.push({key:childSnapshot.key,val:childSnapshot.val()}):null;
            })
            setChats(listRoom);
        })
    },[])
    return(
        <SafeAreaView style={chatListStyles.ChatListContainer}>
            <TouchableOpacity 
                onPress={()=>navigation.navigate('ProfileScreen')}
                activeOpacity={0.9}
                style={chatListStyles.ChatListHeader}>
                <Image 
                    style={{
                        width: windowHeight*1/12-10,
                        height: windowHeight*1/12-10,
                        borderRadius: windowHeight*1/6
                    }}
                    source={{uri:'https://thispersondoesnotexist.com/image'}}
                />
                <Text style={chatListStyles.TextHeader}>{user.displayName}</Text>
            </TouchableOpacity>
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
                chats.length == 0 || chats == null
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
                            width:windowWidth/4,
                            height:windowHeight/6
                        }}
                        resizeMode="contain"
                        source={require('../Assets/image/list-empty.png')}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16}}
                    >Danh sách trò chuyện rỗng</Text>
                </View>
                :
                <FlatList
                    style={chatListStyles.ChatListContent}
                    data={chats}
                    renderItem={(data)=>
                        <TouchableOpacity
                            onLongPress={()=>{
                                RemoveChatRoom({name:chats[data.index].val.Member[0].uid == user.uid 
                                    ? chats[data.index].val.Member[1].displayName
                                    : chats[data.index].val.Member[0].displayName,
                                uid2:chats[data.index].val.Member[0].uid == user.uid 
                                ? chats[data.index].val.Member[1].uid
                                : chats[data.index].val.Member[0].uid,
                                idRoom:chats[data.index].key})
                            }}
                            onPress={()=>OpenChatScreen({
                                idRoom:chats[data.index].key,
                                nameAnotherUser: chats[data.index].val.Member[0].uid == user.uid 
                                ? chats[data.index].val.Member[1].displayName
                                : chats[data.index].val.Member[0].displayName,
                                uid2:chats[data.index].val.Member[0].uid == user.uid 
                                ? chats[data.index].val.Member[1].uid
                                : chats[data.index].val.Member[0].uid
                            })}
                        >
                            {
                                chats[data.index].val.Member[0].displayName.includes(search)
                                ?
                                <ChatListItem 
                                    key={chats[data.index].key} 
                                    name={
                                        chats[data.index].val.Member[0].uid == user.uid 
                                        ? chats[data.index].val.Member[1].displayName
                                        : chats[data.index].val.Member[0].displayName
                                    } 
                                    lastMessage={chats[data.index].val.LastMessage.val}/>
                                :chats[data.index].val.Member[1].displayName.includes(search)
                                ?
                                <ChatListItem 
                                key={chats[data.index].key} 
                                name={
                                    chats[data.index].val.Member[0].uid == user.uid 
                                    ? chats[data.index].val.Member[1].displayName
                                    : chats[data.index].val.Member[0].displayName
                                } 
                                lastMessage={chats[data.index].val.LastMessage}/>
                                :null
                            }
                            
                        </TouchableOpacity>  
                    }
                    showsVerticalScrollIndicator={false}
                />
            }
            </View>
            <TouchableOpacity
                style={{backgroundColor:'#333',paddingVertical:10,alignItems: 'center'}}
                onPress={addRoom}
            >
                <Text style={{color:'#FFF',fontWeight:'bold'}}>Thêm</Text>
            </TouchableOpacity>
            <FindUserModal 
                visible={modalVisible}
                setModalVisible = {setModalVisible} 
                navigation = {navigation}
            />
        </SafeAreaView>
       
    );
}
//App Color : '#2596be'
const chatListStyles = StyleSheet.create({
    TextHeader:{
        fontSize:16,
        paddingLeft:10,
        color:'#333',
        fontWeight:'500',
    },
    ChatListContainer:{
        //height : windowHeight,
        backgroundColor : 'white',
        flex:1,
    },
    ChatListContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingTop:10,
        
    },
    ChatListHeader:{
        flexDirection:'row',
        height : windowHeight*1/12,
        justifyContent: 'flex-start',
        alignItems:'center',
        backgroundColor:'#2596be',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 5},
        shadowRadius: 10,
        elevation: 5,
        paddingLeft:15,
    },
    InputSearch:{
        backgroundColor:'#ececec',
        width:windowWidth-20,
        borderRadius:25,
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

export default ChatListScreen