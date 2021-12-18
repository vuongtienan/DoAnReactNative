/**
 * @format
 */

import {AppRegistry,LogBox} from 'react-native';
LogBox.ignoreAllLogs();
//import App from './src/Containers/TestUpdate'
import App from './src/App';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
