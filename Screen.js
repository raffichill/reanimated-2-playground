import Animated, {
  useSharedValue,
  interpolate,
  useDerivedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';

import AppColors from './AppColors';

import {height, width} from 'react-native-dimension';

import {
  View, 
  KeyboardAvoidingView, 
  Button, StyleSheet, 
  TouchableWithoutFeedback, 
  TextInput, 
  InputAccessoryView,
  Keyboard,
  Text
} from 'react-native';

import React, {useState, useEffect, useRef} from 'react';

export default function AnimatedStyleUpdateExample(props) {
  
  const inputAccessoryViewID = 'uniqueID';

  const [description, setDescription] = useState('');

  // useSharedValue defines the initial value
  // below are the initial values of the rotation and the width of the black box
  const degreesRotated = useSharedValue(0)
  const randomWidth = useSharedValue(10); 
  
  const inputWidth = useSharedValue(width(84));
  const inputHeight = useSharedValue(height(5));
  const bottomLeftBorderRadius = useSharedValue(width(3)); 

  const shadowWidth = useSharedValue(0); 
  const shadowHeight = useSharedValue(0); 
  const shadowOpacity = useSharedValue(0);
  const shadowRadius = useSharedValue(0);

  const rotation = useDerivedValue(() => {
    return interpolate(degreesRotated.value,
      [0,360],
      [0,360])
  })

  /////////////////// ROTATION ANIMATION /////////////////// 

  // EVENT HANDLER:
  const startAnimation = () => {
    degreesRotated.value = withTiming(120,{
      duration : 2000
    })
  }

  // ANIMATED STYLES:
  const animationStyle = useAnimatedStyle(() => {
    return{
      transform:[
        {
          rotate: rotation.value + 'deg'
        }
      ]
    }
  })

  // 

  /////////////////// BLACK BOX ANIMATION ///////////////////
  
  // EVENT HANDLER:

  const randomizeWidth = () => {
    randomWidth.value = Math.random() * 350;
  }
  
  // ANIMATED STYLES:
  const blackBoxAnimationStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, blackBoxConfig),
    };
  });
  
  // CONFIGURATION:
  const blackBoxConfig = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  /////////////////// TEXTBOX ANIMATION ///////////////////
  
  // EVENT HANDLERS:
  const handleTextInputPress = () => {
    console.log('focused!')
    this.TextInput.focus()
    inputHeight.value = height(17)
    inputWidth.value = width(90)
    shadowHeight.value = height(2)
    shadowWidth.value = width(2)
    shadowOpacity.value = 0.2
    shadowRadius.value = width(2)
    bottomLeftBorderRadius.value = width(0)
  }

  const handleDone = () => {
    // some function triggered when the inputAccessory is pressed
  }

  // ANIMATED STYLES:
  const animatedInputContainer = useAnimatedStyle(() => {
    return {
      height: withSpring(inputHeight.value, textInputConfig),
      width: withSpring(inputWidth.value, textInputConfig),
      width: withSpring(inputWidth.value, textInputConfig),
      shadowOffset: { 
        width: withSpring(shadowWidth.value, textInputConfig), 
        height: withSpring(shadowWidth.value, textInputConfig)
      },
      shadowOpacity: withSpring(shadowOpacity.value, textInputConfig), 
      shadowRadius: withSpring(shadowRadius.value, textInputConfig),
      borderBottomLeftRadius: withTiming(bottomLeftBorderRadius.value, textInputConfig),
    };
  })

  // TIMING FUNCTION & ANIMATION TYPE
  const textInputConfig = {
    duration: 10000,
    // easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  ////////////////////////////////////////////////////////////////


  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column'}}>
      
      <Animated.View style={[ styles.blackBox, blackBoxAnimationStyle]} />
      
      <Button title="toggle" onPress={randomizeWidth} />

      {/* textInput */}
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={handleTextInputPress}>
          <Animated.View style={[styles.inputContainer, animatedInputContainer]} >
            <TextInput
              ref={(input) => { this.TextInput = input; }}
              inputAccessoryViewID = {inputAccessoryViewID}
              placeholder={'Describe/add notes...'}
              onChangeText={(text) => { setDescription(text) }}
              selectionColor={AppColors.purple}
              autoCorrect={false}
              spellcheck={false}
              maxLength={120}
              numberOfLines={6}
              value={description}
              maxHeight={120}
              multiline={true}
              style={ styles.textInputStyle }
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      <InputAccessoryView nativeID={inputAccessoryViewID} style = {styles.inputAccessoryContainerStyle}>
        <TouchableWithoutFeedback 
          // onPress = {(nativeID) => { handleDone(nativeID) }}
          onPress = {Keyboard.dismiss}
          >
          <View style = {styles.inputAccessoryButtonStyle}>
            <Text style = {styles.doneButtonStyle}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </InputAccessoryView>

      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={startAnimation}>
          <Animated.View style={[styles.box,animationStyle]} />
        </TouchableWithoutFeedback>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  blackBox: {
    width: 100, height: 80, backgroundColor: 'black', margin: 30
  },
  box: {
    width: height(20),
    height: height(20),
    backgroundColor: '#631d94'
  },
  container: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    zIndex: 1, elevation: 1,
    paddingVertical: height(1.5),
    backgroundColor: AppColors.lightWhite,
    borderRadius: width(3),
  },
  textInputStyle: {
    /* styles for the text input */
    
    marginHorizontal: width(4),
    borderWidth: 1,
    // borderColor: AppColors.black,
    // width: width(74),
    // fontFamily: 'Calibri',
    fontSize: height(1.8),
    color: AppColors.darkGray,
  },
  doneButtonStyle: {
    color: AppColors.purple,
    fontSize: height(2),
  },
  inputAccessoryContainerStyle: {
    // styles for the button which hovers above the keyboard
    flex: 1,
    flexDirection: 'row',
    // alignContent: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end',
    paddingLeft: width(84)
  },
  inputAccessoryButtonStyle: {
    paddingHorizontal: width(2),
    paddingVertical: height(1.5),
    // backgroundColor: AppColors.white
  }
});