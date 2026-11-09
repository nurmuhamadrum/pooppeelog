import * as LocalAuthentication from 'expo-local-authentication';

export async function checkBiometricsAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometrics(
  promptMessage = 'Buka Kunci Poop Pee Log'
): Promise<boolean> {
  try {
    const isAvailable = await checkBiometricsAvailable();
    if (!isAvailable) {
      // Jika perangkat tidak memiliki biometrik aktif, izinkan masuk (atau fallback)
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Gunakan Passcode HP',
      cancelLabel: 'Batal',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
}

