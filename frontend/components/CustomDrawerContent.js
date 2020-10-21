import React, {Component} from 'react';
import {StyleSheet, AsyncStorage, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { serverUrl } from '../constants';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class CustomDrawerContent extends Component {
  constructor(props){
    super(props);
    
  };
  onMenu = () => {
    this.props.navigation.navigate('메뉴');
  };
  onProfile = () => {
    this.props.navigation.navigate('내 정보');
  };
  // onLogout = () => {
  //   fetch(`${serverUrl}rest-auth/logout/`, {
  //     method: 'POST',
  //     header: {
  //       Authorization: `Token ${this.props.user.token}`,
  //     },
  //   })
  //     .then(() => {
  //       console.log('로그아웃 성공');
  //       AsyncStorage.clear();
  //       this.props.navigation.dispatch(
  //         CommonActions.reset({
  //           index: 1,
  //           routes: [{name: '로그인'}],
  //         }),
  //       );
  //     })
  //     .catch((err) => console.error(err));
  // };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView style={styles.scrollArea}>
          <View style={styles.profileBox}>
            <Image 
              source={{
                uri: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
              }}
              style={styles.profileImg}
            />
            <Text style={styles.profileTxt}>{this.props.user.username}</Text>
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
  // profile
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center', 
  },
  profileImg: {
    width: 50,
    height: 50,
  },
  profileTxt: {
    fontFamily: 'BMJUA',
    fontSize: 25,
    marginLeft: 20,
  },
  // link
  linkBtn: {
    marginTop: 20,
  },
  drawerTxt: {
    fontFamily: 'BMJUA',
    fontSize: 20,
  },
})

// export default CustomDrawerContent;
export default connect(mapStateToProps)(CustomDrawerContent);