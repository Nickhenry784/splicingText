import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Text, Dimensions, 
  ImageBackground,
  Image, 
  TextInput  } from "react-native";
import React, {useEffect, useState} from 'react';
import { images } from "../assets";
import translate from 'translate-google-api';
import randomWords from 'random-words';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const Play = ({navigation, route}) => {

  const [result, setResult] = useState(null);
  const [text, setText] = useState(randomWords());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [play, setPlay] = useState(true);
  const [resultTranslate, setResultTranslate] = useState(null);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if(time > 0 && play){
        setTime(time - 1);
      }
      if(time === 0 && play){
        if(result === null){
          setPlay(false);
        }else{
          const first = result.slice(0,1);
          const length = text.length;
          const last = text.slice(length - 1,length);
          if(resultTranslate !== result && result !== text && first.toLowerCase() === last.toLowerCase()){
            setScore(score + 10);
            setText(result);
            setResult(null);
            setTime(15);
          }else{
            setPlay(false);
          }
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    }
  }, [time, play]);


  const onClickOkButton = async () => {
    const getResult = await translate(result, {
      from: "en",
      to: "vi",
    });
    setResultTranslate(getResult[0]);
    setTime(0);
  }

  const onClickBackButton = () => {
    navigation.goBack();
  }

  return (
    <ImageBackground style={appStyle.homeView} source={images.background}>
      <View style={appStyle.topView}>
        <Text style={appStyle.scoreText}>{`SCORE: ${score}`}</Text>
      </View>
      <View style={appStyle.centerView}>
        <ImageBackground source={images.panelText} style={appStyle.panelImage} >
          <Text style={appStyle.xtext}>{text}</Text>
        </ImageBackground>
        <Text style={appStyle.xtext}>{time}</Text>
        <TextInput
          style={appStyle.input}
          onChangeText={setResult}
          value={result}
        />
      </View>
      <View style={appStyle.bottomView}>
        <TouchableOpacity onPress={onClickOkButton}>
          <Image style={appStyle.centerImage} source={images.submit} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickBackButton}>
          <Image style={appStyle.centerImage} source={images.back} />
        </TouchableOpacity>
      </View>
      {!play && <View style={appStyle.scoreView}>
          <ImageBackground source={images.panelText} style={appStyle.scoreImage}>
            <Text style={appStyle.scoreText}>{`YOUR SCORE: ${score}`}</Text>
            <View style={appStyle.backView}>
              <TouchableOpacity onPress={onClickBackButton}>
                <Image style={appStyle.backModal} source={images.back} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>}
    </ImageBackground>
  );
};


export const appStyle = StyleSheet.create({
  homeView: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    resizeMode: 'cover',
  },
  input: {
    height: windowWidth > 640 ? 100 : 60,
    width: windowWidth * 0.6,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    fontSize: windowWidth > 640 ? 50 : 30,
    color: 'black',
    fontFamily: 'MestizoFont',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  centerImage: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.1,
    resizeMode: 'contain',
  },
  panelImage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.4,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xtext: {
    fontSize: windowWidth > 640 ? 70 : 50,
    color: 'white',
    fontFamily: 'MestizoFont',
  },
  scoreText: {
    fontSize: windowWidth > 640 ? 50 : 30,
    color: 'white',
    fontFamily: 'MestizoFont',
  },
  centerView: {
    flex: 0.6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  topView: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  bottomView: {
    flex: 0.2,
    position: 'absolute',
    bottom: '0%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  scoreView: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scoreImage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.4,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backModal: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.1,
    resizeMode: 'contain',
  },
  backView: {
    position: 'absolute',
    bottom: '0%',
    with: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  }
});

export default Play;