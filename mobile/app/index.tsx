import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { useRouter } from 'expo-router';

export default function Onboarding() {
    const router = useRouter();
  
    return (
      <ImageBackground 
        source={require('../assets/images/backgrounds/onboarding-bg.png')} 
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Image 
              source={require('../assets/images/logos/logo-tagline-2.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          
          {/* Buttons sit right below logo */}
          <View className="w-full gap-4 items-center">
            <Button variant="glass" size="md" onPress={() => router.push('/(auth)/login')}>
                Log In
            </Button>
            <Button variant="glass" size="md" onPress={() => router.push('/(auth)/register')}>
                Sign Up
            </Button>
          </View>
          <View style={{ flex: 0.5 }} />
        </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // centers the whole block vertically
      alignItems: 'center',
    },
    content: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-evenly', // more responsive vertical layout
    },
    logo: {
      width: 250,
      height: 250,
    },
  });