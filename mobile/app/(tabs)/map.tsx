import React, { useState, useEffect } from 'react';
import { View, Dimensions, ActivityIndicator, Switch, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../src/components/ui/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/src/components/common/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';



const { width, height } = Dimensions.get('window');

const INITIAL_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('Fetching address...');
  const [subAddress, setSubAddress] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [loading, setLoading] = useState(true);
  const [sharingEnabled, setSharingEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Update Region
      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      // Format Timestamp
      const date = new Date(currentLocation.timestamp);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      };
      setTimestamp(date.toLocaleString('en-GB', options).replace(',', ''));

      // Reverse Geocode
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const item = reverseGeocode[0];
          setAddress(`${item.city || ''}, ${item.region || ''}, ${item.country || ''}`);
          setSubAddress(`${item.streetNumber || ''} ${item.street || ''}, ${item.district || ''}, ${item.city || ''}, ${item.postalCode || ''}, ${item.country || ''}`);
        }
      } catch (e) {
        setAddress('Address unavailable');
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Typography variant="body" className="mt-4">Loading Map...</Typography>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Typography variant="h3" className="mt-4">Location Error</Typography>
        <Typography variant="body" color="muted" align="center" className="px-10 mt-2">
          {errorMsg}. Please enable location permissions in settings.
        </Typography>
      </View>
    );
  }

  return (
    <View className="flex-1 " style={{ paddingTop: insets.top }}>
      {/* Header Container */}
      <View className="px-6">
        <Header 
          name="Maria Santos" 
          onNotificationPress={() => console.log('Notification pressed')} 
        />
      </View>

      <View className="flex-1 overflow-hidden">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />
          )}
        </MapView>

        {/* Floating UI Elements */}
        <View className="absolute top-4 left-5 right-5 flex-row gap-2.5">
           {/* Search bar or filter buttons could go here */}
        </View>

        {/* Location Info Card */}
        <View 
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{ 
            position: 'absolute',
            bottom: insets.bottom + 110,
            left: 24,
            right: 24,
            elevation: 10,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <BlurView intensity={100} tint="light" className="p-6">


          {/* Inner Shadow Overlays */}
          <LinearGradient
            colors={['rgba(0,0,0,0.06)', 'transparent']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, zIndex: 1 }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.03)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 8, zIndex: 1 }}
          />
          
          <View className="flex-row items-center justify-between w-full mb-3">

            <Text className="text-[22px] font-bold text-[#5c5c5c]">Send Current Location</Text>
            <Switch 
              value={sharingEnabled} 
              onValueChange={setSharingEnabled}
              trackColor={{ false: '#d1d5db', true: '#00a65a' }}
              thumbColor="#fff"
            />
          </View>

          <View className="items-start gap-1 w-full">
            <Text className="text-[20px] font-bold text-[#7a7a7a]">Your Location:</Text>
            <Text className="text-[18px] font-bold text-[#9e9e9e] leading-tight">{address}</Text>
            <Text className="text-[17px] text-[#9e9e9e] leading-tight">
              {subAddress}
            </Text>
            
            <View className="mt-1">
              {location && (
                <Text className="text-[16px] text-[#9e9e9e]">
                  Latitude {location.coords.latitude.toFixed(6)}, Long {location.coords.longitude.toFixed(6)}
                </Text>
              )}
              
              <Text className="text-[16px] text-[#9e9e9e]">
                {timestamp}
              </Text>
            </View>
          </View>
          </BlurView>
        </View>



      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';

