import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Typography } from '../../src/components/ui/Typography';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // TODO: Implement actual login logic
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        // router to main app tabs
        router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/backgrounds/auth-bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
      >
          <ScrollView contentContainerClassName="flex-grow p-10">
              
              <View className="flex-1 justify-center w-full">
                  <View className="items-center mb-12">
                      <Image 
                          source={require('../../assets/images/logos/logo-tagline-1.png')} 
                          className="w-64 h-24"
                          resizeMode="contain"
                      />
                  </View>

                  <View className="items-start mb-6">
                      <Typography variant="h1" className="text-black font-extrabold text-4xl">Log In</Typography>
                  </View>

                  <View className="gap-6 mb-2 items-center w-full">
                      <View className="w-full">
                          <TextInput 
                            variant="glass"
                            label={undefined as any}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                          />
                      </View>
                      
                      <View className="w-full">
                          <TextInput 
                            variant="glass"
                            label={undefined as any}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                          />
                          
                      </View>
                  </View>

                  <View className="flex-row justify-start w-full mb-8 pl-1 mt-2">
                      <Typography variant="bodySmall" style={{ color: '#94a3b8' }}>Forgot Password? </Typography>
                      <TouchableOpacity>
                          <Typography variant="bodySmall" style={{ textDecorationLine: 'underline', color: '#94a3b8' }}>Click Here</Typography>
                      </TouchableOpacity>
                  </View>

                  <View className="items-end w-full">
                      <Button 
                          className='bg-[#4F25C7] w-full max-w-[160px]'
                          variant="login-3d" 
                          size="lg" 
                          onPress={handleLogin}
                          loading={loading}
                          fullWidth
                      >
                          Log In
                      </Button>
                  </View>
              </View>
              
              <View className="flex-row justify-center items-center mt-6 mb-6">
                  <Typography variant="body" color="muted" className="mr-1">Don't have an account?</Typography>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                      <Typography variant="body" weight="bold" style={{ color: '#0ea5e9' }}>Sign Up</Typography>
                  </TouchableOpacity>
              </View>

          </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
