import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';

const { width, height } = Dimensions.get('window');

interface OverlayProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  placement?: 'bottom' | 'top' | 'center';
  maxHeight?: number;
  disableBackgroundScroll?: boolean;
}

export default function Overlay({
  visible,
  onClose,
  children,
  anchorPosition,
  placement = 'bottom',
  maxHeight = height * 0.6,
  disableBackgroundScroll = true
}: OverlayProps) {
  const insets = useSafeAreaInsets();

  const handleBackdropPress = () => {
    onClose();
  };

  const getContentPosition = () => {
    if (!anchorPosition) {
      // Center placement
      return {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      };
    }

    const { x, y, width: anchorWidth, height: anchorHeight } = anchorPosition;
    
    if (placement === 'bottom') {
      const top = y + anchorHeight + 8;
      const left = Math.max(16, Math.min(x, width - 320 - 16)); // Keep within screen bounds
      
      return {
        position: 'absolute' as const,
        top,
        left,
        width: Math.min(320, width - 32),
      };
    }
    
    if (placement === 'top') {
      const bottom = height - y + 8;
      const left = Math.max(16, Math.min(x, width - 320 - 16));
      
      return {
        position: 'absolute' as const,
        bottom,
        left,
        width: Math.min(320, width - 32),
      };
    }

    // Center fallback
    return {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={handleBackdropPress}
          activeOpacity={1}
        />

        {/* Content Container */}
        <View style={[styles.contentContainer, getContentPosition()]}>
          <View style={[
            styles.content,
            { maxHeight: maxHeight - insets.top - insets.bottom }
          ]}>
            <TouchableOpacity activeOpacity={1}>
              {children}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },
});