import { View, SafeAreaView } from 'react-native';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  
  const handleLogout = () => {
      // Temporarily route back to onboarding or login
      router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <Ionicons name="person-circle-outline" size={80} color="#94a3b8" />
        <Typography variant="h2">My Profile</Typography>
        <Typography variant="body" color="muted" align="center" className="mb-4">
          Manage your account settings, emergency contacts, and privacy preferences.
        </Typography>
        
        <Button variant="outline" onPress={handleLogout}>Log Out</Button>
      </View>
    </SafeAreaView>
  );
}
