import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableHighlight
} from 'react-native';
import {AsyncStorage, Image} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';
import {login} from '../../src/action/user';

const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});
const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(login(user)),
})
class Profile extends Component {
  constructor(props) {
    super(props);
  };
  state = {
    modalVisible: false,
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
        console.error(err);
      });
  };
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  onUpdateImg = async (visible) => {
    var user = this.deepClone(this.props.user);
    const options = {};
    await ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.uri) {
        var data = new FormData();
        data.append('data', response.data);
        data.append('type', response.type);
        data.append('fileName', response.fileName);
        await fetch(`${serverUrl}accounts/pimg/update/`, {
          method: 'PATCH',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${this.props.user.token}`,
          },
        })
          .then((response) =>response.json())
          .then((response) => {
            user.profileImage = response.profileImage;
            this.setModalVisible(visible);
          })
          .then(() => {
            this.props.login(user);
          })
          .catch(err => console.error(err))
      }
    });
  };
  onDeleteImg = (visible) => {
    var user = this.deepClone(this.props.user);
    fetch(`${serverUrl}accounts/pimg/delete/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
    user.profileImage = null,
    this.setState({
      modalVisible: !visible,
    })
    this.props.login(user);
  };
  deepClone(obj) {
    if(obj === null || typeof obj !== 'object') {
      return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    for(let key of Object.keys(obj)) {
      result[key] = this.deepClone(obj[key])
    }
    
    return result;
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
        
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                onPress={() => {
                  this.onUpdateImg(!this.state.modalVisible)
                }}
              >
                <Text style={styles.modalText}>새 프로필 사진 등록</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.onDeleteImg(!this.state.modalVisible)
                }}
              >
                <Text style={styles.modalText}>프로필 사진 삭제</Text>
              </TouchableHighlight>

              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
            <TouchableOpacity
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
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
  updateImgBtn: {
    width: W * 0.075,
    height: W * 0.075,
    backgroundColor: '#F1C40F',
    borderRadius: W * 0.075,
    position: 'absolute',
    right: W * 0.02,
    bottom: W * 0.05,
    zIndex: 2,
  },
  updateImg: {
    width: W * 0.05,
    height: W * 0.05,
    margin: W * 0.015,
  },
  userInfo: {
    borderRadius: 10,
    width: '80%',
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
  // modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    // margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
