import React from 'react'
import { TouchableOpacity,Image,View,Text,StyleSheet,Dimensions } from 'react-native'
const {width,height} = Dimensions.get('window');

const ChatListItem = (props) => {
    return(
        <View>
            <View
                style={chatListStyles.SearchBar}
            >
                <Image
                    style={{
                        width:width/6,
                        height:height/14,
                        borderRadius:width
                    }}
                    resizeMode="contain"
                    source={{uri:'https://thispersondoesnotexist.com/image'}}
                />
                <View
                    style={{paddingStart:5}}
                >
                    <Text style={{color: 'black',fontWeight:'800'}}>{props.name}</Text>
                    <Text>{props.lastMessage}</Text>
                </View>
            </View>
        </View>
    )
}
const chatListStyles = StyleSheet.create({
    SearchBar:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom:10,
        backgroundColor:'white'
    }
})
export default ChatListItem