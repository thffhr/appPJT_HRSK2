import React, { Component } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarSource: '',
    }
  };
  onCamera = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        this.setState({
          avatarSource: source,
        });
        this.props.onCamera(response);

      }
    });
  };
  render() {
    return (
      <TouchableOpacity style={{
        width: '100%',
        height: 300,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#E0E0E0',
        justifyContent: 'center', 
        alignItems: 'center',}}
        onPress={this.onCamera}>
          <Text>사진을 추가해보세요.</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btnBox: {
    backgroundColor: '#fca652',
    position: 'absolute',
    right: 30,
    bottom: 30,
    borderRadius: 100,
    padding: 15,
    elevation: 5,
  },
  cameraLogo: {
    fontSize: 40,
    color: '#fff',
  },
})