import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useCart } from '@/contexts/CartContext';
import CustomizeItemSheet from './CustomizeItemSheet';

interface CartSheetProps {
  visible: boolean;
  onClose: () => void;
  onAttachToTask: () => void;
}

export default function CartSheet({ visible, onClose, onAttachToTask }: CartSheetProps) {
  const insets = useSafeAreaInsets();
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [showCustomizeSheet, setShowCustomizeSheet] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleCustomizeClose = () => {
    setShowCustomizeSheet(false);
    setSelectedItem(null);
  };

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cart?.items.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, Math.min(10, item.quantity + delta));
    updateCartItem(itemId, { quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Cart', 
          style: 'destructive',
          onPress: clearCart
        }
      ]
    );
  };

  const handleAttachToTask = () => {
    if (!cart || cart.items.length === 0) return;
    onAttachToTask();
  };

  const getSelectedOptionsText = (item: any): string[] => {
    const options: string[] = [];
    
    item.menuItem.modifierGroups.forEach((group: any) => {
      const selectedOptions = item.selectedModifiers[group.id] || [];
      selectedOptions.forEach((optionId: string) => {
        const option = group.options.find((opt: any) => opt.id === optionId);
        if (option) {
          options.push(option.name);
        }
      });
    });
    
    return options;
  };

  if (!cart) return null;

  const isEmpty = cart.items.length === 0;

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
              <Text style={styles.title}>Your Cart</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={styles.restaurantName}>{cart.restaurantName}</Text>
          </View>

          {isEmpty ? (
            <View style={styles.emptyState}>
              <ShoppingCart size={48} color={Colors.semantic.tabInactive} strokeWidth={1} />
              <Text style={styles.emptyStateText}>Your cart is empty</Text>
              <Text style={styles.emptyStateSubtext}>
                Add items from the menu to get started
              </Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.itemsList}>
                  {cart.items.map((item) => {
                    const selectedOptions = getSelectedOptionsText(item);
                    
                    return (
                      <View key={item.id} style={styles.cartItem}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemName}>{item.menuItem.name}</Text>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={16} color={Colors.semantic.errorAlert} strokeWidth={2} />
                          </TouchableOpacity>
                        </View>

                        {selectedOptions.length > 0 && (
                          <Text style={styles.itemOptions}>
                            {selectedOptions.join(', ')}
                          </Text>
                        )}

                        {item.notes && (
                          <Text style={styles.itemNotes}>Note: {item.notes}</Text>
                        )}

                        <View style={styles.itemFooter}>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={[
                                styles.quantityButton,
                                item.quantity <= 1 && styles.quantityButtonDisabled
                              ]}
                              onPress={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} color={item.quantity <= 1 ? Colors.semantic.tabInactive : Colors.primary} strokeWidth={2} />
                            </TouchableOpacity>
                            
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            
                            <TouchableOpacity
                              style={[
                                styles.quantityButton,
                                item.quantity >= 10 && styles.quantityButtonDisabled
                              ]}
                              onPress={() => handleQuantityChange(item.id, 1)}
                              disabled={item.quantity >= 10}
                            >
                              <Plus size={16} color={item.quantity >= 10 ? Colors.semantic.tabInactive : Colors.primary} strokeWidth={2} />
                            </TouchableOpacity>
                          </View>

                          <Text style={styles.itemTotal}>
                            {formatPrice(item.lineTotal)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Totals */}
                <View style={styles.totalsCard}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>{formatPrice(cart.subtotal)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Tax (7%)</Text>
                    <Text style={styles.totalValue}>{formatPrice(cart.tax)}</Text>
                  </View>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Fees</Text>
                    <Text style={styles.totalValue}>{formatPrice(cart.fees)}</Text>
                  </View>
                  <View style={[styles.totalRow, styles.totalRowFinal]}>
                    <Text style={styles.totalFinalLabel}>Total</Text>
                    <Text style={styles.totalFinalValue}>{formatPrice(cart.total)}</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Actions */}
              <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
                  <Text style={styles.clearButtonText}>Clear Cart</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.attachButton} onPress={handleAttachToTask}>
                  <Text style={styles.attachButtonText}>Attach to Task</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.semantic.bodyText,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.semantic.headingText,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    textAlign: 'center',
  },
  itemsList: {
    paddingTop: 20,
    gap: 16,
  },
  cartItem: {
    backgroundColor: Colors.semantic.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
    marginRight: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.semantic.errorAlert + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemOptions: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    marginBottom: 6,
    fontWeight: '500',
  },
  itemNotes: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quantityButtonDisabled: {
    borderColor: Colors.semantic.tabInactive,
    backgroundColor: Colors.muted,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
  },
  totalsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: Colors.semantic.dividerLight,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    color: Colors.semantic.tabInactive,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 15,
    color: Colors.semantic.bodyText,
    fontWeight: '600',
  },
  totalFinalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
  },
  totalFinalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.semantic.errorAlert,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.semantic.errorAlert,
  },
  attachButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  attachButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});