import React, { Component } from 'react';
import {  } from 'react-native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';


class Analysis extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>서비스 준비중입니다...</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
})

export default Analysis;