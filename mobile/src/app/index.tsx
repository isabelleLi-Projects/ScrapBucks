import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  function handleSignIn() {
    if (!email || !password) {
      setMessage('Please enter your email and password.');
      return;
    }

    setMessage('Signed in successfully.');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topCenterCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
        <View style={[styles.circle, styles.bottomLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />

        <View style={styles.content}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>ϟ</Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9da7b7"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <Pressable onPress={() => setMessage('Password reset selected.')}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>⌑</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9da7b7"
                secureTextEntry={!showPassword}
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((current) => !current)}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.eyeText}>{showPassword ? '◉' : '◎'}</Text>
              </Pressable>
            </View>

            <Pressable style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={styles.googleButton}
            onPress={() => setMessage('Google sign in selected.')}
          >
            <Text style={styles.googleIcon}>×</Text>
            <Text style={styles.googleText}>Sign in with Google</Text>
          </Pressable>

          <Pressable
            style={styles.appleButton}
            onPress={() => setMessage('Apple sign in selected.')}
          >
            <Text style={styles.appleIcon}>●</Text>
            <Text style={styles.appleText}>Sign in with Apple</Text>
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Pressable onPress={() => setMessage('Sign up selected.')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#efffff',
  },
  scrollContent: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  content: {
    zIndex: 1,
    width: '100%',
    maxWidth: 590,
    alignSelf: 'center',
    paddingHorizontal: 42,
    paddingTop: 108,
    paddingBottom: 45,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
  topLeftCircle: {
    width: 300,
    height: 300,
    top: -85,
    left: -115,
    backgroundColor: '#f9f6c7',
  },
  topCenterCircle: {
    width: 250,
    height: 250,
    top: -150,
    left: 135,
    backgroundColor: '#d9f4d8',
  },
  topRightCircle: {
    width: 270,
    height: 270,
    top: -135,
    right: -120,
    backgroundColor: '#f9f6c7',
  },
  bottomLeftCircle: {
    width: 270,
    height: 270,
    bottom: -165,
    left: -135,
    backgroundColor: '#f9f6c7',
  },
  bottomRightCircle: {
    width: 410,
    height: 410,
    right: -130,
    bottom: -170,
    backgroundColor: '#d9f4d8',
  },
  logo: {
    width: 43,
    height: 43,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 46,
    borderRadius: 22,
    backgroundColor: '#3d83f3',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 31,
    fontWeight: '700',
    lineHeight: 35,
  },
  title: {
    color: '#100b12',
    fontSize: 54,
    fontWeight: '500',
    letterSpacing: -2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 23,
    marginBottom: 82,
    color: '#68758b',
    fontSize: 22,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    marginBottom: 11,
    color: '#30256b',
    fontSize: 21,
    fontWeight: '500',
  },
  inputContainer: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d9dfe5',
    borderRadius: 18,
    backgroundColor: '#fbfbfc',
  },
  inputIcon: {
    width: 26,
    marginLeft: 19,
    color: '#9da7b7',
    fontSize: 22,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 13,
    color: '#343c4c',
    fontSize: 20,
  },
  passwordHeader: {
    marginTop: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    marginBottom: 11,
    color: '#5a5282',
    fontSize: 18,
    fontWeight: '700',
  },
  eyeButton: {
    paddingHorizontal: 18,
  },
  eyeText: {
    color: '#8d98a9',
    fontSize: 21,
  },
  signInButton: {
    height: 79,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    borderRadius: 18,
    backgroundColor: '#a4e68e',
  },
  signInText: {
    color: '#2f236b',
    fontSize: 25,
    fontWeight: '600',
  },
  message: {
    marginTop: 12,
    color: '#59687b',
    fontSize: 14,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginVertical: 94,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#d4dfe2',
  },
  orText: {
    color: '#657187',
    fontSize: 18,
  },
  googleButton: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderWidth: 1.5,
    borderColor: '#d9dfe5',
    borderRadius: 18,
    backgroundColor: '#ffffff',
  },
  googleIcon: {
    width: 27,
    height: 27,
    borderWidth: 3,
    borderColor: '#3c4659',
    borderRadius: 14,
    color: '#3c4659',
    fontSize: 22,
    lineHeight: 20,
    textAlign: 'center',
  },
  googleText: {
    color: '#3c4659',
    fontSize: 23,
    fontWeight: '600',
  },
  appleButton: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: '#2c2d35',
  },
  appleIcon: {
    color: '#ffffff',
    fontSize: 25,
  },
  appleText: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  signupText: {
    color: '#30256b',
    fontSize: 20,
  },
  signupLink: {
    color: '#30256b',
    fontSize: 20,
    fontWeight: '700',
  },
});
