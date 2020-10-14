import React from 'react';
import {StackActions} from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {CommonActions} from '@react-navigation/native';

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

export default class UpdateImg extends React.Component {
  state = {
    username: null,
    photo: null,
    avatarSource: null,
    profileImage: null,
  };

  async componentDidMount() {
    // you might want to do the I18N setup here
    this.setState({
      username: await AsyncStorage.getItem('username'),
    });
    this.getInfo();
    console.log(this.state.userId);
  }

  getInfo = () => {
    fetch(`${serverUrl}accounts/profile/${this.state.username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          profileImage: response.profileImage,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onNext = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    if (this.state.photo) {
      const source = {uri: this.state.photo.uri};
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      this.setState({
        avatarSource: source,
      });
      var data = new FormData();
      data.append('data', this.state.photo.data);
      data.append('type', this.state.photo.type);
      data.append('fileName', this.state.photo.fileName);

      fetch(`${serverUrl}accounts/pimg/update/`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => response.json())
        .then(() => {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Profile'}],
            }),
          );
          // this.props.navigation.push('내 정보');
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (!this.state.profileImage) {
      fetch(`${serverUrl}accounts/pimg/delete/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(() => {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Profile'}],
            }),
          );
          // this.props.navigation.push('내 정보');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleChoosePhoto = () => {
    const options = {};
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('response', response);
      if (response.uri) {
        this.setState({photo: response});
      }
    });
  };

  deleteProfileImage = () => {
    this.setState({
      photo: null,
      profileImage: null,
    });
  };

  render() {
    const {photo} = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.next} onPress={this.onNext}>
          <Text style={styles.updateText}>수정</Text>
        </TouchableOpacity>
        {photo && (
          <Image source={{uri: photo.uri}} style={{width: 200, height: 200}} />
        )}
        {!photo && !this.state.profileImage && (
          <Image
            source={{
              uri:
                'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
            }}
            style={{width: 200, height: 200}}
          />
        )}
        {!photo && this.state.profileImage && (
          <Image
            source={{
              uri: `${serverUrl}gallery` + this.state.profileImage,
            }}
            style={{width: 200, height: 200}}
          />
        )}
        <View style={{margin: 30}}>
          <TouchableOpacity
            onPress={this.handleChoosePhoto}
            style={styles.chooseBtn}>
            <Text style={styles.chooseBtnText}>사진 선택</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            title="초기화"
            onPress={this.deleteProfileImage}
            style={styles.chooseBtn}>
            <Text style={styles.chooseBtnText}>초기화</Text>
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
    backgroundColor: '#FFFBE6',
    alignItems: 'center',
  },
  updateText: {
    fontSize: W * 0.05,
    color: '#fca652',
    fontWeight: 'bold',
  },
  next: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  chooseBtn: {
    backgroundColor: '#fca652',
    padding: 10,
    borderRadius: 10,
  },
  chooseBtnText: {
    color: 'white',
    fontFamily: 'BMDOHYEON',
    fontSize: 20,
  },
});
