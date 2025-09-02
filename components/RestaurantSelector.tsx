import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronRight, Store } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { RESTAURANTS } from '@/lib/restaurantData';

interface RestaurantSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectRestaurant: (restaurantId: string) => void;
  onSelectOther: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.semantic.screen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: Colors.semantic.tabInactive + '40',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.semantic.headingText,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  restaurantsList: {
    gap: 12,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.semantic.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  otherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mutedDark,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    marginTop: 8,
  },
  restaurantIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    fontWeight: '500',
  },
});
export default function RestaurantSelector({
  visible,
  onClose,
  onSelectRestaurant,
  onSelectOther,
}: RestaurantSelectorProps) {
  const insets = useSafeAreaInsets();

  const handleRestaurantPress = (restaurantId: string) => {
    onSelectRestaurant(restaurantId);
    onClose();
  };

  const handleOtherPress = () => {
    onSelectOther();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>Select Restaurant</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.restaurantsList}>
              {RESTAURANTS.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.restaurantItem}
                  onPress={() => handleRestaurantPress(restaurant.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.restaurantIcon}>
                    <Store size={20} color={Colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantDescription}>
                      {restaurant.categories.length} categories available
                    </Text>
                  </View>
                  <ChevronRight size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.otherItem}
                onPress={handleOtherPress}
                activeOpacity={0.7}
              >
                <View style={styles.restaurantIcon}>
                  <Store size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
                </View>
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>Other</Text>
                  <Text style={styles.restaurantDescription}>
                    Enter custom restaurant name
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}