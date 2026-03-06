import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Typography } from '../../src/components/ui/Typography';

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
        // routing to main app later
        alert("Login successful! Need to hook up to main app.");
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
    >
        <ScrollView contentContainerClassName="flex-grow p-6 justify-center">
            
            <View className="items-center mb-8">
                <Image 
                    source={require('../../assets/images/logos/logo-tagline-1.png')} 
                    className="w-48 h-48"
                    resizeMode="contain"
                />
            </View>

            <View className="mb-8">
                <Typography variant="h3" className="mb-2 text-slate-800">Welcome Back</Typography>
                <Typography variant="body" color="muted">Log in to continue to Shercle.</Typography>
            </View>

            <View className="gap-2 mb-8">
                <TextInput 
                    label="Email Address"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput 
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity className="self-end mt-2">
                    <Typography variant="bodySmall" color="primary" weight="medium">Forgot Password?</Typography>
                </TouchableOpacity>
            </View>

            <View className="gap-4 mt-auto">
                <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    onPress={handleLogin}
                    loading={loading}
                >
                    Log In
                </Button>
                
                <View className="flex-row justify-center items-center mt-4">
                    <Typography variant="body" color="muted" className="mr-1">Don't have an account?</Typography>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Typography variant="body" color="primary" weight="bold">Sign Up</Typography>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    </KeyboardAvoidingView>
  );
}
