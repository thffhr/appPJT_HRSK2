import React, { Component } from 'react';
import {SafeAreaView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, TouchableHighlight, AsyncStorage, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
import {serverUrl} from '../../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // recommendLst: [],
    }
  };
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    this.setState({
      token: token,
      showRecommend: false,
    });
  };
  recommend = (text) => {
    // this.setState({username: text});
    var data = new FormData();
    data.append('search', text);
    fetch(`${serverUrl}food/search/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${this.state.token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if(response) {
          this.setState({
            showRecommend: true,
            recommendLst: response,
          })
          console.log(this.state.recommendLst)
        }
      })
      .catch((error) => console.error(error));
  };
  chooseFood(idx) {
    this.setState({
      showRecommend: false,
      foodInfo: this.state.recommendLst[idx]
    })
  };
  // cropImg() {
  //   ImagePicker.openPicker({
  //     path: this.props.image.data,
  //     width: 300,
  //     height: 400,
  //   }).then(image => {
  //     console.log(image);
  //   });
  // }
  render() {
    return (
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>영역선택</Text>
            {this.props.image !== null && (
              <TouchableOpacity onPress={this.cropImg}>
                <Image
                  style={{height: 100, width: 100}}
                  source={{
                    uri: `data:image/jpeg;base64,${this.props.image.data}`,
                  }}
                />
              </TouchableOpacity>
            )}
            {this.props.image === null && (
              <View style={{height: 100, width: 100, backgroundColor: '#fff', borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 20}}>
                <Text style={{color: '#BEBEBE'}}>사진없음</Text>
              </View>
            )}
          </View>
          <View>
            <Text>음식이름</Text>
            <TextInput
              style={[styles.inputArea, {width: W * 0.7,}]}
              placeholder="음식이름을 입력하세요."
              onChangeText={this.recommend}
              // value={this.state.foodInfo? this.state.foodInfo.DESC_KOR:}
            />
            {/* 여기에 추천 검색어가 뜨도록 */}
            {this.state.recommendLst && this.state.showRecommend &&(
              <View style={{position: 'absolute', top: 70, width: W * 0.7, backgroundColor: '#fff', borderRadius: 5, zIndex: 2, padding: 10}}>
                {this.state.recommendLst.map((food, i) => {
                  return(
                    <TouchableOpacity onPress={() => this.chooseFood(i)}>
                      <Text style={{margin: 5}} key={i}>{food['DESC_KOR']}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </View>
          <View style={styles.inputline}>
            <Text style={styles.labeltxt}>칼로리</Text>
            <TextInput
              style={[styles.inputArea, {width: W * 0.4,}]}
              value={this.state.foodInfo? this.state.foodInfo.NUTR_CONT1:''}
              placeholder="칼로리"
            />
            <Text style={styles.labeltxt}>kcal</Text>
          </View>
          <View style={styles.inputline}>
            <Text style={styles.labeltxt}>탄수화물</Text>
            <TextInput
              style={[styles.inputArea, {width: W * 0.4,}]}
              placeholder="탄수화물"
              value={this.state.foodInfo? this.state.foodInfo.NUTR_CONT2:''}
            />
            <Text style={styles.labeltxt}>g</Text>
          </View>
          <View style={styles.inputline}>
            <Text style={styles.labeltxt}>단백질</Text>
            <TextInput
              style={[styles.inputArea, {width: W * 0.4,}]}
              placeholder="단백질"
              value={this.state.foodInfo? this.state.foodInfo.NUTR_CONT3:''}
            />
            <Text style={styles.labeltxt}>g</Text>
          </View>
          <View style={styles.inputline}>
            <Text style={styles.labeltxt}>지방</Text>
            <TextInput
              style={[styles.inputArea, {width: W * 0.4,}]}
              placeholder="지방"
              value={this.state.foodInfo? this.state.foodInfo.NUTR_CONT4:''}
            />
            <Text style={styles.labeltxt}>g</Text>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  inputline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputArea: {
    // width: W * 0.7,
    height: W * 0.1,
    fontSize: W * 0.04,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: H * 0.01,
    marginBottom: H * 0.01,
    padding: W * 0.02,
  },
  labeltxt: {
    marginVertical: H * 0.01,
    marginHorizontal: H * 0.01,
  },
})