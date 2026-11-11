import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
  Easing,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from './MascotIcons';
import { BadgeDefinition } from '../services/badgeEvaluator';
import { Award, Sparkles, Share2, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface BadgeUnlockedModalProps {
  visible: boolean;
  badge: BadgeDefinition | null;
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  visible,
  badge,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && badge) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 75,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [visible, badge]);

  if (!badge) return null;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      await Share.share({
        title: `Lencana Baru Terbuka: ${badge.title}`,
        message: `🎉 Saya baru saja membuka lencana "${badge.title}" di Poop Pee Log! (${badge.description}) #PoopPeeLog #TrackLogLega`,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Close Icon Top Right */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
            <X size={18} color={Colors.peachTint} />
          </TouchableOpacity>

          {/* Floating Pill Ribbon */}
          <View style={styles.ribbonPill}>
            <Sparkles size={14} color={Colors.peeAmber} />
            <Text style={styles.ribbonText}>PENCAPAIAN BARU TERBUKA!</Text>
          </View>

          {/* Mascot Center Glow */}
          <View
            style={[
              styles.avatarRing,
              {
                borderColor: badge.accentColor,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              },
            ]}
          >
            {badge.mascot === 'drip' && <LilDripIcon size={64} />}
            {badge.mascot === 'plop' && <MrPlopIcon size={64} />}
            {badge.mascot === 'flush' && <SirFlushIcon size={64} />}
          </View>

          {/* Category & Badge Title */}
          <Text style={styles.categoryText}>{badge.category.toUpperCase()}</Text>
          <Text style={[styles.title, { color: badge.accentColor }]}>{badge.title}</Text>
          <Text style={styles.description}>{badge.description}</Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              activeOpacity={0.85}
            >
              <Share2 size={16} color={Colors.creamBg} />
              <Text style={styles.shareButtonText}>Bagikan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.claimButton, { backgroundColor: badge.accentColor }]}
              onPress={handleClose}
              activeOpacity={0.85}
            >
              <Award size={16} color="#000" />
              <Text style={styles.claimButtonText}>Lega Banget!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.darkBg,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(245, 183, 0, 0.45)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 14,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    borderRadius: 14,
    backgroundColor: Colors.darkSurface,
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 183, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 183, 0, 0.35)',
    marginBottom: 18,
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.peeAmber,
    letterSpacing: 0.8,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.6,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 13,
    color: Colors.peachTint,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkSurface,
    borderRadius: 14,
    paddingVertical: 13,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  shareButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  claimButton: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 6,
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
  },
});
