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
  onDelete = () => {
    fetch(`${serverUrl}accounts/delete/${this.props.user.username}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then(() => {
        AsyncStorage.clear();
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: '로그인'}],
          }),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.guideBox}>
            <Text style={styles.mainComment}>회원정보</Text>
            <Text style={styles.subComment}>가입 시 입력한 정보를 확인할 수 있습니다.</Text>
          </View>
          <TouchableOpacity onPress={this.onUpdate} style={styles.updateBtn}>
            <Text style={styles.updateText}>수정</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.body}>
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
            <View style={styles.infoBox}>
              <Text>사용자가 입력한 정보를 토대로 기초 대사량이 계산됩니다.</Text>
            </View>
          </View>
          <TouchableOpacity onPress={this.onDelete} style={styles.deleteBtn}>
            <Text style={styles.delText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbe6',
  },
  // body
  body: {
    alignItems: 'center',
  },
  profileImg: {
    marginTop: W * 0.05,
    marginBottom: W * 0.05,
    borderRadius: W * 0.3,
    width: W * 0.37,
    height: W * 0.37,
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
  deleteBtn: {
    marginTop: H * 0.02,
  },
  delText: {
    color: '#fca652',
    fontFamily: 'BMHANNAAir',
    fontSize: W * 0.06,
  },
  // header
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  guideBox: {},
  mainComment: {
    fontSize: 25,
    fontFamily: 'BMJUA',
  },
  subComment: {},
  updateBtn: {
  },
  updateText: {
    fontSize: 25,
    fontFamily: 'BMJUA',
  },
  
});

export default connect(mapStateToProps)(Profile);
