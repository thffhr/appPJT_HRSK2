import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { serverUrl } from '../../constants';

export default class MyFeedImage extends Component {
  constructor(props) {
    super(props);
  };
  state = {
    selected: {id: null, image: null},
  };
  onDetail = (article) => {
    this.setState({
      selected: {id: article.id, image: article.image},
    });
    this.props.navigation.push('MyFeedDetail', {
      article: article,
    });
  };
  render() {
    return (
      <View style={styles.pictureBox}>
        {this.props.articles.map((article) => {
          const borderColor =
            article.id === this.state.selected.id
              ? '#FCA652'
              : 'transparent';
          return (
            <TouchableOpacity
              style={[styles.imgBtn, {borderColor: borderColor}]}
              key={article.id}
              onPress={() => this.onDetail(article)}>
              <Image
                style={styles.picture}
                source={{
                  uri: `${serverUrl}gallery` + article.image,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  // my articles
  pictureBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#232323',
    marginVertical: 20,
    paddingVertical: 20,
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