import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingCart } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useCart } from '@/contexts/CartContext';
import { getRestaurantById } from '@/lib/restaurantData';
import type { MenuItem } from '@/types/restaurant';
import CustomizeItemSheet from './CustomizeItemSheet';

interface RestaurantMenuProps {
  visible: boolean;
  onClose: () => void;
  restaurantId: string;
  onViewCart: () => void;
}

export default function RestaurantMenu({ visible, onClose, restaurantId, onViewCart }: RestaurantMenuProps) {
  const insets = useSafeAreaInsets();
  const { cart } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCustomizeSheet, setShowCustomizeSheet] = useState(false);

  const restaurant = getRestaurantById(restaurantId);

  if (!restaurant) {
    return null;
  }

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setShowCustomizeSheet(true);
  };

  const handleCustomizeClose = () => {
    setShowCustomizeSheet(false);
    setSelectedItem(null);
  };

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.total || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <ArrowLeft size={24} color={Colors.semantic.bodyText} strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{restaurant.name}</Text>
            </View>

            {cartItemCount > 0 && (
              <TouchableOpacity style={styles.cartButton} onPress={onViewCart}>
                <View style={styles.cartIcon}>
                  <ShoppingCart size={16} color={Colors.white} strokeWidth={2} />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                  </View>
                </View>
                <Text style={styles.cartTotal}>{formatPrice(cartTotal)}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Menu */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {restaurant.categories.map((category) => (
              <View key={category.id} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                
                <View style={styles.itemsList}>
                  {category.items.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.menuItem}
                      onPress={() => handleItemPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                        <Text style={styles.itemPrice}>
                          {formatPrice(Math.round(item.basePrice * 100))}
                        </Text>
                      </View>
                      
                      <View style={styles.addButton}>
                        <Text style={styles.addButtonText}>Customize & Add</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Customize Item Sheet */}
          <CustomizeItemSheet
            visible={showCustomizeSheet}
            onClose={handleCustomizeClose}
            menuItem={selectedItem}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    flex: 1,
    backgroundColor: Colors.semantic.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.semantic.headingText,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.semantic.headingText,
    marginBottom: 20,
  },
  itemsList: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    lineHeight: 20,
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});