import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

class Rank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [
        {
          title: '제목1',
          user: '작성자1',
          content: '내용1',
          id: 1,
          tags: ['태그1', '태그2', '태그3'],
        },
        {
          title: '제목2',
          user: '작성자2',
          content: '내용2',
          id: 2,
          tags: ['태그1', '태그2', '태그3'],
        },
      ],
      BestArticle: [],
      BestUser: '',
      btn1_color: '#fca652',
      btn2_color: 'transparent',
      active: 'btn1',
      modalData: '',
      modalVisible: false,
    };
  }
  onBtn1 = () => {
    this.setState({
      btn1_color: '#fca652',
      btn2_color: 'transparent',
      active: 'btn1',
    });
  };
  onBtn2 = () => {
    this.setState({
      btn1_color: 'transparent',
      btn2_color: '#fca652',
      active: 'btn2',
    });
  };
  getArticles = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}articles/getbest/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          BestArticle: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getDatas = () => {
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
  componentDidMount() {
    this.getArticles();
    this.getDatas();
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.haru}>하루세끼</Text>
        </View>
        <View style={styles.btnList}>
          <TouchableOpacity
            onPress={this.onBtn1}
            style={[styles.btn1, {borderBottomColor: this.state.btn1_color}]}>
            <Text style={styles.btnText}>식단</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onBtn2}
            style={[styles.btn2, {borderBottomColor: this.state.btn2_color}]}>
            <Text style={styles.btnText}>팔로워</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <View
            style={{
              width: '100%',
              height: H,
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
        <ScrollView style={{width: '100%'}}>
          {this.state.active == 'btn1' && (
            <View style={{width: '100%'}}>
              <View style={styles.rankArea}>
                <Text style={styles.title}>Top 3</Text>
                <View style={styles.rankBox}>
                  {this.state.BestArticle.map((article, i) => {
                    return (
                      <>
                        {i < 3 && (
                          <View style={styles.topThree} key={article.id}>
                            <Image
                              style={{width: '100%', height: '50%'}}
                              source={{
                                uri: `${serverUrl}gallery` + article.image,
                              }}
                            />
                            <View style={{flexDirection: 'row', marginLeft: '5%'}}>
                              <Icon
                                name="heart"
                                style={{fontSize: 20, color: 'red'}}
                              />
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: 'BMDOHYEON',
                                  marginVertical: '3%',
                                }}>
                                {' '}
                                {article.num_of_like} likes
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: 'BMDOHYEON',
                                marginLeft: '5%',
                              }}>
                              {article.user.username}
                            </Text>
                          </View>
                        )}
                      </>
                    );
                  })}
                </View>
              </View>
              <View style={styles.articles}>
                <Text style={styles.title}>인기식단</Text>
                {this.state.BestArticle.map((article) => {
                  return (
                    <View style={styles.article} key={article.id}>
                      <View style={styles.writer}>
                        {article.user.profileImage && (
                          <Image
                            style={styles.writerImg}
                            source={{
                              uri: `${serverUrl}gallery${article.user.profileImage}`,
                            }}
                          />
                        )}
                        {!article.user.profileImage && (
                          <Image
                            style={styles.writerImg}
                            source={{
                              uri:
                                'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/profle-256.png',
                            }}
                          />
                        )}
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 20,
                            fontFamily: 'BMHANNA',
                            marginBottom: 5,
                          }}>
                          {article.user.username}
                        </Text>
                      </View>
                      <Image
                        style={styles.articleImg}
                        source={{
                          uri: `${serverUrl}gallery` + article.image,
                        }}
                      />
                      <View style={styles.articleBelow}>
                        <View style={styles.articleBtns}>
                          <TouchableOpacity
                            style={{marginRight: 10}}
                            onPress={async () => {
                              const token = await AsyncStorage.getItem(
                                'auth-token',
                              );
                              fetch(`${serverUrl}articles/articleLikeBtn/`, {
                                method: 'POST',
                                body: JSON.stringify({articleId: article.id}),
                                headers: {
                                  Authorization: `Token ${token}`,
                                  'Content-Type': 'application/json',
                                },
                              })
                                .then((response) => response.json())
                                .then((response) => {
                                  console.log(response);
                                  const isliked = article.isliked;
                                  const num_of_like = article.num_of_like;
                                  if (response === 'like') {
                                    this.setState({
                                      articles: this.state.articles.map((art) =>
                                        article.id === art.id
                                          ? {
                                              ...art,
                                              isliked: !isliked,
                                              num_of_like: num_of_like + 1,
                                            }
                                          : art,
                                      ),
                                    });
                                  } else if (response === 'dislike') {
                                    this.setState({
                                      articles: this.state.articles.map((art) =>
                                        article.id === art.id
                                          ? {
                                              ...art,
                                              isliked: !isliked,
                                              num_of_like: num_of_like - 1,
                                            }
                                          : art,
                                      ),
                                    });
                                  }
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}>
                            {article.isliked && (
                              <Icon
                                name="heart"
                                style={{fontSize: 40, color: 'red'}}
                              />
                            )}
                            {!article.isliked && (
                              <Icon
                                name="heart-outline"
                                style={{fontSize: 40}}
                              />
                            )}
                          </TouchableOpacity>
                          {article.canComment && (
                            <TouchableOpacity
                              style={{marginRight: 10}}
                              onPress={() => {
                                this.props.navigation.push('Comment', {
                                  articleId: article.id,
                                });
                              }}>
                              <Icon
                                name="chatbubble-ellipses-outline"
                                style={{fontSize: 40}}
                              />
                            </TouchableOpacity>
                          )}
                          {article.recipe !== '' && (
                            <TouchableOpacity
                              style={{marginRight: 10}}
                              onPress={() => {
                                this.setModalVisible(true, article.recipe);
                              }}>
                              <Icon name="list-circle" style={{fontSize: 40}} />
                            </TouchableOpacity>
                          )}
                          {!article.recipe && (
                            <TouchableOpacity
                              style={{marginRight: 10}}
                              onPress={() => {
                                alert('레시피가 없습니다');
                              }}>
                              <Icon
                                name="list-circle-outline"
                                style={{fontSize: 40}}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {article.num_of_like > 0 && (
                            <Icon
                              name="heart"
                              style={{
                                fontSize: 30,
                                color: 'red',
                                marginRight: 5,
                              }}
                            />
                          )}
                          {article.num_of_like === 0 && (
                            <Icon
                              name="heart-outline"
                              style={{fontSize: 30, marginRight: 5}}
                            />
                          )}
                          {article.num_of_like > 2 && (
                            <Text style={styles.likeText}>
                              {article.user_1.username}외{' '}
                              {article.num_of_like - 1}
                              명이 좋아합니다.
                            </Text>
                          )}
                          {article.num_of_like === 2 && article.isliked && (
                            <Text style={styles.likeText}>
                              {article.user_1.username}님과 회원님이 좋아합니다.
                            </Text>
                          )}
                          {article.num_of_like === 2 && !article.isliked && (
                            <Text style={styles.likeText}>
                              {article.user_1.username}님과{' '}
                              {article.user_2.username}님이 좋아합니다.
                            </Text>
                          )}
                          {article.num_of_like === 1 && article.isliked && (
                            <Text style={styles.likeText}>
                              회원님이 좋아합니다.
                            </Text>
                          )}
                          {article.num_of_like === 1 && !article.isliked && (
                            <Text style={styles.likeText}>
                              {article.user_1.username}님이 좋아합니다.
                            </Text>
                          )}
                          {article.num_of_like === 0 && (
                            <Text style={styles.likeText}>
                              이 게시물에 첫 좋아요를 눌러주세요!
                            </Text>
                          )}
                        </View>
                        <Text style={styles.articleContent}>
                          {article.content}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {this.state.active == 'btn2' && (
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
                      <Text style={styles.followCnt}>
                        {user.num_of_followers}
                      </Text>
                    </TouchableOpacity>

                  </View>
                );
              })}
            </View>
          )}
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
    backgroundColor: '#fca652',
  },
  haru: {
    fontSize: 30,
    fontFamily: 'BMJUA',
    color: '#fff',
  },
  btnList: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  btn1: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 6,
  },
  btn2: {
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 6,
  },
  btnText: {
    fontSize: 20,
    color: '#696969',
    fontFamily: 'BMJUA',
  },
  rankArea: {
    width: '100%',
    marginBottom: 50,
  },
  rankBox: {
    alignSelf: 'center',
    height: W * 0.5,
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  topThree: {
    width: '30%',
    marginLeft: '2.5%',
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginLeft: '5%',
    marginBottom: 10,
    color: '#696969',
    fontFamily: 'BMDOHYEON',
  },
  articles: {
    width: '100%',
    flexDirection: 'column',
  },
  article: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 50,
  },
  writer: {
    marginLeft: '5%',
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleBelow: {
    marginLeft: '5%',
  },
  tags: {
    marginBottom: 10,
    marginLeft: '5%',
    width: '100%',
    flexDirection: 'row',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#FFFBE6',
    backgroundColor: '#fca652',
    padding: 7.5,
    marginRight: 10,
  },
  articleBtns: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
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
    fontFamily: 'BMHANNA',
    width: W * 0.05,
  },
  followUser: {
    marginRight: '5%',
    fontSize: W * 0.07,
    fontFamily: 'BMHANNA',
    width: W * 0.35,
  },
  followCnt: {
    marginRight: '5%',
    fontSize: W * 0.07,
    fontFamily: 'BMHANNA',
    width: W * 0.25,
  },
  profileImg: {
    borderRadius: W * 0.15,
    width: W * 0.15,
    height: W * 0.15,
    marginRight: '5%',
  },
  Box: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    paddingBottom: W * 0.1,
  },
  article: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 20,
  },
  writer: {
    marginLeft: '5%',
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  writerImg: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  articleImg: {
    width: '100%',
    height: 400,
    marginBottom: 10,
  },
  articleBelow: {
    marginLeft: '5%',
  },
  likeText: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'BMHANNA',
  },
  tags: {
    marginBottom: 10,
    marginLeft: '5%',
    width: '100%',
    flexDirection: 'row',
  },
  articleBtns: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
  },
  articleContent: {
    fontSize: 20,
    fontFamily: 'HANNAAir',
    marginBottom: 30,
  },
  // modal
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
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Rank;