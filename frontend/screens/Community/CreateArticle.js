import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image,
  ScrollView,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {serverUrl} from '../../constants';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
});

class CreateArticle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: ['칼국수', '닭가슴살'],
      content: '',
      CswitchValue: true,
      SswitchValue: true,
      RswitchValue: false,
      articleInfo: {
        content: '',
        recipe: {},
        image: this.props.route.params.selected.image,
        canComment: true,
        canSearch: true,
      },
      count: 1,
    };
  };
  createArticle = async() => {
    var myRecipe = '';
    Object.values(this.state.articleInfo.recipe).map((value) => {
      if (value) {
        myRecipe = myRecipe + value + '|';
      }
    });
    await this.setState({
      articleInfo: {
        ...this.state.articleInfo,
        recipe: myRecipe,
      }
    });
    fetch(`${serverUrl}articles/create/`, {
      method: 'POST',
      body: JSON.stringify(this.state.articleInfo),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.props.user.token}`,
      },
    })
      .then(() => {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Community'}],
          }),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  CtoggleSwitch = (visible) => {
    this.setState({
      CswitchValue: visible,
      articleInfo: {
        content: this.state.articleInfo.content,
        recipe: this.state.articleInfo.recipe,
        image: this.state.articleInfo.image,
        canComment: visible,
        canSearch: this.state.articleInfo.canSearch,
      },
    });
  };
  StoggleSwitch = (visible) => {
    this.setState({
      SswitchValue: visible,
      articleInfo: {
        content: this.state.articleInfo.content,
        recipe: this.state.articleInfo.recipe,
        image: this.state.articleInfo.image,
        canComment: this.state.articleInfo.canComment,
        canSearch: visible,
      },
    });
  };
  RtoggleSwitch = (visible) => {
    this.setState({
      RswitchValue: visible,
      articleInfo: {
        content: this.state.articleInfo.content,
        recipe: this.state.articleInfo.recipe,
        image: this.state.articleInfo.image,
        canComment: this.state.articleInfo.canComment,
        canSearch: visible,
      },
    });
  };
  addRecipe = () => {
    this.state.articleInfo.recipe[`sentence${this.state.count}`] = '';
    this.setState({
      count: this.state.count + 1,
    });
  };
  delRecipe = (key) => {
    delete this.state.articleInfo.recipe[key];
    this.setState({});
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
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.next} onPress={this.createArticle}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'orange'}}>
            공유
          </Text>
        </TouchableOpacity>
        <View style={styles.navbar}>
          <Text style={styles.title}>새 게시물</Text>
        </View>
        <ScrollView>  
          <View style={styles.block}>
            <TextInput
              placeholder="내용을 입력하세요"
              onChangeText={(text) => {
                this.setState({
                  articleInfo: {
                    content: text,
                    recipe: this.state.articleInfo.recipe,
                    image: this.state.articleInfo.image,
                    canComment: this.state.articleInfo.canComment,
                    canSearch: this.state.articleInfo.canSearch,
                  },
                });
              }}
              style={styles.contentInput}
              multiline={true}
            />  
            <Image
              style={{width: 100, height: 100}}
              source={{
                uri: `${serverUrl}gallery` + this.state.articleInfo.image,
              }}
            />
          </View>
          <View style={styles.block}>
            <TextInput
                placeholder="태그를 입력하세요"
                onChangeText={(text) => {
                  this.setState({
                    tags: text,
                  });
                }}
                style={[styles.fs1, {flexShrink: 1, maxWidth: '100%'}]}
                multiline={true}
              />
          </View>
          <View style={styles.block}>
            <Text style={styles.fs1}>댓글 허용</Text>
            <Switch
              onValueChange={() => this.CtoggleSwitch(!this.state.CswitchValue)}
              value={this.state.CswitchValue}
            />
          </View>
          <View style={styles.block}>
            <Text style={styles.fs1}>검색 허용</Text>
            <Switch
              onValueChange={() => this.StoggleSwitch(!this.state.SswitchValue)}
              value={this.state.SswitchValue}
            />
          </View>
          <View style={styles.block}>
            <View>
              <Text style={styles.fs1}>레시피 추가</Text>
              <Text >하단에 레시피 입력창이 생성됩니다.</Text>
            </View>
            <Switch
              onValueChange={() => this.RtoggleSwitch(!this.state.RswitchValue)}
              value={this.state.RswitchValue}
            />
          </View>
          {this.state.RswitchValue && (
            <View>
              {Object.entries(this.state.articleInfo.recipe).map(
                ([key, value], i) => {
                  return (
                    <View key={i} style={styles.recipeBox}>
                      <Text>{i + 1}. </Text>
                      <TextInput
                        placeholder="레시피를 입력해주세요"
                        value={value}
                        onChangeText={(text) => {
                          this.state.articleInfo.recipe[key] = text;
                          console.log(this.state.articleInfo.recipe);
                          this.setState({});
                        }}
                        style={styles.recipeText}
                      />
                      <Icon
                        name="remove-circle-outline"
                        style={{fontSize: 30}}
                        onPress={() => this.delRecipe(key)}></Icon>
                    </View>
                  );
                },
              )}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                }}
                onPress={this.addRecipe}>
                <Text>레시피 추가</Text>
                <Icon name="add-circle-outline"></Icon>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffbe6',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  navbar: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  block: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
  },
  contentInput: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 3,
    width: 280,
    minHeight: 100,
  },
  next: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  
  recipeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  recipeText: {
    width: '80%',
  },
  
});

export default connect(mapStateToProps)(CreateArticle);
