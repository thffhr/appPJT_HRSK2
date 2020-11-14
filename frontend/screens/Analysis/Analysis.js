import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {serverUrl} from '../../constants';

const H = Dimensions.get('window').height;
const W = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  menu: state.recordReducer.menu,
});

class Analysis extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('1', this.props.menu);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {this.props.user.profileImage && (
            <Image
              style={styles.profileImg}
              source={{
                uri: `${serverUrl}gallery` + this.props.user.profileImage,
              }}
            />
          )}
          {!this.props.user.profileImage && (
            <Image
              style={styles.profileImg}
              source={require('../../assets/images/default-profile.png')}
            />
          )}
          <Text style={{fontWeight: 'bold', marginRight: W * 0.01}}>
            {this.props.user.username}
          </Text>
          <Text>님의 식단 분석 결과입니다.</Text>
        </View>

        {/*body*/}
        <ScrollView></ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBE6',
  },
  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: W * 0.03,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginRight: W * 0.03,
  },
});

export default connect(mapStateToProps)(Analysis);
