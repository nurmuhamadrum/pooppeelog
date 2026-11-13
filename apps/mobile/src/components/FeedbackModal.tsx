import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  MessageSquarePlus,
  Send,
  Star,
  Lightbulb,
  Bug,
  Heart,
  MessageCircle,
  CheckCircle,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useMobileI18n } from '@/src/i18n/translations';
import { submitMobileFeedback, MobileFeedbackCategory } from '@/src/services/feedbackService';
import { SirFlushIcon, MrPlopIcon, LilDripIcon } from '@/src/components/MascotIcons';
import * as Haptics from 'expo-haptics';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string | null;
  userId?: string | null;
  onSuccess?: () => void;
}

const CATEGORIES: MobileFeedbackCategory[] = ['SUGGESTION', 'BUG', 'PRAISE', 'OTHER'];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  userEmail,
  userId,
  onSuccess,
}) => {
  const { t } = useMobileI18n();
  const copy = t.feedbackModal;

  const [category, setCategory] = useState<MobileFeedbackCategory>('SUGGESTION');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (userEmail) setEmail(userEmail);
      setIsSubmitted(false);
      setErrorText(null);
    }
  }, [visible, userEmail]);

  const handleSelectCategory = (cat: MobileFeedbackCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCategory(cat);
  };

  const handleSelectRating = (star: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRating(star);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorText(copy.errorEmptyMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorText(null);

    const res = await submitMobileFeedback({
      category,
      message,
      rating,
      email: email.trim() || undefined,
      userId: userId || undefined,
    });

    setIsSubmitting(false);

    if (res.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErrorText(res.error || copy.errorSend);
    }
  };

  const handleClose = () => {
    setMessage('');
    setIsSubmitted(false);
    setErrorText(null);
    onClose();
  };

  const getCategoryIcon = (cat: MobileFeedbackCategory, isSelected: boolean) => {
    const color = isSelected ? Colors.ink : Colors.creamBg;
    switch (cat) {
      case 'SUGGESTION':
        return <Lightbulb size={14} color={color} />;
      case 'BUG':
        return <Bug size={14} color={color} />;
      case 'PRAISE':
        return <Heart size={14} color={color} />;
      case 'OTHER':
        return <MessageCircle size={14} color={color} />;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.modalIconRing}>
              <MessageSquarePlus size={22} color={Colors.bothTeal} />
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.modalCloseIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={18} color={Colors.peachTint} />
            </TouchableOpacity>
          </View>

          {isSubmitted ? (
            /* Success State */
            <View style={styles.successContainer}>
              <View style={styles.mascotRow}>
                <View style={styles.mascotBubble}>
                  <MrPlopIcon size={38} />
                </View>
                <View style={[styles.mascotBubble, { marginTop: -8 }]}>
                  <SirFlushIcon size={44} />
                </View>
                <View style={styles.mascotBubble}>
                  <LilDripIcon size={38} />
                </View>
              </View>

              <Text style={styles.successTitle}>{copy.successTitle}</Text>
              <Text style={styles.successDesc}>{copy.successDesc}</Text>

              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <CheckCircle size={16} color={Colors.ink} />
                <Text style={styles.doneButtonText}>{copy.closeBtn}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Form State */
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text style={styles.modalHeading}>{copy.title}</Text>
              <Text style={styles.modalDescription}>{copy.subtitle}</Text>

              {/* Category selector */}
              <Text style={styles.inputLabel}>{copy.categoryLabel}</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipActive,
                      ]}
                      onPress={() => handleSelectCategory(cat)}
                      activeOpacity={0.8}
                    >
                      {getCategoryIcon(cat, isSelected)}
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {copy.categories[cat]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Rating stars */}
              <Text style={styles.inputLabel}>{copy.ratingLabel}</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= rating;
                  return (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleSelectRating(star)}
                      style={styles.starTouch}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Star
                        size={28}
                        color={isFilled ? Colors.peeAmber : 'rgba(230, 215, 195, 0.25)'}
                        fill={isFilled ? Colors.peeAmber : 'transparent'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Message Input */}
              <Text style={styles.inputLabel}>
                {copy.messageLabel} <Text style={{ color: Colors.emergencyRed }}>*</Text>
              </Text>
              <TextInput
                style={styles.textAreaInput}
                placeholder={copy.messagePlaceholder}
                placeholderTextColor="rgba(230, 215, 195, 0.4)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                  if (errorText) setErrorText(null);
                }}
              />

              {/* Email Input */}
              <Text style={styles.inputLabel}>{copy.emailLabel}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={copy.emailPlaceholder}
                placeholderTextColor="rgba(230, 215, 195, 0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Error warning */}
              {errorText && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorText}</Text>
                </View>
              )}

              {/* Submit Buttons */}
              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelButtonText}>{copy.cancelBtn}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={Colors.ink} />
                  ) : (
                    <>
                      <Send size={15} color={Colors.ink} />
                      <Text style={styles.submitButtonText}>{copy.submitBtn}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconRing: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(47, 184, 172, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.3)',
  },
  modalCloseIcon: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: -0.3,
  },
  modalDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.peachTint,
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.peachTint,
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
  },
  categoryChipActive: {
    backgroundColor: Colors.bothTeal,
    borderColor: Colors.bothTeal,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.creamBg,
  },
  categoryChipTextActive: {
    color: Colors.ink,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    paddingVertical: 4,
  },
  starTouch: {
    padding: 2,
  },
  textAreaInput: {
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: Colors.creamBg,
    minHeight: 80,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.creamBg,
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.emergencyRed,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.darkBg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.peachTint,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Colors.bothTeal,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.ink,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mascotBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.creamBg,
    marginBottom: 6,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.peachTint,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bothTeal,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  doneButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.ink,
  },
});

