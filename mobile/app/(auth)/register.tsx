import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Text,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons';

type Step = 1 | 2 | 3;

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const progress = useRef(new Animated.Value(step)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: step,
      useNativeDriver: false, // width cannot use native driver
      tension: 20,
      friction: 7,
    }).start();
  }, [step]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [preferNotToSay, setPreferNotToSay] = useState(false);

  const [houseNo, setHouseNo] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3) as Step);
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1) as Step);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Registration Complete!');
      router.replace('/(auth)/login');
    }, 1500);
  };

  const renderStep1 = () => (
    <View>
      <Typography variant="h4" className="text-gray-900 font-bold mb-4">Account Information</Typography>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextInput label={undefined as any} placeholder="First Name" value={firstName} onChangeText={setFirstName} inputClassName="rounded-full" containerClassName="mb-3" />
        </View>
        <View className="flex-1">
          <TextInput label={undefined as any} placeholder="Last Name" value={lastName} onChangeText={setLastName} inputClassName="rounded-full" containerClassName="mb-3" />
        </View>
      </View>

      <TextInput label={undefined as any} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} inputClassName="rounded-full" containerClassName="mb-3" />
      <TextInput label={undefined as any} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} inputClassName="rounded-full" containerClassName="mb-3" />

      {/* Create Password */}
      <View className="relative">
        <TextInput label={undefined as any} placeholder="Create Password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} inputClassName="rounded-full pr-12" containerClassName="mb-0" />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="absolute right-4 top-0 bottom-0 justify-center items-center z-10">
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View className="relative mt-3">
        <TextInput label={undefined as any} placeholder="Confirm Password" secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} inputClassName="rounded-full pr-12" containerClassName="mb-0" />
        <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)} className="absolute right-4 top-0 bottom-0 justify-center items-center z-10">
          <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View className="mt-6 items-end">
        <Button variant="login-3d" size="md" className="bg-[#1E90FF] min-w-[120px]" onPress={handleNext}>
          Next
        </Button>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Typography variant="h4" className="text-gray-900 font-bold mb-4">Personal Information</Typography>

      <TextInput label={undefined as any} placeholder="Date of Birth: MM/DD/YYYY" value={dob} onChangeText={setDob} inputClassName="rounded-full" containerClassName="mb-3" />

      {/* Gender dropdown */}
      <TouchableOpacity
        className="flex-row items-center justify-between border border-slate-200 rounded-full px-4 py-3.5 bg-white mb-3"
        activeOpacity={0.7}
      >
        <Text className="text-slate-400 text-base">{gender || 'Gender Identity'}</Text>
        <Ionicons name="chevron-down" size={18} color="#94a3b8" />
      </TouchableOpacity>

      {/* Prefer not to say radio */}
      <TouchableOpacity
        className="flex-row items-center gap-2.5 mt-1"
        onPress={() => {
          setPreferNotToSay((v) => !v);
          if (!preferNotToSay) setGender('Prefer not to say');
          else setGender('');
        }}
        activeOpacity={0.7}
      >
        <View className={`w-5 h-5 rounded-full border-2 justify-center items-center ${preferNotToSay ? 'border-[#1E90FF]' : 'border-slate-300'}`}>
          {preferNotToSay && <View className="w-2.5 h-2.5 rounded-full bg-[#1E90FF]" />}
        </View>
        <Text className="text-white text-base">Prefer not to say</Text>
      </TouchableOpacity>

      <View className="flex-row gap-3 mt-6">
        <View className="flex-1">
          <Button variant="outline" size="md" className="rounded-full" fullWidth onPress={handleBack}>Back</Button>
        </View>
        <View className="flex-1">
          <Button variant="login-3d" size="md" className="bg-[#1E90FF]" fullWidth onPress={handleNext}>Next</Button>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Typography variant="h4" className="text-gray-900 font-bold mb-4">Address Information</Typography>

      <TextInput label={undefined as any} placeholder="House No. / Street No." value={houseNo} onChangeText={setHouseNo} inputClassName="rounded-full" containerClassName="mb-3" />
      <TextInput label={undefined as any} placeholder="Barangay" value={barangay} onChangeText={setBarangay} inputClassName="rounded-full" containerClassName="mb-3" />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextInput label={undefined as any} placeholder="City / Municipality" value={city} onChangeText={setCity} inputClassName="rounded-full" containerClassName="mb-3" />
        </View>
        <View className="w-24">
          <TextInput label={undefined as any} placeholder="Zip" keyboardType="number-pad" value={zipCode} onChangeText={setZipCode} inputClassName="rounded-full" containerClassName="mb-3" />
        </View>
      </View>
      <TextInput label={undefined as any} placeholder="Province" value={province} onChangeText={setProvince} inputClassName="rounded-full" containerClassName="mb-3" />

      <View className="flex-row gap-3 mt-6">
        <View className="flex-1">
          <Button variant="outline" size="md" fullWidth onPress={handleBack} disabled={loading}>Back</Button>
        </View>
        <View className="flex-1">
          <Button variant="login-3d" size="md" className="bg-[#1E90FF]" fullWidth onPress={handleSubmit} loading={loading}>Submit</Button>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/backgrounds/auth-bg.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow px-10 pb-8">

          {/* Main Content — Middle Centered */}
          <View className="flex-1 justify-center gap-2">
            {/* Logo */}
            <View className="flex-row items-center justify-center mb-6">
              <Image
                source={require('../../assets/images/logos/logo-tagline-1.png')}
                className="w-64 h-24"
                resizeMode="contain"
              />
            </View>
            
            <Typography variant="h1" className="text-5xl font-black text-gray-900 mb-2">Sign Up</Typography>
            
            {/* Progress Section */}
            <View className="mb-8">
              <View className="flex-row justify-between items-end mb-2">
                <Text className="text-slate-500 font-bold text-xs uppercase tracking-widest">Registration Progress</Text>
                <Text className="text-[#1E90FF] font-black text-sm">Step {step} of 3</Text>
              </View>
              
              <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                  {/* Background Track Markers */}
                  <View className="absolute inset-0 flex-row justify-between px-1 items-center">
                    <View className="w-1 h-1 rounded-full bg-slate-300" />
                    <View className="w-1 h-1 rounded-full bg-slate-300" />
                    <View className="w-1 h-1 rounded-full bg-slate-300" />
                  </View>

                  <Animated.View 
                      className="h-full bg-[#1E90FF] rounded-full"
                      style={{
                          width: progress.interpolate({
                              inputRange: [1, 2, 3],
                              outputRange: ['33.33%', '66.66%', '100%']
                          })
                      }}
                  />
              </View>
            </View>

            {/* Step content */}
            <View className="min-h-[450px]">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </View>
          </View>

          {/* Already have an account */}
          <View className="flex-row justify-center items-center mt-8">
            <Typography variant="body" color="muted">Already have an account? </Typography>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Typography variant="body" style={{ color: '#1E90FF' }} weight="bold">Log In</Typography>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
