import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ScrollView,
  ScrollViewProps,
  Dimensions,
} from "react-native";
const { width } = Dimensions.get("screen");
interface CustomScrollViewProps extends ScrollViewProps {
  [x: string]: any;
}

const ScrollCollapse = (props: CustomScrollViewProps) => {
  const scrollY = useRef(new Animated.Value(0));
  const header = scrollY.current.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
          { useNativeDriver: true }
        )}
      >
        <View
          style={{
            height: 2000,
            backgroundColor: "pink",
          }}
        />
      </Animated.ScrollView>
      <Animated.View
        style={{
          height: 250,
          backgroundColor: "red",
          position: "absolute",
          top: 0,
          zIndex: 1,
          width,
          transform: [
            {
              translateY: header,
            },
          ],
        }}
      />
    </View>
  );
};
export default ScrollCollapse;
