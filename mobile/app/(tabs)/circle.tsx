import { View, SafeAreaView } from 'react-native';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons';

export default function CircleScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <Ionicons name="people-outline" size={64} color="#0ea5e9" />
        <Typography variant="h2">My Circle</Typography>
        <Typography variant="body" color="muted" align="center">
          Manage your emergency contacts and view their statuses here.
        </Typography>
      </View>
    </SafeAreaView>
  );
}
