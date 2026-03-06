import React, { useState } from 'react';
import { View, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons'; // Assuming @expo/vector-icons is installed

type Step = 1 | 2 | 3;

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  // Step 1: Account
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Personal
  const [dob, setDob] = useState(''); // Could use a date picker later
  const [gender, setGender] = useState('');

  // Step 3: Address
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

  const renderStepIndicator = () => {
    return (
      <View className="flex-row justify-between items-center mb-6 px-4">
        {[1, 2, 3].map((s) => (
          <View key={s} className="flex-row items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${step >= s ? 'bg-primary' : 'bg-slate-200'}`}>
              <Typography variant="bodySmall" className={step >= s ? 'text-white' : 'text-slate-500'} weight="bold">{s}</Typography>
            </View>
            {s < 3 && (
              <View className={`h-1 w-12 mx-2 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View className="gap-2">
      <Typography variant="h4" className="mb-4">Account Information</Typography>
      <View className="flex-row gap-4">
          <View className="flex-1">
              <TextInput label="First Name" placeholder="Juan" value={firstName} onChangeText={setFirstName} />
          </View>
          <View className="flex-1">
              <TextInput label="Last Name" placeholder="Dela Cruz" value={lastName} onChangeText={setLastName} />
          </View>
      </View>
      <TextInput label="Phone Number" placeholder="+63 912 345 6789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput label="Email Address" placeholder="juan@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput label="Create Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput label="Confirm Password" placeholder="••••••••" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      
      <Button variant="primary" size="lg" fullWidth className="mt-4" onPress={handleNext}>Next</Button>
    </View>
  );

  const renderStep2 = () => (
    <View className="gap-2">
      <Typography variant="h4" className="mb-4">Personal Information</Typography>
      {/* TODO: Replace with actual DatePicker component later */}
      <TextInput label="Date of Birth" placeholder="MM/DD/YYYY" value={dob} onChangeText={setDob} />
      
      {/* Simple selection for Gender Identity */}
      <Typography variant="bodySmall" weight="medium" className="text-slate-700 mb-1">Gender Identity</Typography>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((g) => (
            <TouchableOpacity 
                key={g} 
                onPress={() => setGender(g)}
                className={`py-2 px-4 rounded-xl border ${gender === g ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white'}`}
            >
                <Typography variant="body" className={gender === g ? 'text-primary' : 'text-slate-600'}>{g}</Typography>
            </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row gap-4 mt-6">
          <View className="flex-1">
            <Button variant="outline" size="lg" fullWidth onPress={handleBack}>Back</Button>
          </View>
          <View className="flex-1">
            <Button variant="primary" size="lg" fullWidth onPress={handleNext}>Next</Button>
          </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="gap-2">
      <Typography variant="h4" className="mb-4">Address Information</Typography>
      
      <TextInput label="House No. / Street No." placeholder="123 Mabini St" value={houseNo} onChangeText={setHouseNo} />
      <TextInput label="Barangay" placeholder="Brgy. San Jose" value={barangay} onChangeText={setBarangay} />
      <View className="flex-row gap-4">
          <View className="flex-1">
              <TextInput label="City / Municipality" placeholder="Quezon City" value={city} onChangeText={setCity} />
          </View>
          <View className="w-1/3">
              <TextInput label="Zip Code" placeholder="1000" keyboardType="number-pad" value={zipCode} onChangeText={setZipCode} />
          </View>
      </View>
      <TextInput label="Province" placeholder="Metro Manila" value={province} onChangeText={setProvince} />

      <View className="flex-row gap-4 mt-6">
          <View className="flex-1">
            <Button variant="outline" size="lg" fullWidth onPress={handleBack} disabled={loading}>Back</Button>
          </View>
          <View className="flex-1">
            <Button variant="primary" size="lg" fullWidth onPress={handleSubmit} loading={loading}>Submit</Button>
          </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      {/* Header with back button to login if on step 1 */}
      <View className="pt-12 px-4 pb-2 flex-row items-center">
        {step === 1 && (
            <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-slate-100">
                <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerClassName="flex-grow p-6">
        <View className="items-center mb-8">
            <Image 
                source={require('../../assets/images/logos/logo-tagline-1.png')} 
                className="w-32 h-32"
                resizeMode="contain"
            />
        </View>

        {renderStepIndicator()}

        <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </View>
        
        {step === 1 && (
            <View className="flex-row justify-center items-center mt-8">
                <Typography variant="body" color="muted" className="mr-1">Already have an account?</Typography>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                    <Typography variant="body" color="primary" weight="bold">Log In</Typography>
                </TouchableOpacity>
            </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
