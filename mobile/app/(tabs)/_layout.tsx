import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [state.index]);
  
  return (
    <View style={[styles.tabBarContainer, { bottom: 20 + insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const isSOS = route.name === 'index';
          
          // Determine Icon
          let iconName: any = 'ellipse-outline';
          if (route.name === 'index') iconName = 'flag';
          if (route.name === 'map') iconName = 'location';
          if (route.name === 'reports') iconName = 'document-text';
          if (route.name === 'profile') iconName = 'person';

          // Determine Active Color
          const activeColor = isSOS ? '#FF3131' : '#0ea5e9';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                isFocused && { ...styles.activeTabItem, backgroundColor: activeColor }
              ]}
            >
              {isFocused && (
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <LinearGradient
                    colors={['rgba(0,0,0,0.15)', 'transparent']}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, borderRadius: 40 }}
                  />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, borderRadius: 40 }}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.05)']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, borderRadius: 40 }}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.05)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 4, borderRadius: 40 }}
                  />
                </View>
              )}
              <View style={styles.tabContent}>
                <Ionicons 
                  name={isFocused && !isSOS && iconName === 'ellipse-outline' ? 'ellipse' : iconName} 
                  size={22} 
                  color={isFocused ? "#FFFFFF" : "#525252"} 
                />
                {isFocused && (
                  <Text style={styles.activeText}>
                    {label}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs

      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Circle',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={26} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <Ionicons name="document-text" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={28} color={color} />, // A slightly larger profile icon
        }}
      />
      </Tabs>
    </>
  );
}


const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    height: 70,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTabItem: {
    flex: 2,
    borderRadius: 40,
    height: 54,
    marginHorizontal: 4,
    overflow: 'hidden',
  },

  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activeText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
