import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  PanResponder,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Draggable from 'react-native-draggable';
import {serverUrl} from '../../../constants';

import Camera from '../../Camera/Camera';

const {width, height} = Dimensions.get('window');

export default class CropImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      // moveX: gestureState.moveX,
      // moveY: gestureState.moveY,
    };
  }
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('auth-token');
  };
  // pressIn(x, y) {
  //   console.log('@@확인1@@', x, y)
  // };
  // pressOut(x, y) {
  //   console.log('@@확인2@@', x, y)
  // };
  render() {
    return (
      <View style={{width: '100%', height: '100%', flex: 1}} >
        <Draggable
            renderColor='black'
            renderText='A'
            isCircle
            renderSize={30} 
            x={0}
            y={0}
            minX={0}
            minY={0}
            maxX={width}
            maxY={width}
            onLongPress={()=>console.log('long press')}
            onShortPressRelease={()=>console.log('press drag')}
            // onPressIn={(moveX, moveY)=>pressIn(moveX, moveY)}
            // onPressOut={(moveX, moveY)=>pressOut(moveX, moveY)}
          />
          <Image
            style={{height: width, width: width}}
            source={{
              uri: `data:image/jpeg;base64,${this.state.image.data}`,
            }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
