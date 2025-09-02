import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus, Minus } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useCart } from '@/contexts/CartContext';
import type { MenuItem, ModifierGroup, CartItem } from '@/types/restaurant';

interface CustomizeItemSheetProps {
  visible: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
}

export default function CustomizeItemSheet({ visible, onClose, menuItem }: CustomizeItemSheetProps) {
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reset form when item changes
  useEffect(() => {
    if (menuItem) {
      setSelectedModifiers({});
      setQuantity(1);
      setNotes('');
      setValidationErrors([]);
    }
  }, [menuItem]);

  if (!menuItem) return null;

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateItemPrice = (): number => {
    let total = menuItem.basePrice;
    
    menuItem.modifierGroups.forEach(group => {
      const selectedOptions = selectedModifiers[group.id] || [];
      selectedOptions.forEach(optionId => {
        const option = group.options.find(opt => opt.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });
    
    return Math.round(total * 100); // Convert to cents
  };

  const handleModifierSelect = (groupId: string, optionId: string) => {
    const group = menuItem.modifierGroups.find(g => g.id === groupId);
    if (!group) return;

    setSelectedModifiers(prev => {
      const current = prev[groupId] || [];
      
      if (group.multiSelect) {
        // Toggle option for multi-select
        const newSelection = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [groupId]: newSelection };
      } else {
        // Replace selection for single-select
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const validateSelection = (): boolean => {
    const errors: string[] = [];
    
    menuItem.modifierGroups.forEach(group => {
      if (group.required) {
        const selected = selectedModifiers[group.id] || [];
        if (selected.length === 0) {
          errors.push(`Please select ${group.name.toLowerCase()}`);
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) {
      return;
    }

    const lineTotal = calculateItemPrice() * quantity;
    
    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedModifiers,
      notes: notes.trim(),
      lineTotal,
    };

    addToCart(cartItem);
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const isOptionSelected = (groupId: string, optionId: string): boolean => {
    return (selectedModifiers[groupId] || []).includes(optionId);
  };

  const getSelectedOptionText = (group: ModifierGroup): string => {
    const selected = selectedModifiers[group.id] || [];
    if (selected.length === 0) return '';
    
    const optionNames = selected.map(optionId => {
      const option = group.options.find(opt => opt.id === optionId);
      return option?.name || '';
    }).filter(Boolean);
    
    return optionNames.join(', ');
  };

  const itemPrice = calculateItemPrice();
  const totalPrice = itemPrice * quantity;

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
              <Text style={styles.title}>Customize Item</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={Colors.semantic.tabInactive} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Item Info */}
            <View style={styles.itemSection}>
              <Text style={styles.itemName}>{menuItem.name}</Text>
              <Text style={styles.itemDescription}>{menuItem.description}</Text>
              <Text style={styles.basePrice}>
                Base price: {formatPrice(Math.round(menuItem.basePrice * 100))}
              </Text>
            </View>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <View style={styles.errorContainer}>
                {validationErrors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>• {error}</Text>
                ))}
              </View>
            )}

            {/* Modifier Groups */}
            {menuItem.modifierGroups.map((group) => (
              <View key={group.id} style={styles.modifierGroup}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupTitle}>
                    {group.name} {group.required && '*'}
                  </Text>
                  {!group.multiSelect && (
                    <Text style={styles.groupSubtitle}>Choose one</Text>
                  )}
                  {group.multiSelect && (
                    <Text style={styles.groupSubtitle}>Choose any</Text>
                  )}
                </View>

                <View style={styles.optionsList}>
                  {group.options.map((option) => {
                    const isSelected = isOptionSelected(group.id, option.id);
                    
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected
                        ]}
                        onPress={() => handleModifierSelect(group.id, option.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionInfo}>
                          <Text style={[
                            styles.optionName,
                            isSelected && styles.optionNameSelected
                          ]}>
                            {option.name}
                          </Text>
                          {option.price > 0 && (
                            <Text style={[
                              styles.optionPrice,
                              isSelected && styles.optionPriceSelected
                            ]}>
                              +{formatPrice(Math.round(option.price * 100))}
                            </Text>
                          )}
                        </View>
                        
                        <View style={[
                          styles.optionSelector,
                          isSelected && styles.optionSelectorSelected
                        ]}>
                          {isSelected && (
                            <View style={styles.optionCheck} />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Special Instructions */}
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Special Instructions</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special requests..."
                placeholderTextColor={Colors.semantic.tabInactive}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />
            </View>

            {/* Quantity & Add to Cart */}
            <View style={styles.bottomSection}>
              <View style={styles.quantitySection}>
                <Text style={styles.quantityTitle}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity <= 1 && styles.quantityButtonDisabled
                    ]}
                    onPress={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} color={quantity <= 1 ? Colors.semantic.tabInactive : Colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{quantity}</Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      quantity >= 10 && styles.quantityButtonDisabled
                    ]}
                    onPress={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus size={16} color={quantity >= 10 ? Colors.semantic.tabInactive : Colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addToCartText}>
                  Add to Cart • {formatPrice(totalPrice)}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
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
    maxHeight: '85%',
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
  itemSection: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.semantic.dividerLight,
  },
  itemName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.semantic.headingText,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: Colors.semantic.tabInactive,
    lineHeight: 24,
    marginBottom: 12,
  },
  basePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.semantic.bodyText,
  },
  errorContainer: {
    backgroundColor: '#FEF1F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: Colors.semantic.errorAlert,
    fontWeight: '500',
    marginBottom: 4,
  },
  modifierGroup: {
    marginBottom: 32,
  },
  groupHeader: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.semantic.headingText,
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    fontWeight: '500',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mutedDark,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  optionItemSelected: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.semantic.bodyText,
    marginBottom: 2,
  },
  optionNameSelected: {
    color: Colors.primary,
  },
  optionPrice: {
    fontSize: 14,
    color: Colors.semantic.tabInactive,
    fontWeight: '500',
  },
  optionPriceSelected: {
    color: Colors.primary,
  },
  optionSelector: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.semantic.tabInactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSelectorSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  optionCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  notesSection: {
    marginBottom: 32,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.semantic.headingText,
    marginBottom: 12,
  },
  notesInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.semantic.inputText,
    backgroundColor: Colors.semantic.inputBackground,
    minHeight: 80,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  bottomSection: {
    gap: 24,
    paddingBottom: 24,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.semantic.headingText,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.semantic.bodyText,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  addToCartText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
});