import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Car, Coffee, Dumbbell, BookOpen, Pizza, Plus, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
// import Animated, { 
//   useSharedValue, 
//   useAnimatedStyle, 
//   withRepeat, 
//   withTiming, 
//   withSequence,
//   interpolate,
//   withDelay,
//   withSpring,
//   Easing
// } from 'react-native-reanimated'; // Temporarily disabled for Expo Go
import { ActivityIndicator } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';
import GlobalHeader from '@components/GlobalHeader';
import NearbyTasksWidget from '@/components/NearbyTasksWidget';
import LiveTaskUpdates from '@/components/LiveTaskUpdates';

const { width, height } = Dimensions.get('window');

const categories = [
  {
    id: 'car',
    title: 'Car Rides',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'food',
    title: 'Food Pickup',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'workout',
    title: 'Workout Partner',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'coffee',
    title: 'Coffee Runs',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'study',
    title: 'Study Partner',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'custom',
    title: 'Custom Task',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Floating Particles Component for subtle depth
const FloatingParticles = () => {
  // Particles animation temporarily disabled for Expo Go stability
  return null;
};


// Enhanced Category Card with Better Animations
const CategoryCard = ({ 
  category, 
  index, 
  onSelectTask,
  isSelecting 
}: { 
  category: any; 
  index: number; 
  onSelectTask: () => void;
  isSelecting: boolean;
}) => {
  // const scaleAnimation = useSharedValue(0.8);
  // const opacityAnimation = useSharedValue(0);
  // const translateY = useSharedValue(30);
  // const shadowAnimation = useSharedValue(0);

  // Staggered entrance animation
  React.useEffect(() => {
    // Animations temporarily disabled for Expo Go stability
  }, [index]);

  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [
  //     { scale: scaleAnimation.value },
  //     { translateY: translateY.value }
  //   ],
  //   opacity: opacityAnimation.value,
  // }));

  // const animatedShadowStyle = useAnimatedStyle(() => {
  //   const shadowOpacity = interpolate(shadowAnimation.value, [0, 1], [0, 0.15]);
  //   return {
  //     shadowOpacity,
  //   };
  // });

  return (
    <View style={styles.categoryCard}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.categoryOverlay}
        />
        <View style={styles.categoryContent}>
          <Text style={styles.categoryTitle} numberOfLines={2}>
            {category.title}
          </Text>
        </View>
      </View>
      
      {/* Footer with Select Task Button */}
      <View style={styles.categoryFooter}>
        <TouchableOpacity
          style={[
            styles.selectTaskButton,
            isSelecting && styles.selectTaskButtonDisabled
          ]}
          onPress={onSelectTask}
          disabled={isSelecting}
          activeOpacity={0.8}
          accessibilityLabel={`Select ${category.title} task`}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#0047FF', '#0021A5']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.selectTaskGradient}
          >
            {isSelecting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Text style={styles.selectTaskText}>Select Task</Text>
                <ChevronRight size={16} color={Colors.white} strokeWidth={2.5} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectingTaskId, setSelectingTaskId] = useState<string | null>(null);
  const [showReferralBanner, setShowReferralBanner] = useState(true);

  const handleSelectTask = async (categoryId: string) => {
    if (selectingTaskId) return;
    
    // Log analytics
    console.log('home_select_task_clicked', { taskId: categoryId, category: categoryId });
    
    setSelectingTaskId(categoryId);
    
    // Haptics feedback
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available, continue silently
      }
    }
    
    // Simulate task selection process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Navigate to Post Task with category prefill
    router.push({
      pathname: '/(tabs)/post',
      params: { category: categoryId }
    });
    
    setSelectingTaskId(null);
  };

  const handleDismissBanner = () => {
    setShowReferralBanner(false);
  };

  const handleInvitePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptics not available, continue silently
      }
    }
    router.push('/(tabs)/referrals');
  };

  return (
    <View style={styles.container}>
      {/* Subtle Floating Particles */}
      <FloatingParticles />
      
      <GlobalHeader />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Compact Referral Banner */}
        {showReferralBanner && (
          <View style={styles.compactReferralCard}>
            <LinearGradient
              colors={['rgba(0, 71, 255, 0.85)', 'rgba(250, 70, 22, 0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.compactReferralGradient}
            >
              <View style={styles.compactReferralContent}>
                <View style={styles.compactReferralText}>
                  <Text style={styles.compactReferralTitle} numberOfLines={2}>
                    Get $10 for every referral!
                  </Text>
                  <Text style={styles.compactReferralSubtitle} numberOfLines={1}>
                    Invite friends. Earn credits when they complete their first task.
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.compactInviteButton} 
                  onPress={handleInvitePress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.compactInviteButtonText}>Invite</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.dismissButton} 
                onPress={handleDismissBanner}
                accessibilityLabel="Dismiss banner"
              >
                <X size={16} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Nearby Tasks Widget */}
        <NearbyTasksWidget />

        {/* Task Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Task Categories</Text>
          <Text style={styles.categoriesSubtitle}>Choose what you need help with</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onSelectTask={() => handleSelectTask(category.id)}
                isSelecting={selectingTaskId === category.id}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#0021A5',
    borderRadius: 50,
    opacity: 0.1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 120, // Extra space for tab bar
  },

  // Compact Referral Card
  compactReferralCard: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: Colors.semantic.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  compactReferralGradient: {
    borderRadius: 20,
    minHeight: 96,
    maxHeight: 112,
  },
  compactReferralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    paddingRight: 40, // Space for dismiss button
  },
  compactReferralText: {
    flex: 1,
    gap: 6,
  },
  compactReferralTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  compactReferralSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    opacity: 0.95,
    fontWeight: '500',
  },
  compactInviteButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 84,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  compactInviteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dismissButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories Section
  categoriesSection: {
    paddingHorizontal: 20,
    zIndex: 3,
  },
  categoriesTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.semantic.headingText,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  categoriesSubtitle: {
    fontSize: 16,
    color: Colors.semantic.bodyText,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  
  // Enhanced Category Cards
  categoryCard: {
    width: '47%',
    height: 240, // Increased height for button
    marginBottom: 16,
    shadowColor: Colors.semantic.cardShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  imageContainer: {
    height: 160, // Fixed height for image section
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  categoryTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.3,
  },
  categoryFooter: {
    height: 60, // Fixed height for footer
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  selectTaskButton: {
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  selectTaskButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  selectTaskGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  selectTaskText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.3,
    flex: 1,
    textAlign: 'center',
  },
});