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

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signupData: {
        username: '',
        email: '',
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
        if (response.key) {
          AsyncStorage.setItem('auth-token', response.key);
          AsyncStorage.setItem('username', this.state.signupData.username);
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Startsex'}],
            }),
          );
        } else if (response.username) {
          alert(response.username);
        } else if (response.email) {
          alert(response.email);
        } else if (response.password1) {
          alert(response.password1);
        } else if (response.password2) {
          alert(response.password2);
        } else if (response.non_field_errors) {
          alert(response.non_field_errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/로고.png')}
          style={styles.image}
        />
        <View>
          <TextInput
            style={styles.inputArea}
            placeholder="닉네임을 입력하세요."
            onChangeText={(text) => {
              this.setState({
                signupData: {
                  ...this.state.signupData,
                  username: text,
                },
              });
            }}
          />
          <TextInput
            style={styles.inputArea}
            placeholder="이메일을 입력하세요."
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
    backgroundColor: '#FFFBE6',
  },
  description: {
    fontSize: W * 0.03,
    fontWeight: 'bold',
    marginVertical: H * 0.01,
  },
  signupBtn: {
    backgroundColor: '#fca652',
    padding: W * 0.02,
    borderRadius: 5,
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    width: '70%',
  },
  signupButton: {
    width: '100%',
    alignItems: 'center',
  },
  signBtnText: {
    color: 'white',
    fontSize: W * 0.04,
    fontWeight: 'bold',
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
  image: {
    width: W * 0.3,
    height: W * 0.3,
    marginBottom: W * 0.15,
  },
});

export default Signup;
