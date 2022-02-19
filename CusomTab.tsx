import layout from "contant/layout";
import * as React from "react";
import { useEffect, useReducer, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { TabBar, TabView, TabViewProps } from "react-native-tab-view";
const { width, height } = Dimensions.get("screen");
interface CustomTabProps extends TabViewProps<any> {
  renderHeader: (data: any) => React.ReactElement | React.Component;
  minHeightHeader: number;
}
const initialTodos = {
  heightHeader: 0,
  heightTab: 0,
};
const todoReducer = (state = initialTodos, action: any) => {
  switch (action.type) {
    case "SET_HEIGHT_HEADER":
      return { ...state, heightHeader: action.height };
    case "SET_HEIGHT_TAB":
      return { ...state, heightTab: action.height };
    default:
      return state;
  }
};
var tm: any = {};
const TabContext = React.createContext(tm);
export { TabContext };

const CustomTab = (props: CustomTabProps) => {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const scrollY: any = React.useRef(new Animated.Value(0));
  const { minHeightHeader = 0, renderHeader, ...resProps } = props;
  const { heightHeader = minHeightHeader, heightTab } = state;

  const HEIGHT_HEADER = heightHeader || minHeightHeader;
  const HEIGHT_TAB = heightTab;
  const SCROLL = HEIGHT_HEADER - minHeightHeader;
  let listRefArr: any = useRef([]);
  let listOffset: any = useRef({});
  let isListGliding = useRef(false);
  useEffect(() => {
    scrollY.current.addListener(({ value }: any) => {
      const curRoute =
        props.navigationState.routes[props.navigationState.index].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.current.removeAllListeners();
    };
  }, [props.navigationState.routes, props.navigationState.index]);

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };
  const syncScrollOffset = () => {
    const curRouteKey =
      props.navigationState.routes[props.navigationState.index].key;
    console.log("curRouteKey =====", curRouteKey);
    listRefArr.current.forEach((item: any) => {
      if (item.key !== curRouteKey) {
        console.log("key ====", item.key);
        if (
          scrollY.current._value < HEIGHT_HEADER - HEIGHT_TAB * 2 &&
          scrollY.current._value >= 0
        ) {
          if (item?.value) {
            item?.value?.scrollTo?.({
              y: scrollY.current._value,
              animated: false,
            });
            item?.value?.scrollToOffset?.({
              offset: scrollY.current._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY.current._value;
          }
        } else if (scrollY.current._value >= HEIGHT_HEADER - HEIGHT_TAB * 2) {
          if (
            listOffset.current[item.key] < HEIGHT_HEADER - HEIGHT_TAB * 2 ||
            listOffset.current[item.key] == null
          ) {
            if (item?.value) {
              item?.value?.scrollTo?.({
                y: HEIGHT_HEADER - HEIGHT_TAB * 2,
                animated: false,
              });
              item?.value?.scrollToOffset?.({
                offset: HEIGHT_HEADER - HEIGHT_TAB * 2,
                animated: false,
              });
              listOffset.current[item.key] = HEIGHT_HEADER - HEIGHT_TAB * 2;
            }
          }
        }
      }
    });
  };
  const pushRef = (ref: any, route: any) => {
    if (ref) {
      const found = listRefArr.current.find((e: any) => e.key === route.key);
      if (!found) {
        listRefArr.current.push({
          key: route.key,
          value: ref,
        });
      }
    }
  };
  const translateYHeader = scrollY.current.interpolate({
    inputRange: [0, SCROLL],
    outputRange: [0, -SCROLL],
    extrapolate: "clamp",
  });
  const renderTabBar = (propsTab: any) => {
    const y = scrollY.current.interpolate({
      inputRange: [0, SCROLL],
      outputRange: [HEIGHT_HEADER, minHeightHeader],
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: "absolute",
          transform: [{ translateY: y }],
          width: layout.width,
        }}
      >
        <View
          onLayout={(e) => {
            dispatch({
              type: "SET_HEIGHT_TAB",
              height: e.nativeEvent.layout.height,
            });
          }}
        >
          {props.renderTabBar ? (
            props.renderTabBar?.(propsTab)
          ) : (
            <TabBar {...propsTab} />
          )}
        </View>
      </Animated.View>
    );
  };
  return (
    <TabContext.Provider
      value={{
        ...state,
        pushRef,
        syncScrollOffset,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        onScrollEndDrag,
        scrollY,
      }}
    >
      <View style={styles.container}>
        <TabView {...resProps} renderTabBar={renderTabBar} />
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: translateYHeader }],
            },
          ]}
          onLayout={(e) => {
            dispatch({
              type: "SET_HEIGHT_HEADER",
              height: e.nativeEvent.layout.height,
            });
          }}
        >
          {renderHeader({
            scrollY: scrollY.current,
            move: SCROLL,
          })}
        </Animated.View>
      </View>
    </TabContext.Provider>
  );
};

export default CustomTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    width,
    zIndex: 100,
  },
});
