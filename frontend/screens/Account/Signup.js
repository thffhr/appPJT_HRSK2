import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {AsyncStorage} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';
import {login} from '../../src/action/user';
import {connect} from 'react-redux';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
});

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signupData: {
        email: '',
        nickname: '',
        password1: '',
        password2: '',
      },
    };
  }
  onSignup = () => {
    fetch(`${serverUrl}rest-auth/signup/`, {
      method: 'POST',
      body: JSON.stringify(this.state.signupData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.detail) {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Login'}],
            }),
          );
          alert('이메일이 발송되었습니다.');
        } else if (response.email) {
          alert(response.email);
          // } else if (response.nickname) {
          //   alert(response.nickname);
        } else if (response.password1) {
          alert(response.password1);
        } else if (response.password2) {
          alert(response.password2);
        } else if (response.non_field_errors) {
          alert(response.non_field_errors);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/keyboard.png')}
          style={styles.image}
        />
        <View style={styles.guide}>
          <Text style={styles.guideTxt}>
            생성할 계정의 이메일과 닉네임, 비밀번호를 입력해주세요.
          </Text>
        </View>
        <View>
          <TextInput
            style={styles.inputArea}
            placeholder="이메일"
            onChangeText={(text) => {
              this.setState({
                signupData: {
                  ...this.state.signupData,
                  email: text,
                },
              });
            }}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="닉네임"
            onChangeText={(text) => {
              this.setState({
                signupData: {
                  ...this.state.signupData,
                  nickname: text,
                },
              });
            }}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                signupData: {
                  ...this.state.signupData,
                  password1: text,
                },
              });
            }}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="비밀번호 확인"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                signupData: {
                  ...this.state.signupData,
                  password2: text,
                },
              });
            }}
          />
        </View>
        <View style={styles.signupBtn}>
          <TouchableOpacity style={styles.signupButton} onPress={this.onSignup}>
            <Text style={styles.signBtnText}>회원가입</Text>
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
    backgroundColor: '#fbfbe6',
  },
  guide: {
    width: W * 0.7,
    marginVertical: H * 0.01,
  },
  guideTxt: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'BMHANNA',
    color: 'darkgray',
  },
  signupBtn: {
    backgroundColor: '#fca652',
    padding: W * 0.02,
    borderRadius: 5,
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    width: W * 0.7,
  },
  signupButton: {
    width: '100%',
    alignItems: 'center',
  },
  signBtnText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'BMJUA',
  },
  inputArea: {
    width: W * 0.7,
    height: W * 0.1,
    fontSize: W * 0.04,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    padding: W * 0.02,
  },
  image: {
    width: W * 0.4,
    height: W * 0.23,
  },
});

export default connect(null, mapDispatchToProps)(Signup);
