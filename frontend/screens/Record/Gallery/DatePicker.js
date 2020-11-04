import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Image, Dimensions, Modal, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions, TabRouter} from '@react-navigation/native';
import { Dropdown } from 'react-native-material-dropdown';
import {serverUrl} from '../../../constants';
import FoodInput from '../FoodInput/FoodInput';

import Camera from '../../Camera/Camera';

const {width, height} = Dimensions.get('window');

export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: this.props.route.params.date,
      image: null,
      mealTimeDrop: [{
        value: '아침',
      }, {
        value: '점심',
      }, {
        value: '저녁',
      }, {
        value: '간식',
      }, {
        value: '야식',
      }],
      foodInputData:{
        modalVisible: false,
      },
      delData: {
        modalVisible: false,
      },
      colors: ['#FFA7A7', '#FFE08C', '#B7F0B1', '#B2CCFF', '#D1B2FF'],
      badgeColors: ['#2ECC71', '#3498DB', '#8E44AD', '#F1C40F', '#F312A4'],
      foodsLst: [],
    };
  }
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    const dropVal = this.state.mealTimeDrop[0].value;
    this.setState({
      token: token,
      dropVal: dropVal,
    });
  };
  // ML에서 예측한 정보 가져오기
  getMenuInfo(image) {
    this.setState({
      image: image,
    })
    var data = new FormData();
    data.append('data', this.state.image.data);
    fetch(`${serverUrl}gallery/getMenuInfo/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // 여기서 this.setState 한번만 더 할게요
        // this.setState({
        //   foodsLst: this.state.foodsLst.concat(response),
        //   nowView: response[0]['DESC_KOR'],
        // });
        let testData = [{
          location: [0, 100, 100, 100],
          DESC_KOR: '즉석쌀국수',
          SERVING_SIZE: 300,
          NUTR_CONT1: 350,
          NUTR_CONT2: 75,
          NUTR_CONT3: 6.2,
          NUTR_CONT4: 3.5,
          value: 1
        },{
          location: [100, 100, 100, 100],
          DESC_KOR: '새우볶음밥',
          SERVING_SIZE: 500,
          NUTR_CONT1: 480,
          NUTR_CONT2: 89,
          NUTR_CONT3: 5.3,
          NUTR_CONT4: 2.6,
          value: 1
        },]
        this.setState({
          foodsLst: this.state.foodsLst.concat(testData),
          nowView: '즉석쌀국수'
        });
      })
      .catch((error) => console.error(error));
  }
  // mealTime
  // getBadgeStyle() {
  //   if (this.state.mealTimeData.mealTime==='아침'){
  //     return {backgroundColor: this.state.badgeColors[0]}
  //   }else if(this.state.mealTimeData.mealTime==='점심'){
  //     return {backgroundColor: this.state.badgeColors[1]}
  //   }else if(this.state.mealTimeData.mealTime==='저녁'){
  //     return {backgroundColor: this.state.badgeColors[2]}
  //   }else if(this.state.mealTimeData.mealTime==='간식'){
  //     return {backgroundColor: this.state.badgeColors[3]}
  //   }else{
  //     return {backgroundColor: this.state.badgeColors[4]}
  //   }
  // };
  // delete modal
  setdelModalVisible = (tf, idx) => {
    if (idx > -1) {
      this.setState({
        delData: {
          ...this.state.delData,
          idx: idx,
          modalVisible: tf,
        },
      });
    }else{
      this.setState({
        delData: {
          ...this.state.delData,
          modalVisible: tf,
        },
      });
    }
    
  };
  delMenu () {   
    console.log(this.state.delData.idx);
    if (this.state.delData.idx > -1) {
      this.state.foodsLst.splice(this.state.delData.idx, 1)}
    this.setdelModalVisible(false, -1)
  };
  // food 추가
  addFoodInfo(foodInfo) {
    let newFoodInfo = {}
    newFoodInfo['location'] = []
    newFoodInfo['DESC_KOR'] = foodInfo.DESC_KOR
    newFoodInfo['SERVING_SIZE'] = foodInfo.SERVING_SIZE
    newFoodInfo['NUTR_CONT1'] = foodInfo.NUTR_CONT1
    newFoodInfo['NUTR_CONT2'] = foodInfo.NUTR_CONT2
    newFoodInfo['NUTR_CONT3'] = foodInfo.NUTR_CONT3
    newFoodInfo['NUTR_CONT4'] = foodInfo.NUTR_CONT4
    newFoodInfo['value'] = 1
    this.setState({
      foodsLst: this.state.foodsLst.concat(newFoodInfo),
      nowView: newFoodInfo['DESC_KOR'],
    })
    this.setFIModalVisible(false)
  };
  setFIModalVisible(tf) {
    this.setState({
      foodInputData: {
        ...this.state.foodInputData,
        modalVisible: tf,
      },
    });
  };
  // food 보기
  changeView(foodName) {
    this.setState({
      nowView: foodName
    });
  };
  // food 수정
  foodInput() {

  };
  // 사진 저장
  onCamera() {
    let foodName = ''
    let foodLo = ''
    let foodVal = ''
    if(this.state.foodsLst) {for (var foodObject of this.state.foodsLst) {
      foodName += (foodObject.DESC_KOR + ',')
      foodVal += (foodObject.value + ',')
      for (var location of foodObject.location) {
        foodLo += (location + ',')
      }
      foodLo += '/'
    }}
    var data = new FormData();
    data.append('foodName', foodName);
    data.append('foodLo', foodLo);
    data.append('foodVal', foodVal);
    data.append('data', this.state.image.data);
    data.append('type', this.state.image.type);
    data.append('fileName', this.state.image.fileName);
    data.append('date', this.state.date);
    data.append('mealTime', this.state.dropVal);
    fetch(`${serverUrl}gallery/saveMenu/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then(() => {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: '메뉴'}],
          }),
        );
      })
      .catch((error) => console.error(error));
  };
  render(){
    return (
      <SafeAreaView style={styles.container}>
        {/* del modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.delData.modalVisible}>
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
          visible={this.state.delData.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 22,}}>
            <View style={styles.delmodalView}>
              <Text style={{marginBottom: 20}}>식단을 삭제하시겠습니까?</Text>
              <View style={{flexDirection:'row'}}>
                <TouchableHighlight
                  style={{...styles.delmodalButton, backgroundColor: '#FCA652'}}
                  onPress={() => {
                    this.delMenu();
                  }}>
                  <Text>삭제</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.delmodalButton, backgroundColor: '#FCA652'}}
                  onPress={() => {
                    this.setdelModalVisible(!this.state.delData.modalVisible);
                  }}>
                  <Text>취소</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        {/* foodInput modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.foodInputData.modalVisible}>
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
          visible={this.state.foodInputData.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20,}}>
          <View style={styles.FImodalView}>
            <FoodInput
              image={this.state.image === null ? null:this.state.image}
              saveFoodInfo={(foodInfo) => this.addFoodInfo(foodInfo)}
              close={(tf) => this.setFIModalVisible(tf)}
              />
          </View>
          </View>
        </Modal>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => this.onCamera()}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'BMHANNAAir',
              color: '#F39C12',
              marginRight: 20}}>확인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailArea}>
          <View style={styles.detailHeader}>
            {/* datepicker */}
            <DatePicker
              style={{width: 120, backgroundColor: '#fff'}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="2020-01-01"
              maxDate="2021-12-31"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date: date})}}
            />
            {/* mealTime => 커스텀 해야됌(getBadgeStyle()...) */}
            <Dropdown
              // label='시간을 선택하세요.'
              data={this.state.mealTimeDrop}
              value={this.state.dropVal}
              containerStyle = {styles.dropdown}
              pickerStyle = {styles.dropdownPicker}
              dropdownOffset={{ 'top': 10 }}
              onChangeText={(value)=> {this.setState({value});}}    
              />
          </View>
          <ScrollView style={styles.imageBody}>
            {this.state.image === null && (
              <Camera onCamera={(image) => this.getMenuInfo(image)} />
            )}
            {this.state.image !== null && (
              <View>
              {/* 음식사진 */}
              <Image
                style={styles.image}
                source={{
                  uri: `data:image/jpeg;base64,${this.state.image.data}`,
                }}
              />
              {/* 로컬리제이션 박스 표시 */}
              {this.state.foodsLst &&
                this.state.foodsLst.map((foodData, i) => {
                  const k = 0.8;
                  const color = this.state.colors[i % 5];
                  return (
                    <View
                      style={{
                        position: 'absolute',
                        left: foodData['location'][0] * k,
                        top: foodData['location'][1] * k,
                        width: foodData['location'][2] * k,
                        height: foodData['location'][3] * k,
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
                          {foodData['DESC_KOR']}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
            )}
            {/* food 보기 */}
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignContent: 'center',
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 5,
              backgroundColor: '#fff',
              elevation: 5,
            }}>
              {/* 음식추가아이콘 */}
              <View style={{
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                backgroundColor: '#F39C12',
                zIndex: 1,
                height: '100%',
                }}>
                <TouchableOpacity onPress={() => this.setFIModalVisible(true)}>
                  <Icon name="add-outline" style={{
                  color: '#fff',
                  fontSize: 50,
                  paddingHorizontal: 10,
                  paddingVertical: 8,}}></Icon>
                </TouchableOpacity>
              </View>
              {/* 음식 목록 */}
              <ScrollView horizontal={true}>
              {this.state.foodsLst &&
                this.state.foodsLst.map((foodData, i) => {
                  return (
                  <View>
                    <TouchableOpacity style={{
                      marginLeft: 10,
                      marginTop: 5,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 100,
                      borderWidth: 3,
                      borderColor: this.state.colors[i]}}
                      key={i}
                      onPress={() => this.changeView(foodData['DESC_KOR'])}>
                        {/* <Text style={{fontSize: 15, alignSelf: 'center'}}>{foodData['DESC_KOR'].slice(0, 3)}..</Text> */}
                        <>
                        {foodData['DESC_KOR'].length <= 3 && (
                          <Text style={{fontSize: 15, alignSelf: 'center'}}>{foodData['DESC_KOR']}</Text>
                        )}
                        {foodData['DESC_KOR'].length > 3 && (
                          <Text style={{fontSize: 15, alignSelf: 'center'}}>{foodData['DESC_KOR'].slice(0, 3)}..</Text>
                        )}
                        </>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                    onPress={this.setdelModalVisible(true, i)}
                    style={{position: 'absolute', right: 2, top: 5,}}>
                      <Icon name='remove-circle' style={{fontSize: 20}}></Icon>
                    </TouchableOpacity> */}
                  </View>
                );
              })}
              </ScrollView>
            </View>
            {/* food 정보 */}
            <View>
              {this.state.foodsLst &&
                this.state.foodsLst.map((foodData, i) => {
                  return (
                    <>
                    {this.state.nowView === foodData['DESC_KOR']&&(
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
                            {foodData['DESC_KOR']}
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
                              ({foodData['SERVING_SIZE']*foodData['value']} g)
                            </Text>
                          </View>
                          {/* food 수정 */}
                          <Icon name='create-outline' style={{fontSize: 20}}></Icon>
                        </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        탄수화물: {(foodData['NUTR_CONT2']*foodData['value']).toFixed(1)} g
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        단백질: {(foodData['NUTR_CONT3']*foodData['value']).toFixed(1)} g
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'BMHANNAAir',
                          color: '#7F7F7F',
                        }}>
                        지방: {(foodData['NUTR_CONT4']*foodData['value']).toFixed(1)} g
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
                            onPress={() => {
                              if(foodData['value'] > 1) {
                                foodData['value'] -= 1
                                this.setState({
                                  foodsLst: this.state.foodsLst,
                                })
                              }else{
                                this.setdelModalVisible(true, i)
                              }
                            }}></Icon>
                          <Text style={{fontSize: 18, margin:-2}}>{foodData['value']}</Text>
                          <Icon
                            name="add-circle-outline"
                            style={{
                              fontSize: 20,
                              marginHorizontal: 20,
                            }}
                            onPress={() => {
                              foodData['value'] += 1
                              this.setState({
                                foodsLst: this.state.foodsLst,
                              })
                            }}></Icon>
                            <Text style={{fontSize: 18, margin:-2}}>인분</Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'BMHANNAAir',
                            color: '#232323',
                            marginTop: 2,
                          }}>
                          {foodData['NUTR_CONT1']*foodData['value']} kcal
                        </Text>
                      </View>
                    </View>
                    )}
                    </>
                  );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbe6',
  },
  navbar: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.015,
  },
  image: {
    height: width,
  },
  imageBody: {
    marginBottom: 140,
  },
  // badge
  tagBtn: {
    backgroundColor: '#fca652'
  },
  tagName: {
    color: '#fff',
  },
  btnBox: {

  },
  innerBtn: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    elevation: 2,
  },
  innerText: {},
  // mealTime modal
  centeredView: {
    position: 'absolute',
    top: 72,
    right: -10,
    marginTop: 22
  },
  // mealTmodalView: {
  //   margin: 20,
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   paddingHorizontal: 20,
  //   paddingVertical: 15,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5
  // },
  openButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  //delete modal 삭제하시겠습니까?
  //modal
  delmodalView: {
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
  delmodalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginHorizontal: 20,
  },
  // food modal
  FImodalView: {
    width: width*0.85,
    // height: height*0.8,
    margin: 20,
    backgroundColor: '#FFFBE6',
    borderRadius: 5,
    padding: 30,
    justifyContent: 'center', 
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
  // FImodalButton: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   borderRadius: 100,
  //   marginHorizontal: 20,
  // },
  //dropdown(mealTime)
  dropdown: {
    width: '30%',
  },
  dropdownPicker: {
    width: '30%',
    position: 'absolute',
    left: '68%',
    top: '19%',
    // right: 0,
  },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: "center"
  // }
})