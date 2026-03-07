import React, { forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string; // Container classes
  containerClassName?: string;
  inputClassName?: string;
  variant?: 'default' | 'glass';
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      containerClassName = '',
      inputClassName = '',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    
    const renderInput = () => {
      if (variant === 'glass') {
        return (
          <RNTextInput
            ref={ref}
            placeholderTextColor="#94a3b8" // slate-400
            className={`w-full px-4 py-3.5 text-base text-slate-900 ${error ? 'text-red-500' : ''} ${inputClassName}`}
            style={{ backgroundColor: 'transparent' }}
            {...props}
          />
        );
      }
      return (
        <RNTextInput
          ref={ref}
          placeholderTextColor="#94a3b8" // slate-400
          className={`
            w-full rounded-full border border-slate-200 
            bg-white px-4 py-3.5 text-base text-slate-900 
            ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}
            ${inputClassName}
          `}
          {...props}
        />
      );
    };

    return (
      <View className={`w-full mb-4 ${containerClassName} ${className}`}>
        {label && (
          <Text className="mb-1.5 text-sm font-medium text-slate-700">
            {label}
          </Text>
        )}
        
          {variant === 'glass' ? (
          <View 
            className="w-full border border-white drop-shadow-lg backdrop-blur-lg"
            style={{ borderRadius: 999, overflow: 'hidden' }}
          >
              <LinearGradient
                  colors={['#FFFFFF', 'rgba(255, 255, 255, 0)']} // Inner light blue gradient matching screenshot
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0.5, y: 0.5 }} 
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                  pointerEvents="none"
              />
              <LinearGradient
                  colors={['rgba(0,0,0,0.06)', 'transparent']} // Top inner shadow for depth
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6 }}
                  pointerEvents="none"
              />
              <LinearGradient
                  colors={['rgba(0,0,0,0.06)', 'transparent']} // Left inner shadow for depth
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 6 }}
                  pointerEvents="none"
              />
              <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.06)']} // Bottom inner shadow for depth
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6 }}
                  pointerEvents="none"
              />
              <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.06)']} // Right inner shadow for depth
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 6 }}
                  pointerEvents="none"
              />
              {renderInput()}
          </View>
        ) : (
          renderInput()
        )}

        {error ? (
          <Text className="mt-1.5 text-sm text-red-500 font-medium">
            {error}
          </Text>
        ) : helperText ? (
          <Text className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';
