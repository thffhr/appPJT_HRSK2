import { AsyncStorage } from 'react-native';

export const serverUrl = 'http://10.0.2.2:8080/';
// export const serverUrl = 'http://localhost:8080/';
// export const serverUrl = 'http://j3a410.p.ssafy.io/api/';

export var user = {
    username: AsyncStorage.getItem('username')._W,
}