import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We usually want custom headers per screen to control the exact look
        tabBarActiveTintColor: '#0ea5e9', // Shercle Primary Blue
        tabBarInactiveTintColor: '#94a3b8', // Slate 400
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          height: 60, // A bit of extra breathing room for thumbs
          paddingBottom: 8, // Lift icons up from the very bottom edge on non-iPhone X devices
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
        }
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
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'My Circle',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={26} color={color} />,
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
  );
}
