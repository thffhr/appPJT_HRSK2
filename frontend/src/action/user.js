import { ActionSheetIOS } from "react-native";

export const LOGIN = 'LOGIN';

export function login(user) {
    console.log('action')
    return {
        type: LOGIN,
        user: user,
    }
};