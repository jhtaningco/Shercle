import { Text, TouchableOpacity, StyleSheet, View, GestureResponderEvent } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

export const GlassButton = ({ title, onPress }: GlassButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchable}>
      <BlurView intensity={25} tint="light" style={styles.blurContainer}>
        
        {/* The White-ish background fill */}
        <View style={styles.colorOverlay}>
          
          {/* 👇 THE FAKE INSET SHADOW 👇 */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.18)', 'transparent']}
            locations={[0, 1]} // Fades from top to bottom
            style={styles.innerShadow}
          />

          <Text style={styles.text}>{title}</Text>
        </View>

      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    touchable: {
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5, // Android
      },
  blurContainer: {
    width: 283,
    height: 39,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  colorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8, // Matches your 6px blur radius from Figma
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  text: {
    fontFamily: 'Poppins_500Medium', 
    color: '#000000', // Update to #FFFFFF if needed
    fontSize: 16,
  },
});