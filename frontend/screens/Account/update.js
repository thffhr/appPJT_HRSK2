import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {serverUrl} from '../../constants';
import { connect } from 'react-redux';

const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});
const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
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
  };
  onUpdateImg = () => {
    this.props.navigation.push('UpdateImg');
  };
  // onProfile = () => {
  //   if (this.state.height && this.state.weight && this.state.age) {
  //     fetch(`${serverUrl}accounts/update/`, {
  //       method: 'PATCH',
  //       body: JSON.stringify(this.state),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Token ${this.props.user.token}`,
  //       },
  //     })
  //       .then(() => {})
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   } else {
  //     alert('모든 정보가 입력되지 않아 저장되지 않았습니다.');
  //   }
  //   this.props.navigation.dispatch(
  //     CommonActions.reset({
  //       index: 1,
  //       routes: [{name: 'Profile'}],
  //     }),
  //   );
  // };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.guideBox}>
            <Text style={styles.mainComment}>회원 정보 수정</Text>
            <Text style={styles.subComment}>기존 회원 정보를 수정할 수 있습니다.</Text>
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
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={this.props.user.age}
                  selectionColor="#e74c3c"
                  onChangeText={(age) => {
                    this.setState({
                      age: age,
                    });
                  }}></TextInput>
                <Text style={styles.infoValue}> 세</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>키</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={this.props.user.height}
                  onChangeText={(height) => {
                    this.setState({
                      height: height,
                    });
                  }}></TextInput>
                  <Text style={styles.infoValue}> cm</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>몸무게</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.infoInput}
                  keyboardType="number-pad"
                  value={this.props.user.weight}
                  onChangeText={(weight) => {
                    this.setState({
                      weight: weight,
                    });
                  }}></TextInput>
                  <Text style={styles.infoValue}> kg</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>기초대사량</Text>
              <Text style={styles.infoValue}>{this.props.user.basal_metabolism} kcal</Text>
            </View>
            <View style={styles.infoBox}>
              <Text>사용자가 입력한 정보를 토대로 기초 대사량이 계산됩니다.</Text>
            </View>
          </View>
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
  // infobox
  userInfo: {
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    backgroundColor: '#e0e0e0',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: W * 0.1,
    marginVertical: H * 0.015,
  },
  infoTitle: {
    fontSize: W * 0.05,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: W * 0.05,
  },
  infoInput: {
    fontSize: W * 0.032,
    height: H * 0.05,
    width: W * 0.15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderRadius: 6,
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
  inputBox: {
    flexDirection: 'row',
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

export default connect(mapStateToProps, mapDispatchToProps)(Update);
