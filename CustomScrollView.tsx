import React, { Component } from "react";
import { TabContext } from "./CusomTab";
import {
  StyleSheet,
  Animated,
  FlatListProps,
  ScrollViewProps,
} from "react-native";
import { useContext } from "react";

interface CustomScrollViewProps extends ScrollViewProps {
  [x: string]: any;
}

const CustomScrollView = (props: CustomScrollViewProps) => {
  const {
    heightHeader,
    heightTab,
    scrollY,
    pushRef,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useContext(TabContext);
  const { route } = props;
  return (
    <Animated.ScrollView
      {...props}
      ref={(ref: any) => {
        pushRef(ref, route);
      }}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
        { useNativeDriver: true }
      )}
      contentContainerStyle={{
        paddingTop: heightHeader + heightTab,
      }}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
    />
  );
};

export default CustomScrollView;

const styles = StyleSheet.create({});
