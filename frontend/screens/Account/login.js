import React, {Component} from 'react';
import {
  PixelRatio,
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {AsyncStorage} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';

const serverUrl = 'http://10.0.2.2:8080/';
// const serverUrl = 'http://j3a410.p.ssafy.io/api/';
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }
  async componentDidMount() {
    const token = await AsyncStorage.getItem('auth-token');
    if (token) {
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'drawer'}],
        }),
      );
    }
  }
  handleEmail = (text) => {
    this.setState({username: text});
  };
  handlePassword = (text) => {
    this.setState({password: text});
  };
  onLogin = () => {
    fetch(`${serverUrl}rest-auth/login/`, {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.key) {
          AsyncStorage.setItem('auth-token', response.key);
          AsyncStorage.setItem('username', this.state.username);
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'drawer'}],
            }),
          );
        } else {
          alert('계정 정보가 일치하지 않습니다.');
        }
      })
      .catch((err) => console.error(err));
  };
  onSign = () => {
    this.props.navigation.push('Signup');
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleGroup}>
          <Image
            source={require('../../assets/images/로고.png')}
            style={styles.image}
          />
          <Text style={styles.title}>하루세끼</Text>
        </View>
        <View>
          <TextInput
            style={styles.inputArea}
            placeholder="아이디를 입력하세요."
            onChangeText={this.handleEmail}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호를 입력하세요."
            secureTextEntry={true}
            onChangeText={this.handlePassword}
          />
        </View>
        <View style={styles.loginBtn}>
          <TouchableOpacity style={styles.loginButton} onPress={this.onLogin}>
            <Text style={styles.loginBtnText}>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.findBox}>
          <TouchableOpacity style={styles.findBtn} color="transparent">
            <Text style={{fontSize: W * 0.035}}>아이디 찾기</Text>
          </TouchableOpacity>
          <Text style={{fontSize: W * 0.03}}>|</Text>
          <TouchableOpacity style={styles.findBtn}>
            <Text style={{fontSize: W * 0.035}}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupBox}>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: H * 0.01,
              fontSize: W * 0.035,
            }}>
            가입이 되어 있지 않으신가요?
          </Text>
          <TouchableOpacity style={styles.signupBtn} onPress={this.onSign}>
            <Text
              style={{
                color: 'blue',
                textDecorationLine: 'underline',
                fontSize: W * 0.035,
              }}>
              회원가입
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBE6',
  },
  titleGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: W * 0.13,
    fontFamily: 'BMJUA',
    marginBottom: H * 0.08,
    marginTop: H * 0.01,
  },
  image: {
    marginRight: W * 0.03,
    width: W * 0.165,
    height: W * 0.165,
  },
  inputArea: {
    width: W * 0.7,
    height: W * 0.1,
    fontSize: W * 0.03,
    borderBottomColor: 'gray',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
  },
  loginBtn: {
    // alignItems: 'center',
    backgroundColor: '#fca652',
    padding: W * 0.02,
    borderRadius: 5,
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    width: '70%',
  },
  loginButton: {
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: {
    color: 'white',
    fontSize: W * 0.04,
    fontWeight: 'bold',
  },
  findBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  findBtn: {
    backgroundColor: 'transparent',
    color: 'red',
    marginHorizontal: W * 0.02,
  },
  signupBox: {
    marginTop: H * 0.1,
  },
  signupBtn: {
    backgroundColor: 'transparent',
    color: 'blue',
    alignItems: 'center',
  },
});

export default Login;
