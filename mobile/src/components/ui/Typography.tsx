import React from 'react';
import { Text, TextProps } from 'react-native';

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'subtitle' 
  | 'body' 
  | 'bodySmall' 
  | 'caption';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'inverse' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'default',
  align = 'left',
  weight,
  className = '',
  children,
  ...props
}) => {

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return 'text-4xl leading-tight font-bold';
      case 'h2':
        return 'text-3xl leading-snug font-bold';
      case 'h3':
        return 'text-2xl leading-normal font-bold';
      case 'h4':
        return 'text-xl leading-normal font-bold';
      case 'subtitle':
        return 'text-lg leading-relaxed font-medium';
      case 'body':
        return 'text-base leading-relaxed';
      case 'bodySmall':
        return 'text-sm leading-relaxed';
      case 'caption':
        return 'text-xs leading-none uppercase tracking-wider font-medium';
      default:
        return 'text-base';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary-foreground';
      case 'muted':
        return 'text-slate-500';
      case 'inverse':
        return 'text-white';
      case 'error':
        return 'text-red-500';
      case 'default':
      default:
        return 'text-slate-900';
    }
  };

  const getAlignStyles = () => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const getWeightStyles = () => {
    switch (weight) {
      case 'normal': return 'font-normal';
      case 'medium': return 'font-medium';
      case 'semibold': return 'font-semibold';
      case 'bold': return 'font-bold';
      default: return ''; // relies on variant's default
    }
  };

  return (
    <Text
      className={`
        ${getVariantStyles()} 
        ${getColorStyles()} 
        ${getAlignStyles()} 
        ${getWeightStyles()} 
        ${className}
      `}
      {...props}
    >
      {children}
    </Text>
  );
};
