import React, {Component,} from 'react';
import {
  Text, 
  View,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Pie from 'react-native-pie';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export default class MyCarousel extends Component {

 
    constructor(props){
        super(props);
        this.state = {
            activeIndex:0,
            carouselItems: this.props.Send[0],
            dateTime: this.props.Send[1],
        }
    }
    // 캐러셀 내용
    _renderItem({item,index}){
        // console.log(this.state.dateTime)
        // 함수
        // 수량 감소
        minusCnt = (year, month, date, day, cnt, menu2food_id) => {
            console.log(year)
            if (cnt <= 1) {
            //   this.setModalVisible(true, year, month, date, menu2food_id);
            } else {
              var form = new FormData();
              form.append('menu2food_id', menu2food_id);
              fetch(`${serverUrl}gallery/minusCnt/`, {
                method: 'POST',
                body: form,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Token ${this.state.token}`,
                },
              })
                .then((response) => response.json())
                .then((response) => {
                //   this.onFetch(year, month, date, day);
                })
                .catch((err) => console.error(err));
            }
        };
        // 수량 증가
        plusCnt = (year, month, date, day, menu2food_id) => {
            var form = new FormData();
            form.append('menu2food_id', menu2food_id);
            fetch(`${serverUrl}gallery/plusCnt/`, {
              method: 'POST',
              body: form,
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${this.state.token}`,
              },
            })
              .then((response) => response.json())
              .then((response) => {
                // this.onFetch(year, month, date, day);
              })
              .catch((err) => console.error(err));
        };
        return (
        <>
            {index === 0 && (
                <>
                    {item.map((food, i) => {
                        return(
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                // borderBottomWidth: 1,
                                marginBottom: 10,
                                }}
                                key={i}>
                                <Text style={{fontSize: 18, marginLeft: 10}}>{food[0]}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Text style={{fontSize: 18}}>{food[1]}kcal</Text>
                                    <Icon
                                    name="remove-circle-outline"
                                    style={{
                                    fontSize: 20,
                                    marginTop: 2,
                                    marginLeft: 20,
                                    marginRight: 10,
                                    }}
                                    onPress={() =>
                                    this.minusCnt(
                                        this.state.dateTime.year,
                                        this.state.dateTime.month,
                                        this.state.dateTime.date,
                                        this.state.dateTime.day,
                                        food[3],
                                        food[2],)}
                                    ></Icon>
                                    <Text style={{fontSize: 18}}>{food[3]}</Text>
                                    <Icon
                                    name="add-circle-outline"
                                    style={{
                                    fontSize: 20,
                                    marginTop: 2,
                                    marginHorizontal: 10,
                                    }}
                                    onPress={() =>
                                    this.plusCnt(
                                        this.state.dateTime.year,
                                        this.state.dateTime.month,
                                        this.state.dateTime.date,
                                        this.state.dateTime.day,
                                        food[2],)}
                                        ></Icon>
                                </View>
                            </View>
                        )
                    })}                
                </>
            )}
            {index === 1 && (
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    marginTop: 10
                  }}>
                    <Pie
                        radius={65}
                        sections={[
                        {
                            percentage: item[0], //탄수화물
                            color: '#FBC02D',
                        },
                        {
                            percentage: item[1], //단백질
                            color: '#FFEB3B',
                        },
                        {
                            percentage: item[2], //지방
                            color: '#FFF59D',
                        },
                        ]}
                        strokeCap={'butt'}
                    />
                    <View style={{marginTop: 20, marginLeft: 20}}>
                        <Text>
                        <Icon
                            name="ellipse"
                            style={{color: '#FBC02D'}}></Icon>
                        탄수화물 {item[0].toFixed(1)}%
                        </Text>
                        <Text>
                        <Icon
                            name="ellipse"
                            style={{color: '#FFEB3B'}}></Icon>
                        단백질 {item[1].toFixed(1)}%
                        </Text>
                        <Text>
                        <Icon
                            name="ellipse"
                            style={{color: '#FFF59D'}}></Icon>
                        지방 {item[2].toFixed(1)}%
                        </Text>
                    </View>
                </View>
            )}
        </>
        )
    }
    // 페이지 표시
    get pagination () {
        const { entries, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={this.state.carouselItems.length}
              activeDotIndex={this.state.activeIndex}
            //   containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
                //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }
    render() {
        return (
        //   <SafeAreaView style={{flex: 1, backgroundColor:'rebeccapurple', paddingTop: 50, }}>
        <View style={{ flex: 1, justifyContent: 'center', }}>
            <Carousel
                layout={"default"}
                ref={ref => this.carousel = ref}
                data={this.state.carouselItems}
                sliderWidth={300}
                itemWidth={300}
                renderItem={this._renderItem}
                onSnapToItem = { index => this.setState({activeIndex:index}) } />
            { this.pagination }
        </View>
        //   </SafeAreaView>
        );
    }
}

