import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface HeaderProps {
  /**
   * The user's name to display in the greeting.
   */
  name: string;
  /**
   * Callback function when the notification button is pressed.
   */
  onNotificationPress?: () => void;
  /**
   * Whether to show the notification dot.
   */
  hasNotifications?: boolean;
}

/**
 * Reusable Header component for the Shercle app.
 * Extraction from HomeScreen for better modularity and maintainability.
 */
export const Header: React.FC<HeaderProps> = ({ 
  name, 
  onNotificationPress, 
  hasNotifications = true 
}) => {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-3">
        <Image 
          source={require('../../../assets/images/logos/logo-main.png')} 
          className="w-[46px] h-[46px]" 
          resizeMode="contain" 
        />
        <View>
          <Text className="text-[11px] font-bold text-[#FF6B18] uppercase tracking-[1.5px]">
            Mabuhay!
          </Text>
          <Text className="text-[17px] font-extrabold text-[#111827] mt-0.5">
            {name}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        className="w-11 h-11 bg-[#F3F4F6] rounded-[14px] items-center justify-center border border-[#E5E7EB]" 
        activeOpacity={0.7}
        onPress={onNotificationPress}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Ionicons name="notifications-outline" size={22} color="#111827" />
        {hasNotifications && (
          <View 
            className="absolute top-[10px] right-[10px] w-2 h-2 bg-[#FF3318] rounded-full border-2 border-white" 
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
