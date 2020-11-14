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
import {Radar} from 'react-native-pathjs-charts';
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
  onLabelPress = (label, value) => {
    alert(label + ':' + value);
  };

  render() {
    // console.log('1', this.props.menu);
    // let data = [
    //   {
    //     speed: 74,
    //     balance: 29,
    //     explosives: 40,
    //     energy: 40,
    //     flexibility: 30,
    //     agility: 25,
    //     endurance: 44,
    //   },
    // ];

    // let options = {
    //   width: 290,
    //   height: 290,
    //   margin: {
    //     top: 20,
    //     left: 20,
    //     right: 30,
    //     bottom: 20,
    //   },
    //   r: 150,
    //   max: 100,
    //   fill: '#2980B9',
    //   stroke: '#2980B9',
    //   animate: {
    //     type: 'oneByOne',
    //     duration: 200,
    //   },
    //   label: {
    //     fontFamily: 'Arial',
    //     fontSize: 14,
    //     fontWeight: true,
    //     fill: '#34495E',
    //     // onLabelPress: this.onLabelPress(),
    //   },
    // };
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
        <ScrollView>{/* <Radar data={data} options={options} /> */}</ScrollView>
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
