import { useState, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, GRADIENTS, SHADOWS } from '../../constants';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../store';
import { Image } from 'react-native';

const { height } = Dimensions.get('window');

// Premium Login screen with gradients and animations
export const LoginScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  
  const { login, signup, isLoading } = useAuthStore();
  const logoScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

  // Logo pulse animation
  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(logoScale, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('fillRequiredFields'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('invalidEmail'));
      return;
    }
    setError('');
    pulseAnimation();
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        let errorMsg = result.error || t('unexpectedError');
        if (errorMsg.includes('not found') || errorMsg.includes('Invalid')) {
          errorMsg = t('emailOrPasswordWrong');
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMsg = t('connectionError');
        } else if (errorMsg.includes('server') || errorMsg.includes('500')) {
          errorMsg = t('serverError');
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError(t('unexpectedError'));
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError(t('fillRequiredFields'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('invalidEmail'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }
    setError('');
    pulseAnimation();
    
    try {
      const userData = {
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
      };
      
      // Phone number is for display only, not sent to API
      // if (phoneNumber && phoneNumber.trim()) {
      //   userData.phoneNumber = '+213' + phoneNumber.trim();
      // }
      
      const result = await signup(userData);
      if (!result.success) {
        let errorMsg = result.error || t('unexpectedError');
        if (errorMsg.includes('exists') || errorMsg.includes('duplicate')) {
          errorMsg = t('emailExists');
        } else if (errorMsg.includes('server') || errorMsg.includes('500')) {
          errorMsg = t('serverError');
        }
        setError(errorMsg);
      }
    } catch (err) {
      setError(t('unexpectedError'));
    }
  };

  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(formOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setIsSignup(!isSignup);
    setError('');
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={isDarkMode ? GRADIENTS.dark : ['#E8F5E9', '#C8E6C9', '#A5D6A7']}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative circles */}
      <View style={[styles.circle1, { backgroundColor: colors.primary + '20' }]} />
      <View style={[styles.circle2, { backgroundColor: colors.secondary + '15' }]} />
      <View style={[styles.circle3, { backgroundColor: colors.accent + '10' }]} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Logo Section */}
          <View style={styles.header}>
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <Image
                source={require('../../../assets/logo.webp')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={[styles.title, { color: colors.text }]}>Stadium Booking</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isSignup ? t('createAccount') : t('loginToAccount')}
            </Text>
          </View>

          {/* Form Card */}
          <Animated.View style={[styles.formCard, { backgroundColor: colors.surface, opacity: formOpacity }, SHADOWS.large]}>
            {isSignup && (
              <>
                <Input
                  label={t('name')}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('enterName')}
                  autoCapitalize="words"
                  icon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
                />
                <View style={styles.phoneInputContainer}>
                  <View style={[styles.phonePrefix, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
                    <Text style={[styles.phonePrefixText, { color: colors.text }]}>+213</Text>
                  </View>
                  <View style={styles.phoneInputWrapper}>
                    <Input
                      label={t('phoneOptional')}
                      value={phoneNumber}
                      onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                      placeholder="555123456"
                      keyboardType="phone-pad"
                      maxLength={9}
                    />
                  </View>
                </View>
              </>
            )}
            
            <Input
              label={t('email')}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label={t('password')}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
              error={error}
            />
            
            <Button
              title={isSignup ? t('signup') : t('login')}
              onPress={isSignup ? handleSignup : handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
            
            <TouchableOpacity onPress={toggleMode} style={styles.switchBtn}>
              <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                {isSignup ? t('haveAccount') : t('noAccount')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: 100,
    left: -50,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: height * 0.4,
    right: -30,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logoContainer: {
    marginBottom: SIZES.md,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONTS.bold,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  formCard: {
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
  },
  submitBtn: {
    marginTop: SIZES.sm,
  },
  switchBtn: {
    alignItems: 'center',
    marginTop: SIZES.lg,
    paddingVertical: SIZES.sm,
  },
  switchText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.medium,
  },
  footer: {
    marginTop: SIZES.xl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SIZES.sm,
  },
  phonePrefix: {
    height: 50,
    paddingHorizontal: SIZES.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radiusSm,
    marginRight: SIZES.xs,
    marginBottom: 0,
  },
  phonePrefixText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.semiBold,
  },
  phoneInputWrapper: {
    flex: 1,
  },
});
