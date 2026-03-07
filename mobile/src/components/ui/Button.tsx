import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'login-3d';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string; // Support for additional tailwind classes
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  fullWidth = false,
  className = '',
  onPress,
  ...props
}) => {
  const handlePress = (e: any) => {
    if (!disabled && !loading && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress(e);
    }
  };

  const getVariantClasses = () => {
    if (disabled) return 'bg-slate-300 border-0';
    switch (variant) {
      case 'primary':
        return 'bg-primary border-0 shadow-sm';
      case 'secondary':
        return 'bg-secondary border-0';
      case 'outline':
        return 'bg-transparent border-2 border-primary rounded-full';
      case 'ghost':
        return 'bg-transparent border-0';
      case 'glass':
        return 'bg-transparent border border-white overflow-hidden rounded-full shadow-lg';
      case 'login-3d':
        return 'bg-transparent border-0'; // Will be handled largely by special render
      default:
        return 'bg-primary border-0 shadow-sm';
    }
  };

  const getSizeClasses = () => {
    const isPill = variant === 'outline' || variant === 'glass' || variant === 'login-3d';
    
    switch (size) {
      case 'sm':
        return `py-2 px-4 min-h-[36px] ${isPill ? 'rounded-full' : 'rounded-lg'}`;
      case 'md':
        return `py-3 px-6 min-h-[48px] ${isPill ? 'rounded-full' : 'rounded-xl'}`;
      case 'lg':
        return `py-4 px-8 min-h-[56px] ${isPill ? 'rounded-full' : 'rounded-2xl'}`;
      default:
        return `py-3 px-6 min-h-[48px] ${isPill ? 'rounded-full' : 'rounded-xl'}`;
    }
  };

  const getTextColorClass = () => {
    if (disabled) return 'text-slate-500';
    if (variant === 'outline' || variant === 'ghost') {
      return 'text-primary';
    }
    if (variant === 'secondary') {
      return 'text-secondary-foreground';
    }
    if (variant === 'glass') {
        return 'text-black';
    }
    if (variant === 'login-3d') {
        return 'text-white';
    }
    return 'text-primary-foreground';
  };

  const getTextSizeClass = () => {
    switch (size) {
        case 'sm': return 'text-sm';
        case 'md': return 'text-base';
        case 'lg': return 'text-lg';
        default: return 'text-base';
    }
  };

  const baseClasses = (variant === 'glass' || variant === 'login-3d') ? '' : 'flex-row items-center justify-center';
  const widthClass = fullWidth ? 'w-full' : 'self-start';
  const opacityClass = disabled ? 'opacity-60' : '';

  const renderContent = () => {
    if (loading) {
       return (
        <ActivityIndicator 
            size="small" 
            className={`${getTextColorClass()}`}
            color={variant === 'primary' ? 'white' : '#0ea5e9'}
        />
       );
    }

    return (
      <Text
        className={`font-bold tracking-wide text-center ${getTextColorClass()} ${getTextSizeClass()}`}
      >
        {children}
      </Text>
    );
  };

    // Special render for Glass button since it needs BlurView background
    if (variant === 'glass') {
        return (
          <TouchableOpacity
              onPress={handlePress}
              disabled={disabled || loading}
              activeOpacity={0.8}
              // Width constrained to match exact Figma design (283px), but fully responsive below that
              className={`mb-3 w-full max-w-[283px] ${opacityClass} ${className}`}
              style={{ 
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: 4 }, 
                  shadowOpacity: 0.2, 
                  shadowRadius: 8, 
                  elevation: 5 
              }}
              {...props}
          >
              <BlurView 
                intensity={25} 
                tint="light" 
                className="w-full rounded-full overflow-hidden border border-white"
              >
                  <View className={`w-full bg-white/30 justify-center items-center ${getSizeClasses()}`}>
                      <LinearGradient
                          colors={['rgba(0, 0, 0, 0.18)', 'transparent']}
                          locations={[0, 1]}
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, borderTopLeftRadius: 100, borderTopRightRadius: 100 }}
                      />
                      {renderContent()}
                  </View>
              </BlurView>
          </TouchableOpacity>
        )
    }

    // Special render for Login 3D button
    if (variant === 'login-3d') {
      return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            className={`w-full rounded-full overflow-hidden ${opacityClass} ${className}`}
            style={{ 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 4 }, 
                shadowOpacity: 0.25, 
                shadowRadius: 4, 
                elevation: 5 // Outer shadow
            }}
            {...props}
        >
          <View 
            className={`w-full justify-center items-center ${getSizeClasses()}`}
            // If the user provided a `bg-color` class in `className`, it will apply to TouchableOpacity.
            // But we can also set it explicitly here. Usually, `className` is passed down holding the background color. Let's make this inner view transparent by default.
            style={{ backgroundColor: 'transparent' }}  
          >
            {/* Fake inner highlight top */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
                locations={[0, 1]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6 }}
            />
            {/* Fake inner shadow bottom */}
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.18)']}
                locations={[0, 1]}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6 }}
            />
            {/* Fake inner shadow right */}
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.18)']}
                locations={[0, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 6 }}
            />
            {renderContent()}
          </View>
        </TouchableOpacity>
      );
    }

  // Standard Render
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${widthClass}
        ${opacityClass}
        ${className}
      `}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
