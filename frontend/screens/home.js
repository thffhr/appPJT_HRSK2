import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';
const {width, height} = Dimensions.get('screen');
const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      avatarSource: '',
      authToken: '',
      profileImage: null,
    };
  }
  async componentDidMount() {
    // you might want to do the I18N setup here
    this.setState({
      username: await AsyncStorage.getItem('username'),
      authToken: await AsyncStorage.getItem('auth-token'),
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
        this.setState({
          profileImage: response.profileImage,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  onProfile = () => {
    this.props.navigation.push('Profile');
  };
  onCamera = () => {
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
        // maxWidth: width,
        // maxHeight: width,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source,
        });

        var data = new FormData();
        data.append('data', response.data);
        data.append('type', response.type);
        data.append('fileName', response.fileName);
        fetch(`${serverUrl}gallery/saveMenu/`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${this.state.authToken}`,
          },
        })
          .then((response) => response.json())
          .then(() => {
            // console.log(response);
          })
          .catch((error) => console.log(error));
      }
    });
  };
  onCommunity = () => {
    this.props.navigation.push('Community');
  };
  onRank = () => {
    this.props.navigation.push('Rank');
  };
  onRecord = () => {
    this.props.navigation.push('Record');
  };
  onWorldCup = () => {
    alert('서비스 준비중입니다..\n조금만 기다려주세요');
  };
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Nav}>
          <Text style={styles.title}>하루세끼</Text>
          <TouchableOpacity style={styles.userBtn} onPress={this.onProfile}>
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
          </TouchableOpacity>
        </View>
        <View style={styles.body1}>
          <TouchableOpacity style={styles.btnBox} onPress={this.onCamera}>
            <View style={styles.btnContent}>
              <Icon name="camera" style={styles.bigLogo}></Icon>
              <Text style={styles.logoTitle}>사진 등록</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.body2}>
          <View style={styles.body3}>
            <TouchableOpacity style={styles.btnBox} onPress={this.onRecord}>
              <View style={styles.btnContent}>
                <Icon name="calendar-outline" style={styles.smallLogo} />
                <Text style={styles.logoTitle}>내 기록</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.body4}>
            <TouchableOpacity style={styles.btnBox} onPress={this.onCommunity}>
              <View style={styles.btnContent}>
                <Icon name="earth-outline" style={styles.smallLogo} />
                <Text style={styles.logoTitle}>커뮤니티</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body5}>
          <View style={styles.body6}>
            <TouchableOpacity style={styles.btnBox} onPress={this.onRank}>
              <View style={styles.btnContent}>
                <Icon name="medal-outline" style={styles.smallLogo} />
                <Text style={styles.logoTitle}>랭킹</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.body7}>
            <TouchableOpacity style={styles.btnBox} onPress={this.onWorldCup}>
              <View style={styles.btnContent}>
                <Icon name="trophy-outline" style={styles.smallLogo} />
                <Text style={styles.logoTitle}>식단월드컵</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  Container: {
    width: width,
    flex: 1,
    backgroundColor: '#FFFBE6',
  },
  Nav: {
    backgroundColor: '#fca652',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: W * 0.075,
    flex: 1,
  },
  title: {
    fontSize: W * 0.075,
    fontFamily: 'BMJUA',
    color: 'white',
  },
  userBtn: {
    width: W * 0.12,
    height: W * 0.12,
  },
  profileImg: {
    width: W * 0.12,
    height: W * 0.12,
    borderRadius: W * 0.12,
  },
  body1: {
    flex: 4,
    borderWidth: 1,
    borderBottomColor: '#d6d6d6',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  bigLogo: {
    fontSize: W * 0.25,
    color: '#787878',
  },
  smallLogo: {
    fontSize: W * 0.125,
    color: '#737373',
  },
  logoTitle: {
    fontSize: W * 0.05,
    fontFamily: 'BMDOHYEON',
    color: '#737373',
  },
  body2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2,
  },
  body3: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  record: {
    fontSize: W * 0.05,
    fontWeight: 'bold',
  },
  body4: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#d6d6d6',
    backgroundColor: 'transparent',
    padding: 0,
  },
  btnBox: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2,
  },
  body6: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  body7: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#d6d6d6',
  },
  btnContent: {
    alignItems: 'center',
  },
});
