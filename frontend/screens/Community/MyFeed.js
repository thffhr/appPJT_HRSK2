import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, Modal, Dimensions, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { serverUrl } from '../../constants';
import MyFeedImage from './MyFeedImage';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class MyFeed extends Component {
  constructor(props){
    super(props);
  };
  state = {
    myArticles: [],
    modalData: '',
    modalVisible: false,
  };
  componentDidMount() {
    this.getMyArticles();
  };
  setModalVisible = (visible, recipe) => {
    if (visible) {
      this.setState({
        modalData: recipe,
      });
    } else {
      this.setState({
        modalData: '',
      });
    }
    this.setState({modalVisible: visible});
  };
  getMyArticles = () => {
    fetch(`${serverUrl}articles/read/${this.props.user.username}/`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          myArticles: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.profileBox}>
            <View style={styles.imgBox}>
              {this.props.user.profileImage && (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri:
                      `${serverUrl}gallery` +
                      this.props.user.profileImage,
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
              <Text
                style={{
                  fontSize: 20,
                  marginLeft: 5,
                }}>
                {this.props.user.username}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>게시글</Text>
              <Text style={styles.cntContent}>
                {this.state.myArticles.length}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로워</Text>
              <Text style={styles.cntContent}>
                {this.props.user.num_of_followers}
              </Text>
            </View>
            <View style={styles.cntBox}>
              <Text style={styles.cntContent}>팔로잉</Text>
              <Text style={styles.cntContent}>
                {this.props.user.num_of_followings}
              </Text>
            </View>
          </View>

          <MyFeedImage articles={this.state.myArticles} navigation={this.props.navigation}/>
        </ScrollView>
      </SafeAreaView>
    )
  }
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBE6',
    flex: 1,
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
  },
});

export default connect(mapStateToProps)(MyFeed); 