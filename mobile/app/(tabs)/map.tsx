import { View, SafeAreaView } from 'react-native';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <Ionicons name="map-outline" size={64} color="#0ea5e9" />
        <Typography variant="h2">Map View</Typography>
        <Typography variant="body" color="muted" align="center">
          Interactive map tracking your location and your Circle's locations will go here.
        </Typography>
      </View>
    </SafeAreaView>
  );
}
