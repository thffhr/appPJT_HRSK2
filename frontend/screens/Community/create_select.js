import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated,
  Image,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';

class CreateSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {id: null, image: null},
      pictures: [],

      offset: 0,
      topHeight: 200, // min height for top pane header
      bottomHeight: 200, // min height for bottom pane header,
      deviceHeight: Dimensions.get('window').height,
      isDividerClicked: false,

      pan: new Animated.ValueXY(),
    };
  }
  onNext = () => {
    this.props.navigation.push('CreateArticle', {
      selected: this.state.selected,
    });
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // Initially, set the Y position offset when touch start
      onPanResponderGrant: (e, gestureState) => {
        this.setState({
          offset: e.nativeEvent.pageY,
          isDividerClicked: true,
        });
      },

      // When we drag the divider, set the bottomHeight (component state) again.
      onPanResponderMove: (e, gestureState) => {
        this.setState({
          bottomHeight:
            gestureState.moveY > this.state.deviceHeight - 40
              ? 40
              : this.state.deviceHeight - gestureState.moveY,
          offset: e.nativeEvent.pageY,
        });
      },

      onPanResponderRelease: (e, gestureState) => {
        // Do something here for the touch end event
        this.setState({
          offset: e.nativeEvent.pageY,
          isDividerClicked: false,
        });
      },
    });
  }

  componentDidMount() {
    this.getAllPictures();
  }

  getAllPictures = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    fetch(`${serverUrl}gallery/myImgs/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          pictures: response,
          selected: {id: response[0].id, image: response[0].image},
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.next} onPress={this.onNext}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
            다음
          </Text>
          <Icon name="chevron-forward" size={26} color={'#fff'}></Icon>
        </TouchableOpacity>
        <View style={styles.navbar}>
          <Text style={styles.title}>사진선택</Text>
        </View>
        <Animated.View
          style={[
            styles.selected,
            {minHeight: 40, flex: 1},
            {height: this.state.topHeight},
          ]}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{
              uri: `${serverUrl}gallery` + this.state.selected.image,
            }}
          />
        </Animated.View>
        <View
          style={[
            styles.description,
            this.state.isDividerClicked
              ? {backgroundColor: '#fca652'}
              : {backgroundColor: '#ffb46b'},
          ]}
          {...this._panResponder.panHandlers}>
          <Text style={{color: '#fff'}}>사진에서 선택</Text>
        </View>
        <Animated.View
          style={[
            {backgroundColor: 'white', minHeight: 40},
            {height: this.state.bottomHeight},
          ]}>
          <ScrollView>
            <View style={styles.pictures}>
              {this.state.pictures.map((picture) => {
                const borderColor =
                  picture.id === this.state.selected.id
                    ? '#fca652'
                    : 'transparent';
                return (
                  <TouchableOpacity
                    style={[styles.imgBtn, {borderColor: borderColor}]}
                    key={picture.id}
                    onPress={() => {
                      this.setState({
                        selected: {id: picture.id, image: picture.image},
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
        </Animated.View>
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
    // borderBottomColor: 'gray',
    // borderBottomWidth: 2,
    backgroundColor: '#fca652',
  },
  title: {
    fontSize: 30,
    // fontWeight: 'bold',
    fontFamily: 'BMJUA',
    color: '#fff',
  },
  next: {
    flexDirection: 'row',
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  selected: {
    width: '100%',
  },
  description: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffb46b',
  },
  pictures: {
    width: '100%',
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

export default CreateSelect;
