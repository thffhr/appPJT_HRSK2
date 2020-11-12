import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl} from '../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

export default class BestUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BestUser: [],
      isFollow: false,
      myName: null,
      userData: {},
      username: [],
    };
  }

  componentDidMount() {
    this.getDatas();
  }
  getDatas = async () => {
    fetch(`${serverUrl}accounts/bestusers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        this.setState({
          BestUser: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    fetch(`${serverUrl}accounts/plususers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        this.setState({
          PlusUser: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    const myName = await AsyncStorage.getItem('username');
    const Token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}accounts/profile/${this.state.username}/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('top');
        console.log(response);
        this.setState({
          userData: response,
          myName: myName,
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
        console.log(response);
      })
      .catch((err) => console.error(err));
  };
  onFollow = async () => {
    console.log(this.state.isFollow);
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
            // isFollow: !this.state.isFollow,
            userData: {
              ...this.state.userData,
              num_of_followers: this.state.userData.num_of_followers + 1,
            },
          });
        } else {
          this.setState({
            // isFollow: !this.state.isFollow,
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
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <Text style={styles.miniTitle}>추천친구 </Text>
          <View style={styles.Box2}>
            {this.state.PlusUser.map((user) => {
              <Text>{user.username}</Text>;
            })}
          </View> */}
          <Text style={styles.miniTitle}>주간 랭킹</Text>
          <View style={styles.weeklyBox}>
            {this.state.BestUser.map((user, i) => {
              return (
                <View style={styles.rankingBox}>
                  <View style={styles.userBtn}>
                    {/* <Text style={styles.ranking}>{i + 1}</Text> */}
                    {this.state.profileImage ? (
                      <Image
                        style={styles.profileImg}
                        source={{
                          uri: `${serverUrl}gallery` + this.state.profileImage,
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.profileImg}
                        source={{
                          uri:
                            'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
                        }}
                      />
                    )}
                    <Text
                      style={styles.followUser}
                      onPress={(e) => {
                        this.props.navigation.push('UserFeed', {
                          username: user.username,
                        });
                      }}>
                      {user.username}
                    </Text>
                    <Text style={styles.followCnt}>
                      {user.num_of_followers}
                    </Text>
                    {this.state.myName !== user.username && (
                      <View style={styles.followBtn}>
                        {/* {!this.state.isFollow ? (
                          <TouchableOpacity
                            style={styles.follow}
                            onPress={this.onFollow}>
                            <Text style={styles.followTxt}>팔로우</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.following}
                            onPress={this.onFollow}>
                            <Text style={styles.followingTxt}>팔로잉</Text>
                          </TouchableOpacity>
                        )} */}
                        {/* <TouchableOpacity
                          style={styles.follow}
                          onPress={(e) => {
                            this.props.navigation.push('UserFeed', {
                              username: user.username,
                            });
                          }}>
                          <Text style={styles.followTxt}>더보기</Text>
                        </TouchableOpacity> */}
                        {i == 0 && (
                          <View>
                            <Icon name="medal" style={styles.rank1}></Icon>
                          </View>
                        )}
                        {i == 1 && (
                          <View>
                            <Icon name="medal" style={styles.rank2}></Icon>
                          </View>
                        )}
                        {i == 2 && (
                          <View>
                            <Icon name="medal" style={styles.rank3}></Icon>
                          </View>
                        )}
                        {i >= 3 && (
                          <View>
                            <Icon name="medal" style={styles.rank4}></Icon>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbe6',
    width: '100%',
    flex: 1,
    paddingTop: 20,
  },
  rankingBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userBtn: {
    flexDirection: 'row',
    marginTop: '10%',
    alignItems: 'center',
  },
  ranking: {
    // marginRight: '5%',
    fontSize: W * 0.1,
    fontFamily: 'NanumSquareRoundEB',
    width: W * 0.1,
  },
  followUser: {
    // marginRight: '5%',
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    width: W * 0.5,
  },
  profileImg: {
    borderRadius: W * 0.15,
    width: W * 0.13,
    height: W * 0.13,
    // marginRight: '5%',
  },
  miniTitle: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    margin: 20,
  },
  Box2: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    paddingBottom: W * 0.1,
    marginBottom: '10%',
  },
  followUser: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    marginLeft: 20,
    minWidth: W * 0.25,
    maxWidth: W * 0.25,
  },
  followCnt: {
    fontSize: W * 0.06,
    fontFamily: 'NanumSquareRoundEB',
    marginLeft: 20,
    minWidth: W * 0.15,
    maxWidth: W * 0.15,
  },
  followTxt: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NanumSquareRoundEB',
    textAlign: 'center',
  },
  follow: {
    // width: '20%',
    backgroundColor: '#fca652',
    borderRadius: 10,
    // marginVertical: 10,
    padding: 10,
    borderColor: '#fca652',
    borderWidth: 1,
  },
  // followingTxt: {
  //   color: '#fca652',
  //   fontSize: 20,
  //   fontFamily: 'NanumSquareRoundEB',
  //   textAlign: 'center',
  // },
  // following: {
  //   // width: '20%',
  //   backgroundColor: '#fffbe6',
  //   borderColor: '#fca652',
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   // marginVertical: 10,
  //   padding: 10,
  // },
  // followBtn: {
  //   fontSize: W * 0.06,
  //   fontFamily: 'NanumSquareRoundEB',
  //   marginHorizontal: 10,
  // },
  rank1: {
    fontSize: W * 0.1,
    color: '#FFD700',
  },
  rank2: {
    fontSize: W * 0.1,
    color: '#C0C0C0',
  },
  rank3: {
    fontSize: W * 0.1,
    color: '#C49C48',
  },
  rank4: {
    fontSize: W * 0.1,
    color: 'transparent',
  },
});
