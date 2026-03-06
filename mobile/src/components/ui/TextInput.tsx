import React, { forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TextInputProps as RNTextInputProps,
} from 'react-native';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string; // Container classes
  containerClassName?: string;
  inputClassName?: string;
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
      ...props
    },
    ref
  ) => {
    return (
      <View className={`w-full mb-4 ${containerClassName} ${className}`}>
        {label && (
          <Text className="mb-1.5 text-sm font-medium text-slate-700">
            {label}
          </Text>
        )}
        
        <RNTextInput
          ref={ref}
          placeholderTextColor="#94a3b8" // slate-400
          className={`
            w-full rounded-xl border border-slate-200 
            bg-white px-4 py-3.5 text-base text-slate-900 
            ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'}
            ${inputClassName}
          `}
          {...props}
        />

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
