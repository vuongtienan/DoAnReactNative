import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBEE287k6E9L6dsKQCfeCcWPMzEaneF-48",
    authDomain: "funnychat-cdc10.firebaseapp.com",
    databaseURL: "https://funnychat-cdc10-default-rtdb.firebaseio.com",
    projectId: "funnychat-cdc10",
    storageBucket: "funnychat-cdc10.appspot.com",
    messagingSenderId: "1021502054130",
    appId: "1:1021502054130:web:fb0741e8144460a8c13a6b",
    measurementId: "G-6923YXRJTM"
};

const firebase = initializeApp(firebaseConfig);

const auth = getAuth(firebase);
const db = getDatabase(firebase);

export {auth, db};
export default firebase;