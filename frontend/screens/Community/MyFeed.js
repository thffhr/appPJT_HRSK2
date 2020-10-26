import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Image, Text, TouchableOpacity, Modal, Dimensions, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { serverUrl } from '../../constants';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class MyFeed extends Component {
  constructor(props){
    super(props);
  };
  state = {
    selected: {id: null, image: null},
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{marginBottom: 5, fontSize: 19, fontWeight: 'bold'}}>레시피</Text>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Icon name="close-outline" style={{fontSize: 25,}}></Icon>
              </TouchableHighlight>
              </View>
              <View style={{margin:10, alignContent: 'center'}}>
              {this.state.modalData
                .split('|')
                .filter((word) => word)
                .map((line, i) => {
                  return (
                    <View style={{flexDirection: 'row', marginVertical: 3}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>{i + 1}. </Text>
                    <Text style={{fontSize: 17}}>
                      {line}
                    </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
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
          <View style={styles.pictureBox}>
            {this.state.myArticles.map((article) => {
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
                    this.props.navigation.push('MyFeedDetail', {
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
  // my articles
  pictureBox: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '60%',
    margin: 20,
    backgroundColor: '#FFFBE6',
    borderRadius: 5,
    padding: 15,
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
    width: 100,
    backgroundColor: '#FCA652',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 2,
    alignContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  articleContent: {
    marginBottom: 30,
    fontSize: 20,
    fontFamily: 'HANNAAir',
  },
});

export default connect(mapStateToProps)(MyFeed); 