import * as React from "react";
import { View, useWindowDimensions, Animated, Image } from "react-native";
import { SceneMap } from "react-native-tab-view";

import {
  CustomFlatList,
  CustomScrollView,
  CustomTab,
} from "react-native-tab-view-animated-header";

const FirstRoute = (props: any) => {
  const { route } = props;
  return (
    <CustomScrollView route={route} showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, backgroundColor: "#FF8A65", height: 400 }} />
      <View style={{ flex: 1, backgroundColor: "#00BCD4", height: 1000 }} />
    </CustomScrollView>
  );
};

const SecondRoute = (props: any) => {
  const { route } = props;
  return (
    <CustomFlatList
      showsVerticalScrollIndicator={false}
      route={route}
      data={new Array(20).fill("")}
      renderItem={({ item, index }) => {
        return (
          <View
            style={{ height: 100, backgroundColor: "pink", marginTop: 10 }}
          />
        );
      }}
      keyExtractor={(item, index) => "index" + index}
    />
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "TAB 1" },
    { key: "second", title: "TAB 2" },
  ]);

  return (
    <CustomTab
      renderHeader={({ scrollY, move }) => {
        const scale = scrollY.interpolate({
          inputRange: [-100, 0, 1],
          outputRange: [2, 1, 1],
        });

        return (
          <Animated.View
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale }],
            }}
          >
            <Image
              source={{
                uri: "https://fridaycat.com.vn/wp-content/uploads/2021/04/meo-muop-giong-meo-pho-bien-tren-the-gioi.jpg",
              }}
              style={{
                width: layout.width,
                height: 200,
              }}
            />
            <Animated.Text
              style={{
                fontSize: 29,
                position: "absolute",
                zIndex: 1,
                color: "#fff",
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, move],
                      outputRange: [0, move - 40],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              Meow!!!
            </Animated.Text>
          </Animated.View>
        );
      }}
      minHeightHeader={100}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
