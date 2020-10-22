import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {AsyncStorage, Image} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../constants';
import { connect } from 'react-redux';

const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
})

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.route.active,
      age: '',
      sex: this.props.route.sex,
      height: '',
      weight: this.props.route.weight,
      bm: this.props.route.bm,
    };
  }
  componentDidMount() {
    // you might want to do the I18N setup here
    this.getInfo();
  };
  getInfo = () => {
    fetch(`${serverUrl}accounts/profile/${this.props.user.username}`, {
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
        console.error(err);
      });
  };
  onUpdateImg = () => {
    this.props.navigation.push('UpdateImg');
  };
  onProfile = () => {
    if (this.state.height && this.state.weight && this.state.age) {
      fetch(`${serverUrl}accounts/update/`, {
        method: 'PATCH',
        body: JSON.stringify(this.state),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.user.token}`,
        },
      })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert('모든 정보가 입력되지 않아 저장되지 않았습니다.');
    }
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Profile'}],
      }),
    );
  };
  onDelete = () => {
    fetch(`${serverUrl}accounts/delete/${this.props.user.username}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        AsyncStorage.clear();
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Login'}],
          }),
        );
      })
      .catch((err) => {
        console.log(err);
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
    if (genderCheck == 'male') {
      gender = '남성';
    } else if (genderCheck == 'female') {
      gender = '여성';
    } else {
      gender = '남성';
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onProfile} style={styles.updateBtn}>
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
          <TouchableOpacity
            onPress={this.onUpdateImg}
            style={styles.updateImgBtn}>
            <Image
              style={styles.updateImg}
              source={{
                uri:
                  'https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/write-256.png',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>아이디</Text>
            <Text style={styles.infoValue}>{this.props.user.username}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>성별</Text>
            <Text style={styles.infoValue}>{gender}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>나이</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="나이"
              keyboardType="number-pad"
              value={this.state.age}
              onChangeText={(age) => {
                this.setState({
                  age: age,
                });
              }}></TextInput>
            {/* <Text style={styles.infoValue}>{age}</Text> */}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>키</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="키"
              keyboardType="number-pad"
              value={this.state.height}
              onChangeText={(height) => {
                this.setState({
                  height: height,
                });
              }}></TextInput>
            {/* <Text style={styles.infoValue}>{height}</Text> */}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>몸무게</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="몸무게"
              keyboardType="number-pad"
              value={this.state.weight}
              onChangeText={(weight) => {
                this.setState({
                  weight: weight,
                });
              }}></TextInput>
            {/* <Text style={styles.infoValue}>{weight}</Text> */}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>기초대사량</Text>
            <Text style={styles.infoValue}>{this.state.bm} kcal</Text>
          </View>
        </View>
        {/* <Text>{this.state.weight}</Text> */}
        <TouchableOpacity onPress={this.onDelete} style={styles.deleteBtn}>
          <Text style={styles.delText}>회원탈퇴</Text>
        </TouchableOpacity>
        
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
  updateImgBtn: {
    width: W * 0.075,
    height: W * 0.075,
    backgroundColor: '#F1C40F',
    borderRadius: W * 0.075,
    position: 'absolute',
    right: W * 0,
    bottom: W * 0.13,
    zIndex: 2,
  },
  updateImg: {
    width: W * 0.05,
    height: W * 0.05,
    margin: W * 0.015,
  },
  // infobox
  userInfo: {
    borderRadius: 10,
    width: '70%',
    elevation: 5,
    backgroundColor: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  infoInput: {
    fontFamily: 'BMHANNAAir',
    fontSize: W * 0.05,
    height: H * 0.07,
    width: W * 0.15,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgray',
    textAlign: 'center',
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
  deleteBtn: {
    marginTop: H * 0.05,
  },
  delText: {
    color: '#fca652',
    fontFamily: 'BMHANNAAir',
    fontSize: W * 0.06,
  },
});

export default connect(mapStateToProps)(Update);
