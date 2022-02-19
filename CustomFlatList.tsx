import { TabContext } from "./CusomTab";
import React, { Component } from "react";
import { useContext } from "react";
import { StyleSheet, Animated, FlatListProps } from "react-native";

interface CustomFlatListProps<ItemT> extends FlatListProps<ItemT> {
  [x: string]: any;
}

const CustomFlatList = (props: CustomFlatListProps<any>) => {
  const {
    heightHeader,
    heightTab,
    pushRef,
    scrollY,
    onScrollEndDrag,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
  } = useContext(TabContext);
  const { route } = props;

  return (
    <Animated.FlatList
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

export default CustomFlatList;

const styles = StyleSheet.create({});
