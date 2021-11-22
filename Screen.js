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

import BottomSheet from 'reanimated-bottom-sheet';

import { PanGestureHandler, onStart, onActive } from 'react-native-gesture-handler';

import AppColors from './AppColors';

import {height, width} from 'react-native-dimension';

// import CheckCircle from './check-in-circle.svg'

import {
  View, 
  KeyboardAvoidingView, 
  Button, StyleSheet, 
  TouchableWithoutFeedback, 
  TextInput, 
  InputAccessoryView,
  Keyboard,
  Text,
  useWindowDimensions
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
  const inputHeight = useSharedValue(height(6));
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

  /////////////////// BOTTOM SHEET /////////////////// 

  const dimensions = useWindowDimensions();
  const bottomSheetTop = useSharedValue(dimensions.height);

  const animatedBottomSheet = useAnimatedStyle(() => {
    return {
      top: withSpring(bottomSheetTop.value, SPRING_CONFIG),
    }
  });

  const SPRING_CONFIG = {
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  };

  // EVENT HANDLER:
  const handleBottomSheetOpen = () => {
    bottomSheetTop.value = withSpring(
      dimensions.height/2, 
      SPRING_CONFIG
    );
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      'worklet';
      context.startTop = bottomSheetTop.value
    },
    onActive(event, context) {
      'worklet';
      bottomSheetTop.value = context.startTop + event.translationY
    },
    onEnd() {
      'worklet';
      if (bottomSheetTop.value > dimensions.height /2 + 200) {
        bottomSheetTop.value = dimensions.height;
      }
      else {
        bottomSheetTop.value = dimensions.height / 2;
      }
    }
  });

  // 

  const renderContent = () => (
    <View
      style={{
        backgroundColor: AppColors.darkWhite,
        padding: 16,
        height: 450,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  );

  const sheetRef = React.useRef(null);



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
  
  // CONFIGURATION
  const blackBoxConfig = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  /////////////////// TEXTBOX ANIMATION ///////////////////
  
  // EVENT HANDLERS:
  const handleTextInputPress = () => {
    // 'worklet';
    // if(this.TextInput.isFocused()){
    //   console.log('heyooo')
    //   console.log(this.TextInput.value)
    // }
    // else {
      console.log('are we focuseddd? ' + this.TextInput.isFocused())
      inputHeight.value = height(17)
      inputWidth.value = width(90)
      shadowHeight.value = height(2)
      shadowWidth.value = width(2)
      shadowOpacity.value = 0.2
      shadowRadius.value = width(2)
      bottomLeftBorderRadius.value = width(0)
    // }
  }

  const handleDone = (TextInput) => {
    console.log('hi!')
    TextInput.Keyboard.dismiss
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
      
      <Button title="Toggle Box" onPress={randomizeWidth} />
      <Button title="Open Custom Sheet" onPress = {handleBottomSheetOpen}/>
      <Button title="Open Bottom Sheet" onPress={() => sheetRef.current.snapTo(0)} />

      <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={10}
        renderContent={renderContent}
      />

      {/* TEXT INPUT */}
      <KeyboardAvoidingView style={styles.container}>
          <View style = {{
            marginBottom: height(5)
          }}>
            <Text>
              Static Content
            </Text>
          </View>
        <TouchableWithoutFeedback onPress={handleTextInputPress}>
          <Animated.View style={[styles.inputContainer, animatedInputContainer]} >
            <TextInput
              onFocus={handleTextInputPress}
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
          // onPress = {handleDone}
          onPress = {Keyboard.dismiss}
          >
          <View style = {styles.inputAccessoryButtonStyle}>
            <Text style = {styles.doneButtonStyle}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </InputAccessoryView>

      {/* BOTTOM SHEET */}

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style = {[styles.bottomSheet, animatedBottomSheet]}>
            {/* <Text>Sheet</Text> */}
            <Button 
              title = 'close' 
              style = {{
                // borderWidth: 1,
                // flex: 1,
                // position: 'absolute', top: 0, right: 0
              }}
              onPress = {() => {bottomSheetTop.value = dimensions.height}}
              />
        </Animated.View>
      </PanGestureHandler>

      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={startAnimation}>
          <Animated.View style={[styles.box,animationStyle]} >
            {/* <CheckCircle/> */}
          </Animated.View>
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
    backgroundColor: 'tomato'
  },
  container: {
    flex: 1,
    // borderWidth: 1,
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
    // borderWidth: 1,
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
  },
  bottomSheet: {
    zIndex: 1,
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: AppColors.backgroundColour,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    shadowColor: AppColors.black, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    // justifyContent: 'center', alignItems: 'center'
  },
});