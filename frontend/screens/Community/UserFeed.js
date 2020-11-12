import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl} from '../../constants';

const {width, height} = Dimensions.get('screen');

export default class UserFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userArticles: [],
      username: this.props.route.params.username,
      userData: {},
      selected: {id: null, image: null},
      isFollow: false,
      myName: null,
      modalData: '',
      modalVisible: false,
    };
  }
  componentDidMount() {
    this.getUserArticles();
  }
  getUserArticles = async () => {
    const myName = await AsyncStorage.getItem('username');
    const Token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}articles/read/${this.state.username}/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          userArticles: response,
          myName: myName,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    fetch(`${serverUrl}accounts/profile/${this.state.username}/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          userData: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    fetch(`${serverUrl}accounts/profile/${this.state.username}/isfollow/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${Token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          isFollow: response,
        });
      })
      .catch((err) => console.error(err));
  };
  onFollow = async () => {
    const Token = await AsyncStorage.getItem('auth-token');
    fetch(
      `${serverUrl}accounts/profile/${this.state.userData.username}/follow/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${Token}`,
        },
      },
    )
      .then(() => {
        if (!this.state.isFollow) {
          this.setState({
            isFollow: !this.state.isFollow,
            userData: {
              ...this.state.userData,
              num_of_followers: this.state.userData.num_of_followers + 1,
            },
          });
        } else {
          this.setState({
            isFollow: !this.state.isFollow,
            userData: {
              ...this.state.userData,
              num_of_followers: this.state.userData.num_of_followers - 1,
            },
          });
        }
      })
      .catch((err) => console.error(err));
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.haru}>하루세끼</Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <View
            style={{
              width: '100%',
              height: height,
              backgroundColor: 'black',
              opacity: 0.5,
            }}></View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{marginBottom: 10}}>레시피 내용</Text>
              {this.state.modalData
                .split('|')
                .filter((word) => word)
                .map((line, i) => {
                  return (
                    <Text>
                      {i + 1}. {line}
                    </Text>
                  );
                })}
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <ScrollView>
          <View style={styles.profileBox}>
            <View style={styles.imgBox}>
              {this.state.userData.profileImage && (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri:
                      `${serverUrl}gallery` + this.state.userData.profileImage,
                  }}
                />
              )}
              {!this.state.userData.profileImage && (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri:
                      'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 20,
                  marginLeft: 5,
                  fontFamily: 'NanumSquareRoundEB'
                }}>
                {this.state.userData.username}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>게시글</Text>
              <Text style={styles.cntContent}>
                {this.state.userArticles.length}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로워</Text>
              <Text style={styles.cntContent}>
                {this.state.userData.num_of_followers}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로잉</Text>
              <Text style={styles.cntContent}>
                {this.state.userData.num_of_followings}
              </Text>
            </View>
          </View>
          {this.state.myName !== this.state.username && (
            <View style={styles.followBtn}>
              {!this.state.isFollow && (
                <TouchableOpacity style={styles.follow} onPress={this.onFollow}>
                  <Text style={styles.followTxt}>팔로우</Text>
                </TouchableOpacity>
              )}
              {this.state.isFollow && (
                <TouchableOpacity
                  style={styles.following}
                  onPress={this.onFollow}>
                  <Text style={styles.followingTxt}>
                    팔로잉{'  '}
                    <Icon name="checkmark-circle-outline" size={17}></Icon>
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.pictureBox}>
            {this.state.userArticles.map((article) => {
              const borderColor =
                article.id === this.state.selected.id
                  ? '#FCA652'
                  : 'transparent';
              return (
                <TouchableOpacity
                  style={[styles.imgBtn, {borderColor: borderColor}]}
                  key={article.id}
                  onPress={() => {
                    this.setState({
                      selected: {id: article.id, image: article.image},
                    });
                    this.props.navigation.push('MyFeed', {
                      article: article,
                    });
                  }}>
                  <Image
                    style={styles.picture}
                    source={{
                      uri: `${serverUrl}gallery` + article.image,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBE6',
    width: '100%',
    flex: 1,
  },
  navbar: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomColor: 'gray',
    // borderBottomWidth: 2,
    backgroundColor: '#fca652',
    elevation: 5,
    flexDirection: 'row',
  },
  haru: {
    fontSize: 30,
    // fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'BMJUA',
    marginLeft: 15,
  },

  articleBelow: {
    marginLeft: '5%',
  },

  // profileBox
  profileBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  imgBox: {},
  profileImg: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  cntBox: {},
  cntContent: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'NanumBarunGothicBold',
    marginTop: 3,
  },

  // my articles
  pictureBox: {
    // width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#232323',
    marginVertical: 20,
    paddingVertical: 20,
  },
  imgBtn: {
    width: '25%',
    height: 100,
    borderColor: 'white',
    borderWidth: 2,
  },
  picture: {
    width: '100%',
    height: '100%',
  },

  // follow
  followBtn: {
    // justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 10,
    // borderRadius: 10,
    // backgroundColor: '#000000',
    // flexDirection: 'row',
  },
  followTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NanumBarunGothicBold',
    textAlign: 'center',
  },
  follow: {
    width: '100%',
    backgroundColor: '#fca652',
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 15,
    borderColor: '#fca652',
    borderWidth: 1,
    
  },
  followingTxt: {
    color: '#fca652',
    fontSize: 20,
    fontFamily: 'BMJUA',
    textAlign: 'center',
  },
  following: {
    width: '100%',
    backgroundColor: '#fffbe6',
    borderColor: '#fca652',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 15,
  },

  // modal
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'NanumBarunGothicBold',
    textAlign: 'center',
  },
});
