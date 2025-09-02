import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
// Reanimated disabled for Expo Go compatibility
// import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Animations disabled for Expo Go compatibility

  useEffect(() => {
    // Auto-advance to university selection
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/image.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.brandText}>
          Sit tight. We're Hustling some info…
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.semantic.screen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6', // Lighter UF blue
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
});