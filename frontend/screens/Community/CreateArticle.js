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
      tagInput: '',
      content: '',
      CswitchValue: true,
      SswitchValue: true,
      RswitchValue: false,
      articleInfo: {
        content: '',
        foods: {
        },
        recipes: {},
        image: this.props.route.params.selected.image,
        canComment: true,
        canSearch: true,
      },
      tempArticleInfo: {
        // foods: [
        //   {
        //     food: '칼국수',
        //     recipe: '',
        //   },
        //   {
        //     food: '닭가슴살',
        //     recipe: '',
        //   },
        // ],
        foods: {
          '칼국수': ['밀'],
          '닭가슴살': [],
        }
      },
      recipeInput: '',
      activeRecipe: '칼국수',
      count: 1,
    };
  };
  createArticle = async() => {
    var myRecipe = '';
    // Object.values(this.state.tempArticleInfo.foods[food]).map((value) => {
    //   if (value) {
    //     myRecipe = myRecipe + value + '|';
    //   }
    // });
    // this.state.articleInfo.foods.recipe.map((value) => {
    //   if (value) {
    //     myRecipe = myRecipe + value + '|';
    //   }
    // });
    await this.setState({
      articleInfo: {
        ...this.state.articleInfo,
        recipes: this.state.tempArticleInfo.foods,
      }
      // foods: {
      //   ...this.state.articleInfo.foods,
      //   recipe: myRecipe,
      // }
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
          <View style={styles.tagBlock}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10,}}>
              <Text style={{fontSize: 20}}>태그 추가</Text>
              <Text style={{color: 'gray', marginLeft: 15}}>태그를 추가해보세요.</Text>
            </View>
            <View style={styles.tagArea}>
              {this.state.tags.map((value, idx) => {
                return (
                  <View key={idx} style={styles.tagBox}>
                    <Text style={{color: '#fff', fontSize: 18}}>#</Text>
                    <Text  style={{color: '#fff', fontSize: 18, paddingHorizontal: 5,}}>{value}</Text>
                    <Icon 
                      name="close" 
                      style={{color: '#fff', fontSize: 20}} 
                      onPress={() => {
                        const tags = this.state.tags.filter((v,i) => i !== idx);
                        this.setState({
                          tags: tags,
                        });
                      }}
                    ></Icon>
                  </View>
                )
              })}
              <View style={styles.tagBox}>
                <Text style={{color: '#fff', fontSize: 20, paddingHorizontal: 3}}>#</Text>
                <TextInput
                    placeholder="태그"
                    value={this.state.tagInput}
                    maxLength={10}
                    onChangeText={(text) => {
                      this.setState({
                        tagInput: text,
                      });
                    }}
                    style={styles.tagInput}
                    multiline={true}
                  />
                <Icon 
                  name="add" 
                  size={20}
                  style={{color: '#fff'}}
                  onPress={() => {
                    const tags = this.state.tags.concat(this.state.tagInput)
                    this.setState({
                      tags: tags,
                      tagInput: '',
                    });
                  }}></Icon>
                </View>
              </View>
            </View>
          <View style={styles.switchBlock}>
            <Text style={styles.fs1}>댓글 허용</Text>
            <Switch
              onValueChange={() => this.CtoggleSwitch(!this.state.CswitchValue)}
              value={this.state.CswitchValue}
            />
          </View>
          <View style={styles.switchBlock}>
            <Text style={styles.fs1}>검색 허용</Text>
            <Switch
              onValueChange={() => this.StoggleSwitch(!this.state.SswitchValue)}
              value={this.state.SswitchValue}
            />
          </View>
          <View style={styles.switchBlock}>
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
            <>
              <View style={styles.recipeArea}>
                {this.state.tempArticleInfo.foods && Object.entries(this.state.tempArticleInfo.foods).map(([key, value], i) => {
                  const btnColor = this.state.activeRecipe === key ? '#f39c12' : 'transparent';
                  return (
                    <TouchableOpacity
                      key={i} 
                      style={[styles.foodBox, {borderColor: btnColor, borderWidth:2}]}
                      onPress={() => {
                        this.setState({
                          activeRecipe: key,
                        });
                      }}>
                      <Text>{key}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
              <View style={styles.recipeArea}>
                {this.state.tempArticleInfo.foods && Object.entries(this.state.tempArticleInfo.foods).map(([key, value], i) => {
                  return (
                    <>
                    {key === this.state.activeRecipe && (  
                      <View key={i} style={{width: '100%'}}>
                        <Text style={{fontSize: 15, color: 'gray'}}>{key}의 레시피를 입력하세요.</Text>
                        {this.state.tempArticleInfo.foods[key].map((v, idx) => {
                          return (
                            <View key={idx} style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10, alignItems: 'center'}}>
                              <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20}}>{idx+1}. </Text>
                                <Text style={{fontSize: 20, maxWidth: '85%'}}>{v}</Text>
                              </View>
                              <Icon 
                                name="trash-outline"
                                style={{fontSize: 30,}}
                                onPress={() => {
                                  const newArray = this.state.tempArticleInfo.foods[key].filter((v,index) => index !== idx);
                                  this.setState({
                                    tempArticleInfo: {
                                      ...this.state.tempArticleInfo,
                                      foods: {
                                        ...this.state.tempArticleInfo.foods,
                                        [key]: newArray, 
                                      },
                                    },
                                    recipeInput: '',
                                  });
                                }}  
                              ></Icon>
                            </View>
                          )
                        })}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin:10,}}>
                          <Text style={{fontSize: 20, textAlign: 'center'}}>{this.state.tempArticleInfo.foods[key].length + 1}. </Text>
                          <TextInput 
                            placeholder="레시피를 입력하세요"
                            value={this.state.recipeInput}
                            maxLength={50}
                            onChangeText={(text) => {
                              this.setState({
                                recipeInput: text,
                              });
                            }}
                            style={styles.recipeInput}
                          />
                          <Icon 
                            name="checkbox-outline" 
                            style={{fontSize: 40, color: 'gray'}}
                            onPress={()=> {
                              const recipeArray = value.concat(this.state.recipeInput);
                              this.setState({
                                tempArticleInfo: {
                                  ...this.state.tempArticleInfo,
                                  foods: {
                                    ...this.state.tempArticleInfo.foods,
                                    [key]: recipeArray, 
                                  },
                                },
                                recipeInput: '',
                              });
                            }}  
                          ></Icon>
                        </View>
                      </View>
                    )}
                    </>
                  )
                })}
              </View>
            </>
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
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 15,
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
    width: 230,
    minHeight: 100,
  },
  next: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  //recipe
  recipeArea: {
    backgroundColor: '#fff', 
    // height: 50, 
    flexDirection: 'row',
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
  },
  foodBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 100,
    padding: 15,
    marginHorizontal: 10,
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
  recipeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    height: 40,
    width: '77%',
    maxWidth: '77%',
  },
  // tag
  tagArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBlock:{
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  tagBox: {
    backgroundColor: 'gray',
    borderRadius: 30,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 10,
  },
  tagInput: {
    backgroundColor: '#fff',
    height: 40,
    minWidth: 40,
    maxWidth: 100,

  },
});

export default connect(mapStateToProps)(CreateArticle);
