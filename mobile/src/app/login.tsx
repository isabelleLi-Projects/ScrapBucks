import { useState, useEffect, use } from 'react';
import { Image, Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions} from 'react-native';
import {useRouter} from "expo-router";


export default function LoginScreen() {
  const {width, height} = useWindowDimensions(); // automatically measures the app window 
  const scale = Math.min(width/390, height/844, 1); //compares everything to a base size phone 390 x 844, 1 is to stop large phones from making things bigger
  const s = (value: number) => Math.round(value * scale);
  const styles = createStyles(s);

  const isSmallScreen = height < 700;
  const horizontalPadding = Math.min(width * 0.08, 45); //use 8% of the screen width
  const topPadding = Math.min(height * 0.4, 100);
  const bottomPadding = Math.min(height * 0.4, 80);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<"customer" | "collector"> ("customer");

  const API_URL = "http://10.0.0.11:3000";
  const router = useRouter();

  const handleLogin = async(): Promise<void> => {
    try {
      const url = `${API_URL}/auth/login`;

      const response = await fetch(url, {
        method: "POST", // inserting data
        headers: {
          "Content-Type": "application/json" // data is coming in as json
        },
        body: JSON.stringify({email, password}),
      });
      const userInformationData = await response.json();
      console.log(userInformationData.message);
      console.log(userInformationData.user)

      if (!response.ok) {
        alert(userInformationData.message || "Login failed"); // shows user pop up message
        return;
      }
      if (selectedRole == "customer") {
        router.replace("/customer_view")
      }else {
        router.replace("/collector_view")
      }
      // alert((`Welcome, ${userInformationData.user.displayName}`));
    }catch (error) {
      console.error("Error loggin in: ", message)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.scrollContent}>
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topCenterCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
        <View style={[styles.circle, styles.bottomLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />

        <View style={[styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: topPadding,
              paddingBottom: bottomPadding
            },
          ]}
        >
          <View style={styles.logo}>
            <Image 
              source={require('../../assets/images/scrapbucks-logo.png')} 
              style={styles.logo} 
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                fontSize: s(38),
                lineHeight: s(44),
              },
            ]}
          >
            Welcome back
          </Text>
          <Text style={styles.subtitle}>Log In to continue</Text>

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
                style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
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
            
            <Text style={styles.roleLabel}> Choose Role: </Text>
            <View style={styles.roleSelector}>
              <Pressable 
                style={[styles.roleOption, selectedRole === "customer" && styles.selectedRole]} 
                onPress={() => setSelectedRole('customer')}
              >
                <Text style={[styles.roleText, selectedRole === "customer" && styles.selectedRoleText]}>
                  Customer
                </Text>
              </Pressable>
              <Pressable 
                style={[styles.roleOption, selectedRole === "collector" && styles.selectedRole]} 
                onPress={() => setSelectedRole('collector')}
              >
                <Text style={[styles.roleText, selectedRole === "collector" && styles.selectedRoleText]}>
                  Collector
                </Text>
              </Pressable>
             
            </View>


            <Pressable style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInText}>Log In</Text>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (s: (value: number) => number) =>
  StyleSheet.create({
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
    flex: 1, // dynamically fits the screen
    width: '100%',
    maxWidth: s(590),
    alignSelf: 'center',
    paddingTop: s(108),
    paddingBottom: s(45),
    justifyContent: 'space-between' // distribute items evenly
  },
  circle: {
    position: 'absolute',
    borderRadius: s(999),
  },
  topLeftCircle: {
    width: s(300),
    height: s(300),
    top: s(-85),
    left: s(-115),
    backgroundColor: '#f9f6c7',
  },
  topCenterCircle: {
    width: s(250),
    height: s(250),
    top: s(-150),
    left: s(135),
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
    width: s(270),
    height: s(270),
    bottom: s(-165),
    left: s(-135),
    backgroundColor: '#f9f6c7',
  },
  bottomRightCircle: {
    width: s(410),
    height: s(410),
    right: s(-130),
    bottom: s(-170),
    backgroundColor: '#d9f4d8',
  },
  logo: {
    width: s(80),
    height: s(80),
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: s(10),
    borderRadius: s(22),
  },

  logoText: {
    color: '#ffffff',
    fontSize: s(31),
    fontWeight: '700',
    lineHeight: s(35),
  },
  title: {
    color: '#100b12',
    fontSize: s(54),
    fontWeight: '500',
    letterSpacing: -2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: s(8),
    marginBottom: s(28),
    color: '#68758b',
    fontSize: s(16),
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    marginBottom: s(11),
    color: '#30256b',
    fontSize: s(18),
    fontWeight: '500',
  },
  inputContainer: {
    height: s(42),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: s(1),
    borderColor: '#d9dfe5',
    borderRadius: s(14),
    backgroundColor: '#fbfbfc',
  },
  inputIcon: {
    width: s(25),
    marginLeft: s(15),
    color: '#9da7b7',
    fontSize: s(22),
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#343c4c',
    fontSize: s(14),
  },
  passwordHeader: {
    marginTop: s(31),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    marginBottom: s(11),
    color: '#5a5282',
    fontSize: s(15),
    fontWeight: '700',
  },
  eyeButton: {
    paddingHorizontal: s(18),
  },
  eyeText: {
    color: '#8d98a9',
    fontSize: s(20),
  },
  signInButton: {
    height: s(47),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: s(25),
    borderRadius: s(14),
    backgroundColor: '#a4e68e',
  },
  signInText: {
    color: '#2f236b',
    fontSize: s(20),
    fontWeight: '600',
  },
  message: {
    marginTop: s(12),
    color: '#59687b',
    fontSize: s(14),
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(22),
    marginVertical: s(25),
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: '#d4dfe2',
  },
  orText: {
    color: '#657187',
    fontSize: s(12),
  },
  googleButton: {
    height: s(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
    borderWidth: s(1.5),
    borderColor: '#d9dfe5',
    borderRadius: s(14),
    backgroundColor: '#ffffff',
  },
  googleIcon: {
    width: s(27),
    height: s(27),
    borderWidth: s(3),
    borderColor: '#3c4659',
    borderRadius: s(14),
    color: '#3c4659',
    fontSize: s(22),
    lineHeight: s(20),
    textAlign: 'center',
  },
  googleText: {
    color: '#3c4659',
    fontSize: s(23),
    fontWeight: '600',
  },
  appleButton: {
    height: s(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
    marginTop: s(12),
    borderRadius: s(14),
    backgroundColor: '#2c2d35',
  },
  appleIcon: {
    color: '#ffffff',
    fontSize: s(15),
  },
  appleText: {
    color: '#ffffff',
    fontSize: s(23),
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: s(30),
  },
  signupText: {
    color: '#30256b',
    fontSize: s(20),
  },
  signupLink: {
    color: '#30256b',
    fontSize: s(20),
    fontWeight: '700',
  },

  roleLabel: {
    marginTop: s(18),
    marginBottom: s(8),
    color: '#30256b',
    fontSize: s(16),
    fontWeight: '500',
  },
  
  roleSelector: {
    width: '100%',
    height: s(47),
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(4),
    borderRadius: s(24),
    backgroundColor: '#d9dfe5',
  },
  
  roleOption: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s(21),
  },
  
  selectedRole: {
    backgroundColor: '#30256b',
  },
  
  roleText: {
    color: '#68758b',
    fontSize: s(16),
    fontWeight: '600',
  },
  
  selectedRoleText: {
    color: '#ffffff',
  },
});
