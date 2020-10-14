import React, { Component } from 'react';
import {SafeAreaView, View, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';

// const serverUrl = 'http://localhost:8080/';
// const serverUrl = 'http://10.0.2.2:8080/';
const serverUrl = 'http://j3a410.p.ssafy.io/api/';

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarSource: '',
    }
  };
  onCamera = async () => {
    const token = await AsyncStorage.getItem('auth-token')
    const options = {
      title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
        this.setState({
          avatarSource: source,
        });
        this.props.onCamera(response);

      }
    });
  };
  render() {
    return (
      <TouchableOpacity style={styles.btnBox} onPress={this.onCamera}>
        <Icon name="camera" style={styles.cameraLogo}></Icon>
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