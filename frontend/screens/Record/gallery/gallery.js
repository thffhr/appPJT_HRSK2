import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,

  Dimensions,
  Image,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Camera from '../../Camera/camera';

const {width, height} = Dimensions.get('screen');
// const serverUrl = 'http://localhost:8080/';
const serverUrl = 'http://10.0.2.2:8080/';
// const serverUrl = 'http://j3a410.p.ssafy.io/api/';

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let date = today.getDate(); // 날짜

export default class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pictures: [],
      selected: {id: null, image: null},
      pictureTime: {},
    };
  }
  componentDidMount() {
    this.onGallery();
  };
  onGallery = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}gallery/myImgs/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          pictures: response,
          selected: {id: response[0].id, image: response[0].image},
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  pad = (n, width) => {
    n = n + '';
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join('0') + n;
  };
  onDate = (image) => {
    var newYear = this.pad(`${year}`, 4);
    var newMonth = this.pad(`${month}`, 2);
    var newDate = this.pad(`${date}`, 2);
    var sendDate = `${newYear}-${newMonth}-${newDate}`;
    this.props.navigation.navigate('MyDatePicker', {
      date: sendDate,
      image: image,

    })
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '100%'}}>
          <View style={styles.pictureBox}>
            {this.state.pictures.map((picture) => {
              const borderColor =
                picture.id === this.state.selected.id
                  ? '#FCA652'
                  : 'transparent';
              return (
                <TouchableOpacity
                  style={[styles.imgBtn, {borderColor: borderColor}]}
                  key={picture.id}
                  onPress={() => {
                    const time = picture['created_at'];
                    const year = time.substring(0, 4);
                    const month = time.substring(5, 7);
                    const date = time.substring(8, 10);
                    const pictureDate = {
                      year: year,
                      month: month,
                      date: date,
                    };

                    this.setState({
                      selected: {id: picture.id, image: picture.image},
                    });
                    this.props.navigation.push('DetailImage', {
                      imageId: picture.id,
                      image: picture.image,
                      picture: picture,
                      pictureDate: pictureDate,
                    });
                  }}>
                  <Image
                    style={styles.picture}
                    source={{
                      uri: `${serverUrl}gallery` + picture.image,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <Camera onCamera={(image) => this.onDate(image)} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height,
    flex: 1,
    backgroundColor: '#FFFBE6',
    paddingTop: 20,
  },
  pictureBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});
