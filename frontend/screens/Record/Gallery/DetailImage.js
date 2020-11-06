import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  TouchableHighlight,
  Image,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';
import {serverUrl} from '../../../constants';

const {width, height} = Dimensions.get('screen');

export default class DetatilImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageId: this.props.route.params.imageId,
      image: this.props.route.params.image,
      picture: this.props.route.params.picture,
      dateTime: this.props.route.params.pictureDate,
      mealTime: this.props.route.params.mealTime,
      foods: [],
      onCaption: false,
      info: {
        menu_id: this.props.route.params.imageId,
      },
      modalVisible: false,
      colors: ['#2bff32', '#f5dd73', '#34ebc9', '#f578ec', '#f57373'],
    };
  }
  componentDidMount= async () => {
    this.getFood();
    const token = await AsyncStorage.getItem('auth-token');
    this.setState({
      token: token,
    });
  }
  getFood = () => {
    fetch(`${serverUrl}gallery/getFood/${this.state.imageId}/`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          foods: response,
        });
      })
      .catch((err) => console.error(err));
  };
  onBack = () => {
    this.props.navigation.navigate('Record');
  };
  onCaption = () => {
    this.setState({
      onCaption: !this.state.onCaption,
    });
  };
  onDelete = async () => {
    fetch(`${serverUrl}gallery/${this.state.imageId}/delImg/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.state.token}`,
      },
    }).then(() => {
      alert('삭제되었습니다.');
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: '메뉴'}],
        }),
      );
    });
  };
  setModalVisible = (visible) => {
    this.setState({
      modalVisible: visible,
    });
  };
  delMenu = () => {
    var form = new FormData();
    form.append('menu2food_id', this.state.menu2food_id);
    fetch(`${serverUrl}gallery/deleteMenu/`, {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setModalVisible(!this.state.modalVisible);
        this.getFood();
      })
      .catch((err) => console.error(err));
  };
  minusCnt = (cnt, menu2food_id) => {
    if (cnt <= 1) {
      this.setModalVisible(true);
      this.setState({
        menu2food_id: menu2food_id,
      })
    } else {
      var form = new FormData();
      form.append('menu2food_id', menu2food_id);
      fetch(`${serverUrl}gallery/minusCnt/`, {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${this.state.token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          this.getFood();
        })
        .catch((err) => console.error(err));
    }
  };
  plusCnt = (menu2food_id) => {
    var form = new FormData();
    form.append('menu2food_id', menu2food_id);
    fetch(`${serverUrl}gallery/plusCnt/`, {
      method: 'POST',
      body: form,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.getFood();
      })
      .catch((err) => console.error(err));
  };
  render() {
    return (
      <View style={styles.container}>
        {/* 식단 삭제 확인용 모달 */}
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
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22,}}>
            <View style={styles.modalView}>
              <Text style={{marginBottom: 20}}>식단을 삭제하시겠습니까?</Text>
              <View style={{flexDirection:'row'}}>
                <TouchableHighlight
                  style={{...styles.modalButton, backgroundColor: '#FCA652'}}
                  onPress={() => {
                    this.delMenu();
                  }}>
                  <Text style={styles.textStyle}>삭제</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.modalButton, backgroundColor: '#FCA652'}}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.textStyle}>취소</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.detailArea}>
          <View style={styles.detailHeader}>
            {/* <Icon
              name="arrow-back"
              onPress={this.onBack}
              style={styles.backBtn}></Icon> */}
            <View style={styles.chartDaybox}>
              <Text style={styles.chartDaytxt}>
                {this.state.dateTime.year}년 {this.state.dateTime.month}월{' '}
                {this.state.dateTime.date}일, {this.state.mealTime}
              </Text>
            </View>
            <View style={styles.iconBox}>
              {!this.state.onCaption && (
                <Icon
                  style={styles.onCaption}
                  onPress={this.onCaption}
                  name="pizza"
                />
              )}
              {this.state.onCaption && (
                <Icon
                  style={styles.onCaption}
                  onPress={this.onCaption}
                  name="pizza-outline"
                />
              )}
              <Icon
                name="trash"
                onPress={this.onDelete}
                style={styles.onCaption}
              />
            </View>
          </View>
          <ScrollView style={styles.imageBody}>
            <View>
              <Image
                style={styles.image}
                source={{
                  uri: `${serverUrl}gallery` + this.state.image,
                }}
              />
              {this.state.onCaption &&
                this.state.foods &&
                this.state.foods.map((food, i) => {
                  const k = width;
                  const color = this.state.colors[i];
                  return (
                    <View
                      style={{
                        position: 'absolute',
                        left: food[2][0] * k,
                        top: food[2][1] * k,
                        width: food[2][2] * k,
                        height: food[2][3] * k,
                        borderWidth: 2,
                        borderColor: color,
                      }}
                      key={i}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            backgroundColor: color,
                            padding: 4,
                            borderBottomRightRadius: 4,
                            borderBottomLeftRadius: 4,
                            borderTopRightRadius: 4,
                            fontWeight: 'bold',
                          }}>
                          {food[0]['DESC_KOR']}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>

            <View>
              {this.state.foods &&
                this.state.foods.map((food, i) => {
                  return (
                    <View
                      style={{
                        marginVertical: 10,
                        marginHorizontal: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        elevation: 5,
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                      }}
                      key={i}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                          <View style={{flexDirection: 'row'}}>
                          <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontFamily: 'BMHANNAAir',
                            color: '#232323',
                          }}>
                            {food[0]['DESC_KOR']}
                          </Text>
                          <Text
                              style={{
                                fontSize: 17,
                                fontWeight: 'normal',
                                fontFamily: 'BMHANNAAir',
                                color: '#232323',
                                marginLeft: 10,
                                marginTop: 6,
                              }}>
                              ({food[0]['SERVING_SIZE']*food[1]} g)
                            </Text>
                          </View>
                          <Icon name='create-outline' style={{fontSize: 20}}></Icon>
                        </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        탄수화물: {(food[0]['NUTR_CONT2']*food[1]).toFixed(1)} g
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        단백질: {(food[0]['NUTR_CONT3']*food[1]).toFixed(1)} g
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        지방: {(food[0]['NUTR_CONT4']*food[1]).toFixed(1)} g
                      </Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 15,
                        }}>
                        <View style={{flexDirection: 'row', marginTop: 2,}}>
                          <Icon
                            name="remove-circle-outline"
                            style={{
                              fontSize: 20,
                              marginHorizontal: 20,
                            }}
                            onPress={() =>
                              this.minusCnt(
                                food[1],
                                food[3],
                              )
                            }></Icon>
                          <Text style={{fontSize: 18, margin:-2}}>{food[1]}</Text>
                          <Icon
                            name="add-circle-outline"
                            style={{
                              fontSize: 20,
                              marginHorizontal: 20,
                            }}
                            onPress={() =>
                              this.plusCnt(
                                food[3],
                              )
                            }></Icon>
                            <Text style={{fontSize: 18, margin:-2}}>인분</Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'BMHANNAAir',
                            color: '#232323',
                            marginTop: 2,
                          }}>
                          {food[0]['NUTR_CONT1']*food[1]} kcal
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fbfbe6',
  },
  detailArea: {
    margin: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.015,
  },
  backBtn: {
    fontSize: 30,
  },
  imageBody: {
    marginBottom: 140,
  },
  image: {
    width: width,
    height: width,
    // resizeMode:'contain'
  },
  // date
  chartDayicon: {
    fontSize: 50,
  },

  chartDaybox: {},
  chartDaytxt: {
    fontSize: 20,
    margin: 10,
  },

  // caption
  onCaption: {
    fontSize: 30,
    marginLeft: 10,
    color: 'gray',
  },
  iconBox: {
    flexDirection: 'row',
  },
  
  //modal
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
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginHorizontal: 20,
  },
});
