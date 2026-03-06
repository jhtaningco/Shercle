import { View, SafeAreaView } from 'react-native';
import { Typography } from '../../src/components/ui/Typography';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6 gap-6">
        <Typography variant="h2" className="text-center">Emergency Dashboard</Typography>
        <Typography variant="body" color="muted" align="center">
          This is where the giant SOS button and quick-status overview will live.
        </Typography>
        
        {/* Placeholder giant SOS Button */}
        <View className="w-48 h-48 bg-red-500 rounded-full items-center justify-center shadow-lg border-4 border-red-200">
           <Typography variant="h2" color="inverse" className="tracking-widest">SOS</Typography>
        </View>
      </View>
    </SafeAreaView>
  );
}
