import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MrPlopIcon, LilDripIcon, SirFlushIcon } from '@/src/components/MascotIcons';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPasswordForEmail,
  signInWithGoogle,
} from '@/src/services/authService';
import { useAppStore } from '@/src/store/useAppStore';
import { useMobileI18n } from '@/src/i18n/translations';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type AuthMode = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';

export default function AuthScreen() {
  const router = useRouter();
  const { setUser, syncWithCloud } = useAppStore();
  const { lang, setLanguage, t } = useMobileI18n();
  const isEn = lang === 'en';

  const [mode, setMode] = useState<AuthMode>('SIGN_IN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    clearMessages();
    setMode(newMode);
  };

  const handleSubmit = async () => {
    clearMessages();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    if (!email.trim()) {
      setErrorMessage('Harap masukkan alamat email Anda.');
      return;
    }

    if (mode === 'FORGOT_PASSWORD') {
      setIsLoading(true);
      const res = await resetPasswordForEmail(email.trim());
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message || 'Email pemulihan password telah dikirim!');
      } else {
        setErrorMessage(res.error || 'Gagal mengirim email reset');
      }
      return;
    }

    if (!password) {
      setErrorMessage('Harap masukkan kata sandi.');
      return;
    }

    if (mode === 'SIGN_UP') {
      if (password.length < 6) {
        setErrorMessage('Kata sandi minimal harus 6 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }

      setIsLoading(true);
      const res = await signUpWithEmail(email.trim(), password);
      setIsLoading(false);

      if (res.success) {
        if (res.user) {
          setUser(res.user.id, res.user.email, false);
          syncWithCloud().catch(() => {});
        }
        setSuccessMessage(res.message || 'Pendaftaran berhasil!');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Pendaftaran gagal');
      }
      return;
    }

    // Mode: SIGN_IN
    setIsLoading(true);
    const res = await signInWithEmail(email.trim(), password);
    setIsLoading(false);

    if (res.success && res.user) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setUser(res.user.id, res.user.email, false);
      syncWithCloud().catch(() => {});
      router.replace('/(tabs)');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErrorMessage(res.error || 'Email atau kata sandi tidak sesuai');
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsLoading(true);

    const res = await signInWithGoogle();
    setIsLoading(false);

    if (res.success && res.user) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setUser(res.user.id, res.user.email, false);
      syncWithCloud().catch(() => {});
      router.replace('/(tabs)');
    } else {
      if (res.error && !res.error.includes('dibatalkan')) {
        setErrorMessage(res.error);
      }
    }
  };

  const handleContinueAsGuest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Language Switcher Top Right */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['en', 'id'] as const).map((code) => (
              <TouchableOpacity
                key={code}
                onPress={() => setLanguage(code)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: lang === code ? Colors.bothTeal : Colors.darkBorder,
                  backgroundColor: lang === code ? 'rgba(47, 184, 172, 0.18)' : Colors.darkSurface,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '900',
                    color: lang === code ? Colors.bothTeal : Colors.peachTint,
                  }}
                >
                  {code.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tombol Back jika di mode Forgot Password */}
        {mode === 'FORGOT_PASSWORD' && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleSwitchMode('SIGN_IN')}
            activeOpacity={0.8}
          >
            <ChevronLeft size={20} color={Colors.peachTint} />
            <Text style={styles.backButtonText}>{t.auth.backToLogin}</Text>
          </TouchableOpacity>
        )}

        {/* Branding Hero & Mascots */}
        <View style={styles.header}>
          <View style={styles.mascotRow}>
            <View style={[styles.mascotBubble, { backgroundColor: Colors.peeAmber }]}>
              <LilDripIcon size={32} />
            </View>
            <View style={[styles.mascotBubble, { backgroundColor: Colors.poopBrown, marginHorizontal: -10, zIndex: 2 }]}>
              <MrPlopIcon size={32} />
            </View>
            <View style={[styles.mascotBubble, { backgroundColor: Colors.bothTeal }]}>
              <SirFlushIcon size={32} />
            </View>
          </View>

          <Text style={styles.appTitle}>POOP PEE LOG</Text>
          <Text style={styles.tagline}>
            {mode === 'SIGN_IN' &&
              (isEn ? 'Sign in to backup & sync your biological logs' : 'Masuk untuk mencadangkan & sinkron riwayat biologis')}
            {mode === 'SIGN_UP' &&
              (isEn ? 'Create a private account to store logs in cloud' : 'Buat akun privat untuk menyimpan catatan di cloud')}
            {mode === 'FORGOT_PASSWORD' &&
              (isEn ? 'Reset your account password' : 'Atur ulang kata sandi akun Anda')}
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          {/* Feedback Messages */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={Colors.emergencyRed} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {successMessage && (
            <View style={styles.successBox}>
              <CheckCircle2 size={16} color={Colors.bothTeal} />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {/* Input Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={Colors.peachTint} opacity={0.6} />
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="rgba(245, 237, 227, 0.4)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Input Password (Kecuali mode Lupa Password) */}
          {mode !== 'FORGOT_PASSWORD' && (
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>{isEn ? 'PASSWORD' : 'KATA SANDI'}</Text>
                {mode === 'SIGN_IN' && (
                  <TouchableOpacity onPress={() => handleSwitchMode('FORGOT_PASSWORD')}>
                    <Text style={styles.forgotText}>{t.auth.forgotLink}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={Colors.peachTint} opacity={0.6} />
                <TextInput
                  style={styles.input}
                  placeholder={isEn ? 'Minimum 6 characters' : 'Minimal 6 karakter'}
                  placeholderTextColor="rgba(245, 237, 227, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* Input Konfirmasi Password (Khusus mode Sign Up) */}
          {mode === 'SIGN_UP' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isEn ? 'CONFIRM PASSWORD' : 'KONFIRMASI KATA SANDI'}</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={Colors.peachTint} opacity={0.6} />
                <TextInput
                  style={styles.input}
                  placeholder={isEn ? 'Repeat password' : 'Ulangi kata sandi'}
                  placeholderTextColor="rgba(245, 237, 227, 0.4)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* Tombol Utama (Submit) */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  {mode === 'SIGN_IN' && t.auth.loginBtn}
                  {mode === 'SIGN_UP' && t.auth.registerBtn}
                  {mode === 'FORGOT_PASSWORD' && t.auth.sendResetBtn}
                </Text>
                <ArrowRight size={18} color="#000" />
              </>
            )}
          </TouchableOpacity>

          {/* Pembatas ATAU */}
          {mode !== 'FORGOT_PASSWORD' && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{isEn ? 'OR' : 'ATAU'}</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Tombol Google OAuth */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.googleButtonText}>{t.auth.googleBtn}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Switch Mode: Sign In <-> Sign Up */}
        <View style={styles.footerSwitch}>
          {mode === 'SIGN_IN' && (
            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>{isEn ? "Don't have an account?" : 'Belum punya akun?'}</Text>
              <TouchableOpacity onPress={() => handleSwitchMode('SIGN_UP')}>
                <Text style={styles.switchAction}>{isEn ? 'Sign Up' : 'Daftar Akun'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'SIGN_UP' && (
            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>{isEn ? 'Already have an account?' : 'Sudah punya akun?'}</Text>
              <TouchableOpacity onPress={() => handleSwitchMode('SIGN_IN')}>
                <Text style={styles.switchAction}>{isEn ? 'Sign In' : 'Masuk Saja'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Opsi Langsung Masuk Sebagai Tamu Offline */}
          <TouchableOpacity
            style={styles.guestLink}
            onPress={handleContinueAsGuest}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLinkText}>{t.auth.guestBtn}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 16 : 40,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.peachTint,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  mascotBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.darkBg,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.creamBg,
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    backgroundColor: Colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.3)',
  },
  errorText: {
    fontSize: 11,
    color: Colors.emergencyRed,
    fontWeight: '700',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(47, 184, 172, 0.15)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(47, 184, 172, 0.4)',
  },
  successText: {
    fontSize: 11,
    color: Colors.bothTeal,
    fontWeight: '700',
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.7,
    letterSpacing: 0.6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peeAmber,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.creamBg,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.peeAmber,
    borderRadius: 14,
    height: 48,
    gap: 8,
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.darkBorder,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.peachTint,
    opacity: 0.5,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.creamBg,
    borderRadius: 14,
    height: 48,
    gap: 10,
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  footerSwitch: {
    marginTop: 22,
    alignItems: 'center',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchPrompt: {
    fontSize: 12,
    color: Colors.peachTint,
    opacity: 0.7,
  },
  switchAction: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.peeAmber,
  },
  guestLink: {
    paddingVertical: 6,
  },
  guestLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.peachTint,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
});
