import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { GlassButton } from '../src/components/common/GlassButton';
import { useRouter } from 'expo-router';

export default function Onboarding() {
    const router = useRouter();
  
    return (
      <ImageBackground 
        source={require('../assets/images/backgrounds/onboarding-bg.png')} 
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Image 
            source={require('../assets/images/logos/logo-tagline-2.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
  
          {/* Buttons sit right below logo */}
          <View style={styles.buttonContainer}>
            <GlassButton title="Log In" onPress={() => router.push('/(auth)/login')} />
            <GlassButton title="Sign Up" onPress={() => router.push('/(auth)/register')} />
          </View>
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
      alignItems: 'center',
      gap: 130, // space between logo and buttons — tweak this
    },
    logo: {
      width: 250,
      height: 250,
    },
    buttonContainer: {
      alignItems: 'center',
      gap: 10,
    },
  });