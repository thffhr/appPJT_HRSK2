import React, { Component } from 'react';
import {SafeAreaView, View, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';


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

        var data = new FormData();
        data.append('data', response.data);
        data.append('type', response.type);
        data.append('fileName', response.fileName);
        fetch(`${serverUrl}gallery/saveMenu/`, {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`,
          },
        })
          // .then((response) => response.json())
          .then(() => {
            // console.log(response);
          })
          .catch((error) => console.error(error));
      }
    });
  };
  render() {
    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.btnBox} onPress={this.onCamera}>
          <View style={styles.btnContent}>
            <Icon name="camera" style={styles.cameraLogo}></Icon>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  btnBox: {},
  btnContent: {},
  cameraLogo: {
    fontSize: 30,
  },
})