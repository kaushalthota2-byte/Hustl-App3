import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, List, MessageCircle, Gift, Zap } from 'lucide-react-native';
import { TouchableOpacity, View, StyleSheet, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Post Task Tab Button Component
const PostTaskButton = ({ focused }: { focused: boolean }) => {
  const router = useRouter();

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptics not available, continue silently
      }
    }
    router.push('/(tabs)/post');
  };

  return (
    <TouchableOpacity
      style={styles.postTaskButton}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel="Post Task"
      accessibilityRole="button"
    >
      <View style={styles.postTaskIconContainer}>
        <LinearGradient
          colors={['#0021A5', '#FA4616']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.postTaskGradient}
        >
          <Zap size={24} color={Colors.white} strokeWidth={2.5} fill={Colors.white} />
        </LinearGradient>
      </View>
      <Text style={[
        styles.postTaskLabel,
        { color: focused ? '#0021A5' : '#9CA3AF' }
      ]}>
        Post Task
      </Text>
    </TouchableOpacity>
  );
};

// Custom tab bar button for Post Task
const PostTaskTabButton = (props: any) => {
  return (
    <View style={styles.postTaskTabContainer}>
      <PostTaskButton focused={props.accessibilityState?.selected || false} />
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: Colors.semantic.dividerLight,
            borderTopWidth: 1,
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 20,
            shadowColor: Colors.semantic.cardShadow,
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 1,
            shadowRadius: 24,
          },
          tabBarActiveTintColor: Colors.semantic.tabActive,
          tabBarInactiveTintColor: Colors.semantic.tabInactive,
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarAccessibilityLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <List size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarAccessibilityLabel: 'Tasks',
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post Task',
            tabBarButton: PostTaskTabButton,
            tabBarAccessibilityLabel: 'Post a task',
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <MessageCircle size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarAccessibilityLabel: 'Chats',
          }}
        />
        <Tabs.Screen
          name="referrals"
          options={{
            title: 'Referrals',
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                {focused && <View style={styles.activeIndicator} />}
                <Gift size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarAccessibilityLabel: 'Referrals',
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postTaskTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  postTaskButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTaskIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  postTaskGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postTaskLabel: {
    fontSize: 0, // Hide label
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
    opacity: 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    backgroundColor: Colors.semantic.tabActive,
    borderRadius: 2,
  },
});