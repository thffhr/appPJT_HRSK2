import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// const serverUrl = 'http://localhost:8080/';
const serverUrl = 'http://10.0.2.2:8080/';
// const serverUrl = 'http://j3a410.p.ssafy.io/api/';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

export default class BestUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      BestUser: [],
    }
  };

  componentDidMount() {
    console.log(1)
    this.getDatas();
  };
  getDatas = () => {
    console.log(2)
    fetch(`${serverUrl}accounts/bestusers/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.setState({
          BestUser: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.haru}>하루세끼</Text>
        </View>

        <ScrollView>
          <View style={styles.Box}>
            {this.state.BestUser.map((user, i) => {
              return (
                <View style={styles.follow} key={user.id}>
                  <TouchableOpacity
                  style={styles.userBtn}
                    onPress={() => {
                      this.props.navigation.push('UserFeed', {
                        username: user.username,
                      })
                    }}
                  >
                  <Text style={styles.ranking}>{i + 1}</Text>
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
                    <Text style={styles.followUser}>{user.username}</Text>
                    <Text style={styles.followUser}>
                      {user.num_of_followers} 명
                    </Text>
                  </TouchableOpacity>

                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
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
    backgroundColor: '#fca652',
  },
  haru: {
    fontSize: 30,
    fontFamily: 'BMJUA',
    color: '#fff',
  },

  Box: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    paddingBottom: W * 0.1,
  },
  follow: {
  },
  userBtn: {
    flexDirection: 'row',
    marginTop: '10%',
    marginLeft: '10%',
    alignItems: 'center',
  },
  ranking: {
    marginRight: '5%',
    fontSize: W * 0.1,
    fontFamily: 'BMJUA',
    width: W * 0.07,
  },
  followUser: {
    marginRight: '5%',
    fontSize: W * 0.06,
    fontFamily: 'BMJUA',
    width: W * 0.35,
  },
  profileImg: {
    borderRadius: W * 0.15,
    width: W * 0.13,
    height: W * 0.13,
    marginRight: '5%',
  },
})