import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');
// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';

export default class DetatilImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageId: this.props.route.params.imageId,
      image: this.props.route.params.image,
      picture: this.props.route.params.picture,
      dateTime: this.props.route.params.pictureDate,
      foods: [],
      onCaption: false,
      info: {
        menu_id: this.props.route.params.imageId,
      },
      colors: ['#2bff32', '#f5dd73', '#34ebc9', '#f578ec', '#f57373'],
    };
  }
  componentDidMount() {
    this.getFood();
  }
  getFood = () => {
    console.log(typeof this.state.imageId);
    fetch(`${serverUrl}gallery/getFood/${this.state.imageId}/`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
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
    const token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}gallery/${this.state.imageId}/delImg/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
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
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Text style={styles.haru}>하루세끼</Text>
        </View>
        <View style={styles.detailArea}>
          <View style={styles.detailHeader}>
            {/* <Icon
              name="arrow-back"
              onPress={this.onBack}
              style={styles.backBtn}></Icon> */}
            <View style={styles.chartDaybox}>
              <Text style={styles.chartDaytxt}>
                {this.state.dateTime.year}년 {this.state.dateTime.month}월{' '}
                {this.state.dateTime.date}일
              </Text>
            </View>
            <View style={styles.iconBox}>
              {!this.state.onCaption && (
                <Icon
                  style={styles.onCaption}
                  onPress={this.onCaption}
                  name="eye"
                />
              )}
              {this.state.onCaption && (
                <Icon
                  style={styles.onCaption}
                  onPress={this.onCaption}
                  name="eye-off"
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
                  const k = 0.8;
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
                      }}>
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

            {this.state.onCaption && (
              <View>
                {this.state.foods &&
                  this.state.foods.map((food, i) => {
                    return (
                      <View
                        style={{
                          marginTop: 20,
                          marginHorizontal: 10,
                          borderRadius: 10,
                          backgroundColor: '#fff',
                          elevation: 5,
                          paddingVertical: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                        key={i}>
                        <Text
                          style={{
                            fontSize: 25,
                            fontFamily: 'BMHANNAAir',
                            color: '#232323',
                            paddingTop: 10,
                            marginHorizontal: 20,
                            marginVertical: 10,
                          }}>
                          {food[0]['DESC_KOR']}
                        </Text>
                        <Text
                          style={{
                            fontSize: 25,
                            fontFamily: 'BMHANNAAir',
                            color: '#232323',
                            paddingTop: 10,
                            marginHorizontal: 20,
                            marginVertical: 10,
                          }}>
                          {food[0]['SERVING_SIZE']} g
                        </Text>
                      </View>
                    );
                  })}
              </View>
            )}
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
    backgroundColor: '#FFFBE6',
  },
  navbar: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    backgroundColor: '#fca652',
  },
  haru: {
    fontSize: 30,
    fontFamily: 'BMJUA',
    color: '#fff',
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
});
