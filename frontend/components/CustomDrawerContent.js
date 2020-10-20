import React, {useState, useEffect, Component} from 'react';
import {StyleSheet, AsyncStorage, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl, user} from '../constants';

// function useUser() {
//   useEffect(() => {
//     const username = AsyncStorage.getItem('username');
//     fetch(`${serverUrl}accounts/gallery/${username}/`, {
//       method: 'GET',
//     })
//       .then(() => {}
//       )
//       .catch(err => console.error(err))
//   }, [username]);
// }

export default function CustomDrawerContent(props) {
    // const [user, setUser] = useState('qwer');
    
    // useEffect(() => {
    //   setUser(
    //     AsyncStorage.getItem("username") ? AsyncStorage.getItem("username")._U : "no"
    //   );
    // }, [user]);
    // const user = await AsyncStorage.getItem('username')._W;
    return (
      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView style={styles.scrollArea}>
          <View>
            <Text>dsf</Text>
            <Image 
              source={{
                uri: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
              }}
              style={{height: 20}}
            />
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('메뉴')}
            style={styles.linkBtn}
          >
            <Text style={styles.drawerTxt}>메뉴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('내 정보')}
            style={styles.linkBtn}
          >
            <Text style={styles.drawerTxt}>내 정보</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
  
        <DrawerItem 
          icon={({color, size}) => (
            <Icon 
              name='log-out-outline'
              color={color}
              size={size}
          />)}
          label="로그아웃"
          labelStyle={{fontFamily: 'BMJUA', fontSize: 20,}}
          onPress={() => {}}
        />
      </SafeAreaView>
    )
  }

// export default class CustomDrawerContent extends Component {
//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         <DrawerContentScrollView style={styles.scrollArea}>
//           <View>
//             <Text>{user.username}dsf</Text>
//             <Image 
//               source={{
//                 uri: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
//               }}
//               style={{height: 20}}
//             />
//           </View>
//           <TouchableOpacity
//             onPress={() => props.navigation.navigate('메뉴')}
//             style={styles.linkBtn}
//           >
//             <Text style={styles.drawerTxt}>메뉴</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => props.navigation.navigate('내 정보')}
//             style={styles.linkBtn}
//           >
//             <Text style={styles.drawerTxt}>내 정보</Text>
//           </TouchableOpacity>
//         </DrawerContentScrollView>
  
//         <DrawerItem 
//           icon={({color, size}) => (
//             <Icon 
//               name='log-out-outline'
//               color={color}
//               size={size}
//           />)}
//           label="로그아웃"
//           labelStyle={{fontFamily: 'BMJUA', fontSize: 20,}}
//           onPress={() => {}}
//         />
//       </SafeAreaView>
//     )
//   }
// }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fbfbe6',
    },
    scrollArea: {
      marginLeft: 20,
    },
    linkBtn: {
      marginTop: 20,
    },
    drawerTxt: {
      fontFamily: 'BMJUA',
      fontSize: 20,
    },
  })