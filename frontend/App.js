/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, AsyncStorage, Text, View} from 'react-native';
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from 'react-native-splash-screen';

import Login from './screens/Account/login';
import Signup from './screens/Account/signup';
import Profile from './screens/Account/profile';
import Update from './screens/Account/update';
import UpdateImg from './screens/Account/updateImg';
import Startsex from './screens/Account/start_sex';
import Startinfo from './screens/Account/start_info';

import Record from './screens/Record/record';
import DetailImage from './screens/Record/detail_image';
import MyDatePicker from './screens/Record/date_picker';

import Rank from './screens/Rank/rank';

import Community from './screens/Community/community';
import Comment from './screens/Community/comment';
import CreateSelect from './screens/Community/create_select';
import CreateArticle from './screens/Community/create_article';
import MyFeed from './screens/Community/my_feed';
import UserFeed from './screens/Community/user_feed';

import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Stack

function CommunityStack() {
  return (
    <Stack.Navigator initialRouteName="Community" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="Community"
        component={Community}
        options={{title: '커뮤니티'}}
      />
      <Stack.Screen
        name="MyFeed"
        component={MyFeed}
        options={{title: '내 피드 디테일 사진'}}
      />
      <Stack.Screen
        name="UserFeed"
        component={UserFeed}
        options={{title: '유저 피드'}}
      />
      <Stack.Screen
        name="Comment"
        component={Comment}
        options={{title: '댓글'}}
      />
      <Stack.Screen
        name="CreateSelect"
        component={CreateSelect}
        options={{title: '사진선택'}}
      />
      <Stack.Screen
        name="CreateArticle"
        component={CreateArticle}
        options={{title: '게시물작성'}}
      />
    </Stack.Navigator>
  )
}

function RecordStack() {
  return (
    <Stack.Navigator initialRouteName="Record" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="Record"
        component={Record}
        options={{title: '내 기록'}}
      />
      <Stack.Screen
        name="DetailImage"
        component={DetailImage}
        options={{title: '상세 이미지'}}
      />
      <Stack.Screen 
        name="MyDatePicker"
        component={MyDatePicker}
        options={{title: '날짜 선택'}}
      />
    </Stack.Navigator>
  )
}

function RankStack() {
  return (
    <Stack.Navigator initialRouteName="Rank" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="Rank"
        component={Rank}
        options={{title: '랭킹페이지'}}
      />
    </Stack.Navigator>
  )
}

function AcccountStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{title: '회원가입'}}
      />
      <Stack.Screen
        name="Startsex"
        component={Startsex}
        options={{title: '성별입력'}}
      />
      <Stack.Screen
        name="Startinfo"
        component={Startinfo}
        options={{title: '정보입력'}}
      />
    </Stack.Navigator>
  )
}

function ProfileScreen() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{title: '프로필'}}
      />
      <Stack.Screen
        name="UpdateImg"
        component={UpdateImg}
        options={{title: '프로필이미지변경'}}
      />
      <Stack.Screen
        name="Update"
        component={Update}
        options={{title: '프로필변경'}}
      />
    </Stack.Navigator>
  );
}

// Tab
function TapNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '커뮤니티') {
            iconName = focused ? 'earth' : 'earth-outline';
          } else if (route.name === '기록') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === '랭킹') {
            iconName = focused ? 'medal' : 'medal-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#fca652',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="기록" component={RecordStack} />
      <Tab.Screen name="커뮤니티" component={CommunityStack} />
      <Tab.Screen name="랭킹" component={RankStack} />
    </Tab.Navigator>
  )
}

// Drawer
function DrawerStack() {
  return (
    <>
      <Drawer.Navigator initialRouteName="메뉴" screenOptions={{
        headerShown: false,
      }}>
        <Drawer.Screen name="메뉴" component={TapNavigator} />
        <Drawer.Screen name="내 정보" component={ProfileScreen} />
      </Drawer.Navigator>
    </>
  )
}

const stackApp = createStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="로그인" screenOptions={{
      headerShown: false,
    }}>
        <stackApp.Screen name="로그인" component={AcccountStack} />
        <stackApp.Screen name="drawer" component={DrawerStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoggedIn: false,
//     };
//   }
//   async componentDidMount() {
//     SplashScreen.hide();
//     // you might want to do the I18N setup here
//     const username = await AsyncStorage.getItem('username');
//     if (username !== null) {
//       this.setState({isLoggedIn: true});
//     }
//   }
//   // //////////////////////////////////////////
//   // useInterval = (callback, delay) => {
//   //   const savedCallback = useRef();
//   //   // Remember the latest callback.
//   //   useEffect(() => {
//   //     savedCallback.current = callback;
//   //   }, [callback]);
//   //   // Set up the interval.
//   //   useEffect(() => {
//   //     function tick() {
//   //       savedCallback.current();
//   //     }
//   //     if (delay !== null) {
//   //       let id = setInterval(tick, delay);
//   //       return () => clearInterval(id);
//   //     }
//   //   }, [delay]);
//   // };
//   // /////////////////////////////////////////
//   render() {
//     return (
//       <NavigationContainer style={styles.container}>
//         <Stack.Navigator
//           initialRouteName="Login"
//           screenOptions={{
//             headerShown: false,
//           }}>
//           <Stack.Screen
//             name="Login"
//             component={Login}
//             options={{title: '로그인'}}
//           />
//           <Stack.Screen
//             name="Signup"
//             component={Signup}
//             options={{title: '회원가입'}}
//           />
//           <Stack.Screen
//             name="Home"
//             component={Home}
//             options={{title: '하루세끼'}}
//           />
//           <Stack.Screen
//             name="Record"
//             component={Record}
//             options={{title: '내 기록'}}
//           />
//           <Stack.Screen
//             name="DetailImage"
//             component={DetailImage}
//             options={{title: '상세 이미지'}}
//           />
//           <Stack.Screen
//             name="Profile"
//             component={Profile}
//             options={{title: '프로필'}}
//           />
//           <Stack.Screen
//             name="UpdateImg"
//             component={UpdateImg}
//             options={{title: '프로필이미지변경'}}
//           />
//           <Stack.Screen
//             name="Update"
//             component={Update}
//             options={{title: '프로필변경'}}
//           />
//           <Stack.Screen
//             name="Startsex"
//             component={Startsex}
//             options={{title: '성별입력'}}
//           />
//           <Stack.Screen
//             name="Startinfo"
//             component={Startinfo}
//             options={{title: '정보입력'}}
//           />
//           <Stack.Screen
//             name="Rank"
//             component={Rank}
//             options={{title: '랭킹페이지'}}
//           />
//           <Stack.Screen
//             name="Community"
//             component={Community}
//             options={{title: '커뮤니티'}}
//           />
//           <Stack.Screen
//             name="MyFeed"
//             component={MyFeed}
//             options={{title: '내 피드'}}
//           />
//           <Stack.Screen
//             name="UserFeed"
//             component={UserFeed}
//             options={{title: '유저 피드'}}
//           />
//           <Stack.Screen
//             name="Comment"
//             component={Comment}
//             options={{title: '댓글'}}
//           />
//           <Stack.Screen
//             name="CreateSelect"
//             component={CreateSelect}
//             options={{title: '사진선택'}}
//           />
//           <Stack.Screen
//             name="CreateArticle"
//             component={CreateArticle}
//             options={{title: '게시물작성'}}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;
