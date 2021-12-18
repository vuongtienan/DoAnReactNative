import React,{useState,useRef,useEffect} from "react"
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
import firebaseApp,{ auth,db } from "../Firebase/config";
import {onValue,ref,onChildChanged,update,push,child,onChildAdded,onChildRemoved} from 'firebase/database'
const windowWidth = Dimensions.get('window').width;     
const windowHeight = Dimensions.get('window').height;

const ChatMessage = (Props) => {
    return(
        <View style={Props.uid == Props.currentID ? chatStyles.chatMessageCurrentUser:chatStyles.chatMessageAnotherUser}>
            <Text style={Props.uid == Props.currentID ? chatStyles.textMessageCurrentUser:chatStyles.textMessageAnothertUser}>{Props.messages}</Text>
            <Text style={[chatStyles.textTime,Props.uid == Props.currentID ? chatStyles.textTimeCurrentUser:chatStyles.textTimeAnother]}>{Props.time}</Text>
        </View>
    )
}
const ChatScreen = ({route}) => {
    const [userindex,setUserIndex] = useState(()=> {return true});
    const [chats,setChats] =  useState([]);
    const [user,setUser] = useState([]);
    const [messages,onChangeMessages] = useState("");
    const scrollViewRef = useRef();
    const uid = auth.currentUser.uid;
    const [idRoom,setIDRoom] = useState(route.params.idRoom);
    const uid2 = route.params.uid2;
    const user2 = route.params.name;
    
    console.log({idRoom});
    const sendMessage = ()=>{
        if(idRoom == null)
        {
            
            var datetime = new Date();
            var date = datetime.toLocaleDateString('en-GB');
            var time = datetime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

            const newChatMessage = {
                message: messages,
                sentBy:uid,
                sentDate:date,
                sentTime:time,
            }
            const newChatsRoom = {
                CreateAt:`${time} ${date}`,
                LastMessage:{
                    val:messages
                },
                Member:[
                        {
                            uid:uid,
                            displayName:auth.currentUser.displayName
                        },
                        {
                            uid:uid2,
                            displayName:user2
                        }
                    ]
            };
            
            const newChatsRoomKey = push(child(ref(db), 'Chats')).key;
            const newMessageKey = push(child(ref(db), 'ChatMessage')).key;
            const updates = {};
            const linkRoom1 = [
                {
                    userPartner:uid2,
                    idRoom:newChatsRoomKey
                }
            ]
            const linkRoom2 = [
                {
                    userPartner:uid,
                    idRoom:newChatsRoomKey
                }
            ]
            updates['/Users/'+uid+'/linkRoom'] = linkRoom1;
            updates['/Users/'+uid2+'/linkRoom'] = linkRoom2;
            updates ['Chats/'+newChatsRoomKey] = newChatsRoom;
            const User = [uid,uid2]
            updates ['ChatMessage/'+newChatsRoomKey+'/User'] = User;
            updates ['ChatMessage/'+newChatsRoomKey+'/'+uid+'/message/'+newMessageKey] = newChatMessage;
            updates ['ChatMessage/'+newChatsRoomKey+'/'+uid2+'/message/'+newMessageKey] = newChatMessage;
            setIDRoom(newChatsRoomKey);
            onChangeMessages('');
            return update(ref(db),updates);    
        }
        else
        {
            var datetime = new Date();
            var date = datetime.toLocaleDateString('en-GB');
            var time = datetime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

            const newMessage = {
                message: messages,
                sentBy:uid,
                sentDate:date,
                sentTime:time,
            }
            const ChatsRoom = {
                CreateAt:`${time} ${date}`,
                LastMessage: {
                    val:messages,
                },
                Member:[
                    {
                        uid:uid,
                        displayName:auth.currentUser.displayName
                    },
                    {
                        uid:user.length == 0 ? '' : user[0].includes(uid) ? user[1] : user[0],
                        displayName:user2
                    }
                ]
            };
            const newMessageKey = push(child(ref(db), 'ChatMessage')).key;
            const updates = {};
            if(uid2 == '')
            {
                var uidUser2 = user[0].includes(uid) ? user[1] : user[0];
                updates['Chats/'+idRoom] = ChatsRoom;
                updates['ChatMessage/'+idRoom+'/'+uid+'/message/'+newMessageKey] = newMessage;
                updates['ChatMessage/'+idRoom+'/'+uidUser2+'/message/'+newMessageKey] = newMessage;
            }
            else
            {
                updates['Chats/'+idRoom+'/LastMessage/'] = {
                    val:messages
                };
                updates['ChatMessage/'+idRoom+'/'+uid+'/message/'+newMessageKey] = newMessage;
                updates['ChatMessage/'+idRoom+'/'+uid2+'/message/'+newMessageKey] = newMessage;
            }
            onChangeMessages('');
            return update(ref(db),updates);
        }
    }
    const setChatData = ()=>{
        console.log(user[0].includes(uid) ? user[1] : user[0]);
    }
    console.log(user);
    useEffect(()=>{
        onValue(ref(db,'ChatMessage/'+idRoom+'/'),(snapshot)=>{
            var User = typeof(snapshot.val()) == undefined ? [] : snapshot.val() == null ? [] : snapshot.val().User;
            setUser(User)
        });
    },[idRoom])

    useEffect(()=>{
        onValue(ref(db,'ChatMessage/'+idRoom+'/'+uid+'/message'),(snapshot)=>{
            var chatMessage = [];
            snapshot.forEach((childSnapshot)=>{
                chatMessage.push({key:childSnapshot.key,val:childSnapshot.val()});
            })
            setChats(chatMessage)
        })
    },[idRoom])
    
    return(
        <SafeAreaView style={styles.ChatContainer}>
            <View style={styles.ChatHeader}>
                <Text style={styles.TextHeader}>{user2}</Text>
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
                        source={require('../Assets/image/newChat.png')}
                    />
                    <Text
                        style={{textAlign: 'center',fontSize:16}}
                    >Gửi gì đó để bắt đầu cuộc trò chuyện</Text>
                </View>
                :
                <FlatList
                    style={styles.ChatContent}
                    data={chats}
                    renderItem={(data)=>
                        <ChatMessage time={chats[chats.length - data.index - 1].val.sentTime} currentID={uid} key={chats[chats.length-data.index-1].key} uid={chats[chats.length - data.index - 1].val.sentBy} messages={chats[chats.length - data.index - 1].val.message}/>  
                    }
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    onLayout={() => scrollViewRef.current.scrollToOffset({animated:true,offset:0})}
                    inverted
                />
            }
                <View style={styles.ChatControl}>
                    <TextInput
                        placeholder="Nhập tin nhắn..."
                        style={chatStyles.Input}
                        onChangeText = {onChangeMessages}
                        value = {messages}
                    />
                    <TouchableOpacity
                        onPress={messages != '' ? sendMessage : setChatData}
                        style={chatStyles.ButtonSend}
                    >
                        <Text style={chatStyles.textSend}>Send</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    //App Color : '#2596be'
    ChatContainer:{
        //height : windowHeight,
        backgroundColor : 'white',
        flex:1,
    },
    ChatContent:{
        flex:1,
        backgroundColor:'#ffff',
        paddingHorizontal:10,
        paddingVertical:10,
    },
    ChatHeader:{
        height : windowHeight*1/12,
        justifyContent: 'center',
        alignItems:'flex-start',
        backgroundColor : '#fff',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 5},
        shadowRadius: 10,
        elevation: 5,
    },
    ChatControl:{
        //height : windowHeight*1/12,
        //flex:1,
        backgroundColor : '#fffe',
        flexDirection: 'row',
        backgroundColor : '#fff',
        justifyContent:"center",
        alignItems: 'center',
        paddingBottom:10,
        paddingLeft:10,
        paddingTop:5, 
    },
    TextHeader:{
        fontSize:20,
        paddingLeft:10,
        color:'black',
        fontWeight:'500',
    },
})
const chatStyles = StyleSheet.create({
    Input:{
        width: windowWidth*5/6,
        backgroundColor : '#EAECEE',
        borderRadius:25,
        fontSize:16,
        paddingLeft:15,
        height:38,
    },
    ButtonSend:{
        width: windowWidth*1/6,
    },
    textSend:{
        fontSize:16,
        textAlign:'center',
        fontWeight:'900',
        color:'#2596be',
    },
    chatMessageCurrentUser:{
        backgroundColor:'#2596be',
        borderRadius:10,
        marginBottom:5,
        marginLeft:windowWidth*1/4,
        alignSelf:'flex-end'
    },
    textMessageCurrentUser:{
        color:"white",
        padding:10,
        textAlign:'justify',
    },
    chatMessageAnotherUser:{
        backgroundColor : '#E5E7E9',
        borderRadius:10,
        marginBottom:5,
        marginRight:windowWidth*1/4,
        alignSelf: 'flex-start'
    },
    textMessageAnothertUser:{
        color:'black',
        padding:10,
        textAlign:'justify',
    },
    textTime:{
        paddingBottom:5,
        alignSelf:'flex-end',
        fontSize:12,
        fontWeight:'400'
    },
    textTimeCurrentUser:{
        alignSelf:'flex-end',
        paddingRight:10,
    },
    textTimeAnother:{
        alignSelf:'flex-start',
        paddingLeft:10,
    }
})

export default ChatScreen