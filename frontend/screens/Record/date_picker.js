import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Image, Dimensions, Modal, TouchableHighlight, AsyncStorage } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');
// const serverUrl = 'http://localhost:8080/';
const serverUrl = 'http://10.0.2.2:8080/';
// const serverUrl = 'http://j3a410.p.ssafy.io/api/';

export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {
      date: this.props.route.params.date,
      image: this.props.route.params.image,
      modalData: {
        mealTime: '아침',
        modalVisible: false
      },
    }
  };
  setModalVisible = (arr) => {
    console.log(arr)
    if (arr[1]) {
      this.setState({ 
        modalData: {
          ...this.state.modalData,
          modalVisible: arr[1]
        },
      });
    } else {
      this.setState({ 
        modalData: {
          ...this.state.modalData,
          mealTime: arr[0],
          modalVisible: arr[1],
        },
      });
    }
  };
  onCamera = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    var data = new FormData();
    data.append('data', this.state.image.data);
    data.append('type', this.state.image.type);
    data.append('fileName', this.state.image.fileName);
    data.append('date', this.state.date);
    data.append('mealTime', this.state.modalData.mealTime);
    fetch(`${serverUrl}gallery/saveMenu/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
      })
      .catch((error) => console.error(error));
        

  };
  render(){
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <Icon name="chevron-back" style={styles.haru}></Icon>
          <Icon name="paper-plane" style={styles.haru} onPress={this.onCamera}></Icon>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalData.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight style={styles.innerBtn} onPress={() => this.setModalVisible(['아침', !this.state.modalData.modalVisible])}>
                <Text style={styles.textStyle}>아침</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.innerBtn} onPress={() => this.setModalVisible(['점심', !this.state.modalData.modalVisible])}>
                <Text style={styles.textStyle}>점심</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.innerBtn}  onPress={() => this.setModalVisible(['저녁', !this.state.modalData.modalVisible])}>
                <Text style={styles.textStyle}>저녁</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.innerBtn}  onPress={() => this.setModalVisible(['간식', !this.state.modalData.modalVisible])}>
                <Text style={styles.textStyle}>간식</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.innerBtn}  onPress={() => this.setModalVisible(['야식', !this.state.modalData.modalVisible])}>
                <Text style={styles.textStyle}>야식</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <View style={styles.detailArea}>
          <View style={styles.detailHeader}>
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
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                this.setModalVisible(['', true]);
              }}
            >
              <Text style={styles.textStyle}>{this.state.modalData.mealTime}</Text>
            </TouchableHighlight>
            
          </View>
          <ScrollView style={styles.imageBody}>
            <Image
              style={styles.image}
              source={{
                uri: `data:image/jpeg;base64,${this.state.image.data}`,
              }}
            />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  haru: {
    fontSize: 30,
    color: '#000',
    fontFamily: 'BMJUA',
    marginHorizontal: 15,
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
  // tag
  tagBtn: {
    backgroundColor: '#fca652'
  },
  tagName: {
    color: '#fff',
  },
  btnBox: {

  },
  innerBtn: {
    backgroundColor: "lightblue",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    elevation: 2,
  },
  innerText: {},
  //modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})