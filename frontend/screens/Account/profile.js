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
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class Profile extends Component {
  constructor(props) {
    super(props);
  };
  goHome = () => {
    this.props.navigation.push('Home');
  };
  onUpdate = () => {
    this.props.navigation.push('Update');
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onUpdate} style={styles.updateBtn}>
          <Text style={styles.updateText}>수정</Text>
        </TouchableOpacity>
        <View>
          {this.props.user.profileImage && (
            <Image
              style={styles.profileImg}
              source={{
                uri: `${serverUrl}gallery` + this.props.user.profileImage,
              }}
            />
          )}
          {!this.props.user.profileImage && (
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
            <Text style={styles.infoValue}>{this.props.user.username}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>성별</Text>
            {this.props.user.sex === 'male' && (
              <Text style={styles.infoValue}>남</Text>
            )}
            {this.props.user.sex === 'female' && (
              <Text style={styles.infoValue}>여</Text>
            )}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>나이</Text>
            <Text style={styles.infoValue}>{this.props.user.age}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>키</Text>
            <Text style={styles.infoValue}>{this.props.user.height}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>몸무게</Text>
            <Text style={styles.infoValue}>{this.props.user.weight}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>기초대사량</Text>
            <Text style={styles.infoValue}>{this.props.user.basal_metabolism} kcal</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            if (this.props.user.token !== null) {
              fetch(`${serverUrl}rest-auth/logout/`, {
                method: 'POST',
                header: {
                  Authorization: `Token ${this.props.user.token}`,
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
});

export default connect(mapStateToProps)(Profile);
