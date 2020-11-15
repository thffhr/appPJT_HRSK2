import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Image,
  Modal,
  TouchableHighlight,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl} from '../../constants';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class Community extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    articles: [],
    selected: {id: null, image: null},
    modalData: '',
    modalVisible: false,
    userData: {},
  };
  componentDidMount() {
    this.getAllArticles();
  }
  onCreateSelect = () => {
    this.props.navigation.push('CreateSelect');
  };
  getAllArticles = () => {
    fetch(`${serverUrl}articles/readAll/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('@@@@@@@@', response);
        this.setState({
          articles: response,
        });
      })
      .catch((err) => {
        console.error(err);
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
  onLikeBtn = (article) => {
    fetch(`${serverUrl}articles/articleLikeBtn/`, {
      method: 'POST',
      body: JSON.stringify({articleId: article.id}),
      headers: {
        Authorization: `Token ${this.props.user.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
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
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{marginBottom: 5, fontSize: 19, fontWeight: 'bold'}}>
                  레시피
                </Text>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Icon name="close-outline" style={{fontSize: 25}}></Icon>
                </TouchableHighlight>
              </View>
              <View style={{margin: 10, alignContent: 'center'}}>
                {/* {this.state.modalData !== '' &&
                  this.state.modalData
                    .split('|')
                    .filter((word) => word)
                    .map((line, i) => {
                      return (
                        <View style={{flexDirection: 'row', marginVertical: 3}}>
                          <Text style={{fontWeight: 'bold', fontSize: 17}}>
                            {i + 1}.{' '}
                          </Text>
                          <Text style={{fontSize: 17}}>{line}</Text>
                        </View>
                      );
                    })} */}
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView>
          <View style={{width: '100%'}}>
            <View style={styles.articles}>
              {this.state.articles.map((article) => {
                return (
                  <View style={styles.article} key={article.id}>
                    {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> */}
                    <View style={styles.writer}>
                      <View>
                        <TouchableOpacity
                          style={styles.userBtn}
                          onPress={() => {
                            this.props.navigation.push('UserFeed', {
                              username: article.user.username,
                            });
                          }}>
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
                              source={require('../../assets/images/default-profile.png')}
                            />
                          )}

                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: 20,
                              fontWeight: 'bold',
                            }}>
                            {article.user.username}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* 여기에 북마크, 삭제 등등 추가 */}
                      <Icon
                        name="ellipsis-vertical"
                        style={{marginRight: 40, fontSize: 20}}></Icon>
                    </View>
                    {/* </View> */}
                    {/* <View style={styles.tags}>
                        {article.tags.map((tag) => {
                          return (
                            <Text
                              key={tag}
                              style={{marginRight: 5, fontSize: 20}}>
                              #{tag}
                            </Text>
                          );
                        })}
                      </View> */}
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
                          onPress={() => this.onLikeBtn(article)}>
                          {article.isliked && (
                            <Icon
                              name="heart"
                              style={{fontSize: 40, color: 'red'}}
                            />
                          )}
                          {!article.isliked && (
                            <Icon name="heart-outline" style={{fontSize: 40}} />
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
                              fontSize: 20,
                              color: 'red',
                              marginRight: 5,
                            }}
                          />
                        )}
                        {article.num_of_like === 0 && (
                          <Icon
                            name="heart-outline"
                            style={{fontSize: 20, marginRight: 5}}
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
        </ScrollView>
        <TouchableOpacity
          style={styles.createArticle}
          onPress={this.onCreateSelect}>
          <Icon name="create" style={{color: '#FFFBE6', fontSize: 30}} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBE6',
    width: '100%',
    flex: 1,
  },
  articles: {
    width: '100%',
    flexDirection: 'column',
  },
  article: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 20,
  },
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  writer: {
    marginLeft: '5%',
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginHorizontal: '5%',
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
  createArticle: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 65,
    height: 65,
    borderRadius: 100,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f39c12',
  },
  menuList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  menutTxt: {
    color: '#000000',
    fontSize: 20,
  },
});

export default connect(mapStateToProps)(Community);
