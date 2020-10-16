/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, AsyncStorage, Text, View, SafeAreaView, ScrollView} from 'react-native';
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
import BestArticle from './screens/Rank/best_article';
import BestUser from './screens/Rank/best_user';

import Community from './screens/Community/community';
import Comment from './screens/Community/comment';
import CreateSelect from './screens/Community/create_select';
import CreateArticle from './screens/Community/create_article';
import MyFeed from './screens/Community/my_feed';
import UserFeed from './screens/Community/user_feed';

// component
import RankTabBar from './components/RankTapBar';

import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();

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
    <Stack.Navigator initialRouteName="RankTabs" screenOptions={{
      headerShown: false,
    }}>
      {/* <Stack.Screen
        name="Rank"
        component={Rank}
        options={{title: '랭킹페이지'}}
      /> */}
      <Stack.Screen 
        name="RankTabs"
        component={RankTabs}
        option={{title: '랭킹 탭스'}}
      />
      {/* <Stack.Screen 
        name="BestArticle"
        component={BestArticle}
        option={{title: '베스트 아티클'}}
      />
      <Stack.Screen 
        name="BestUser"
        component={BestUser}
        option={{title: '베스트 유저'}}
      /> */}
      <Stack.Screen
        name="Comment"
        component={Comment}
        options={{title: '댓글'}}
      />
      <Stack.Screen
        name="UserFeed"
        component={UserFeed}
        options={{title: '유저 피드'}}
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
      initialRouteName="기록"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === '커뮤니티') {
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

function RankTabs() {
  return (
    <TopTab.Navigator 
      initialRouteName="BestArticle"
      tabBarPosition="top"
      tabBar={props => <RankTabBar {...props} />}
    >
      <TopTab.Screen name="식단" component={BestArticle} />
      <TopTab.Screen name="팔로워" component={BestUser} />
    </TopTab.Navigator>
  );
}

function CustomDrawerContent(props) {
  // const [username, setUsername] = useState(null);

  // useEffect(async () => {
  //   username = await AsyncStorage.getItem('username')
  // })
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('메뉴')}
          style={styles.linkBtn}
        >
          <Text>메뉴</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('내 정보')}
          style={styles.linkBtn}
        >
          <Text>내 정보</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

// Drawer
function DrawerStack() {
  return (
    <>
      <Drawer.Navigator 
        initialRouteName="메뉴" 
        drawerPosition="right" 
        drawerContent={props => CustomDrawerContent(props)}
        screenOptions={{
          headerShown: false,
        }}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    marginLeft: 20,
  },
  linkBtn: {
    marginTop: 20,
  },
})

