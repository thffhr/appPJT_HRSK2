import React, {useState, useEffect, Component} from 'react';
import {StyleSheet, AsyncStorage, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl, user} from '../constants';
import store from '../src/store/index';

// var user = store.getState();
// store.subscribe(function() {
//   user = store.getState();
// });

// export default function CustomDrawerContent(props) {
//     // const [user, setUser] = useState('qwer');
    
//     // useEffect(() => {
//     //   setUser(
//     //     AsyncStorage.getItem("username") ? AsyncStorage.getItem("username")._U : "no"
//     //   );
//     // }, [user]);
//     // const user = await AsyncStorage.getItem('username')._W;
//     return (
//       <SafeAreaView style={styles.container}>
//         <DrawerContentScrollView style={styles.scrollArea}>
//           <View>
//             <Text>{}dsf</Text>
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

export default class CustomDrawerContent extends Component {
  constructor(props){
    super(props);
    
    // this.state = {
    //   user: store.getState(),
    // };
    // store.subscribe(function(){
    //   // this.setState({user: store.getState()})
    // }.bind(this));
    
  };
  onMenu = () => {  
    this.props.navigation.navigate('메뉴');
  };
  onProfile = () => {
    this.props.navigation.navigate('내 정보');
  };
  render() {
    // console.log(user);
    return (
      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView style={styles.scrollArea}>
          <View>
            {/* {user && (
              <Text>{user.username}dsf</Text>
            )} */}
            <Image 
              source={{
                uri: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
              }}
              style={{height: 20}}
            />
          </View>
          <TouchableOpacity
            onPress={this.onMenu}
            style={styles.linkBtn}
          >
            <Text style={styles.drawerTxt}>메뉴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onProfile}
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
}

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