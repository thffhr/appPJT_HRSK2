import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {AsyncStorage, Image} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';

const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      age: '',
      sex: '',
      height: '',
      weight: '',
      bm: '',
      active: '',
    };
  }

  async componentDidMount() {
    // you might want to do the I18N setup here
    this.setState({
      username: await AsyncStorage.getItem('username'),
    });
    this.getInfo();
  }
  getInfo = () => {
    fetch(`${serverUrl}accounts/profile/${this.state.username}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          age: response.age,
          sex: response.sex,
          height: response.height,
          weight: response.weight,
          bm: response.basal_metabolism,
          profileImage: response.profileImage,
          active: response.active,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  goHome = () => {
    this.props.navigation.push('Home');
  };
  onUpdate = async () => {
    const username = await AsyncStorage.getItem('username');
    this.props.navigation.push('Update', {
      sex: this.state.sex,
      bm: this.state.bm,
      profileImage: this.state.profileImage,
      username: username,
      active: this.state.active,
      weight: this.state.weight,
    });
  };
  render() {
    const ageCheck = this.state.age;
    const genderCheck = this.state.sex;
    const heightCheck = this.state.height;
    const weightCheck = this.state.weight;
    let age;
    let gender;
    let height;
    let weight;

    if (ageCheck) {
      age = `${ageCheck}세`;
    } else {
      age = '정보 없음';
    }
    if (genderCheck == 'male') {
      gender = '남성';
    } else if (genderCheck == 'female') {
      gender = '여성';
    } else {
      gender = '정보 없음';
    }
    if (heightCheck) {
      height = `${heightCheck}cm`;
    } else {
      height = '정보 없음';
    }
    if (weightCheck) {
      weight = `${weightCheck}kg`;
    } else {
      weight = '정보 없음';
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onUpdate} style={styles.updateBtn}>
          <Text style={styles.updateText}>수정</Text>
        </TouchableOpacity>
        <View>
          {this.state.profileImage && (
            <Image
              style={styles.profileImg}
              source={{
                uri: `${serverUrl}gallery` + this.state.profileImage,
              }}
            />
          )}
          {!this.state.profileImage && (
            <Image
              style={styles.profileImg}
              source={{
                uri:
                  'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
              }}
            />
          )}
        </View>
        <View style={styles.userInfo}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>아이디</Text>
            <Text style={styles.infoValue}>{this.state.username}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>성별</Text>
            <Text style={styles.infoValue}>{gender}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>나이</Text>
            <Text style={styles.infoValue}>{age}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>키</Text>
            <Text style={styles.infoValue}>{height}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>몸무게</Text>
            <Text style={styles.infoValue}>{weight}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>기초대사량</Text>
            <Text style={styles.infoValue}>{this.state.bm} kcal</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            const token = await AsyncStorage.getItem('auth-token');
            console.log(token);
            if (token !== null) {
              fetch(`${serverUrl}rest-auth/logout/`, {
                method: 'POST',
                header: {
                  Authorization: `Token ${token}`,
                },
              })
                .then(() => {
                  console.log('로그아웃 성공');
                  AsyncStorage.clear();
                  this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [{name: '로그인'}],
                    }),
                  );
                })
                .catch((err) => console.error(err));
            }
          }}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
        {/*  
        <TouchableOpacity onPress={this.onDelete} style={styles.deleteBtn}>
          <Text style={styles.delText}>회원탈퇴</Text>
        </TouchableOpacity>
         */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fbfbe6',
    alignItems: 'center',
  },
  profileImg: {
    marginTop: W * 0.1,
    width: W * 0.3,
    height: W * 0.3,
    borderRadius: W * 0.3,
    marginBottom: W * 0.15,
  },
  userInfo: {
    borderRadius: 10,
    width: '70%',
    elevation: 5,
    backgroundColor: '#fff',
  },
  infoItem: {
    marginTop: H * 0.02,
    marginBottom: H * 0.02,
    marginLeft: W * 0.03,
    marginRight: W * 0.03,
  },
  infoCon: {
    marginTop: H * 0.02,
    marginBottom: H * 0.02,
    marginLeft: W * 0.03,
    marginRight: W * 0.03,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: W * 0.05,
    marginVertical: H * 0.015,
  },
  infoTitle: {
    fontFamily: 'BMDOHYEON',
    fontSize: W * 0.05,
  },
  infoValue: {
    fontFamily: 'BMHANNAAir',
    fontSize: W * 0.05,
  },
  gohomeBtn: {
    backgroundColor: 'transparent',
    color: 'black',
  },
  updateBtn: {
    position: 'absolute',
    right: W * 0.03,
    top: W * 0.03,
  },
  updateText: {
    fontSize: W * 0.05,
    color: '#fca652',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: H * 0.05,
  },
  logoutText: {
    color: '#fca652',
    fontFamily: 'BMHANNAAir',
    fontSize: W * 0.06,
  },
  // deleteBtn: {
  //   marginTop: 50,
  //   backgroundColor: 'transparent',
  //   position: 'absolute',
  //   bottom: 20,
  //   alignItems: 'center',
  // },
  // delText: {
  //   color: 'blue',
  //   borderBottomColor: 'blue',
  //   borderBottomWidth: 1,
  // },
});

export default Profile;
