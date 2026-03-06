import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <View
      className={`bg-card rounded-2xl p-5 shadow-sm border border-slate-100 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

// Optional Sub-components for structure
export const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <View className={`mb-4 ${className}`}>{children}</View>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <View className={`${className}`}>{children}</View> // We use Typography for the actual text
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <View className={`flex-1 ${className}`}>{children}</View>
);

export const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <View className={`mt-4 pt-4 border-t border-slate-100 ${className}`}>{children}</View>
);
