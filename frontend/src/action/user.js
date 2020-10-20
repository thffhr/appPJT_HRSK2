export const LOGIN = 'LOGIN';

export function login(user) {
    console.log('action: ', user)
    return {
        type: LOGIN,
        user: user,
    }
    
};