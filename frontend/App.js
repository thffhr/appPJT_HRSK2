/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {NavigationContainer, StackRouter} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SplashScreen from 'react-native-splash-screen';

import Login from './screens/Account/login';
import Signup from './screens/Account/signup';
import Profile from './screens/Account/profile';
import Update from './screens/Account/update';
import Startsex from './screens/Account/start_sex';
import Startinfo from './screens/Account/start_info';

import Gallery from './screens/Record/gallery/gallery';
import Record from './screens/Record/record/record';
import Calendar from './screens/Record/calendar/calendar';
import DetailImage from './screens/Record/gallery/detail_image';
import MyDatePicker from './screens/Record/gallery/date_picker';

import BestArticle from './screens/Rank/best_article';
import BestUser from './screens/Rank/best_user';

import Community from './screens/Community/community';
import Comment from './screens/Community/comment';
import CreateSelect from './screens/Community/create_select';
import CreateArticle from './screens/Community/create_article';
import MyFeed from './screens/Community/my_feed';
import UserFeed from './screens/Community/user_feed';

// component
import CustomDrawerContent from './components/CustomDrawerContent';

import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { store } from './src/store/index';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const TopTab = createMaterialTopTabNavigator();
const tapOptions = {
  activeTintColor: '#fca652',
  inactiveTintColor:'gray',
  style:{
    backgroundColor:'#fbfbe6',
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
  
  },
  indicatorStyle: {
    borderBottomColor: '#fca652',
    borderBottomWidth: 5,
  },
}

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
        component={RecordTaps}
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
      <Stack.Screen 
        name="RankTabs"
        component={RankTabs}
        option={{title: '랭킹 탭스'}}
      />
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
      tabBarOptions={tapOptions}
    >
      <TopTab.Screen name="식단" component={BestArticle} />
      <TopTab.Screen name="팔로워" component={BestUser} />
    </TopTab.Navigator>
  );
}


function RecordTaps() {
  return (
    <TopTab.Navigator
      initialRouteName="BestArticle"
      tabBarPosition="top"
      tabBarOptions={tapOptions}
    >
      <TopTab.Screen name="사진" component={Gallery}/>
      <TopTab.Screen name="기록" component={Record}/>
      <TopTab.Screen name="달력" component={Calendar}/>
    </TopTab.Navigator>
  )
}

// Drawer
// function DrawerStack(props) {
class DrawerStack extends Component {
  constructor(props){
    super(props);
  };
  render() {
    return (
      <>
        <Drawer.Navigator 
          initialRouteName="메뉴" 
          drawerPosition="right" 
          drawerContent={() => <CustomDrawerContent navigation={this.props.navigation}/>}
          screenOptions={{
            headerShown: false,
          }}
          // drawerIcon={{foucsed: true, color: 'red', size: 20}}
          hideStatusBar={true}
          statusBarAnimation={true}
        >
          <Drawer.Screen name="메뉴" component={TapNavigator} />
          <Drawer.Screen name="내 정보" component={ProfileScreen}/>
          {/* <Drawer.Screen name="커스텀" component={CustomDrawerContent} /> */}
        </Drawer.Navigator>
      </>
    )
  }
}

const stackApp = createStackNavigator();
// export default function App() {
export default class App extends Component {
  constructor(props){
    super(props);

  };
  componentDidMount() {
    SplashScreen.hide(); 
  };
  render() {
    return (
      <Provider store={store} >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="로그인" screenOptions={{
            headerShown: false,
          }}>
            <stackApp.Screen name="로그인" component={AcccountStack} />
            <stackApp.Screen name="drawer" component={DrawerStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }  
}
