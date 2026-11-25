import { useState } from 'react';
import { Image, Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {useRouter} from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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
  const [loginMessage, setLoginMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  
  const [selectedRole, setSelectedRole] = useState<"customer" | "collector"> ("customer");

  const API_URL = "http://10.0.0.11:3000";
  const router = useRouter();

  const handleLogin = async(): Promise<void> => {
    setPasswordMessage('');
    setEmailMessage('');
    setLoginMessage('');
    let hasErrorMessage = false;


    if (!email.trim()) {
      setEmailMessage('Email is required');
      hasErrorMessage = true;
    }

    if (!password.trim()) {
      setPasswordMessage('Password is required.');
      hasErrorMessage = true;
    }

    else if (password.length < 8) {
      setPasswordMessage('Password must be at least 8 characters.');
      hasErrorMessage = true;
    }
    if (hasErrorMessage) {
      return;
    }
    
    setPasswordMessage('');
    setLoginMessage('')

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
        setLoginMessage(userInformationData.message || "Login failed"); 
        return;
      }

      if (selectedRole == "customer") {
        router.replace("/customer_view")
      }else {
        router.replace("/collector_view")
      }
    }catch (error) {
      console.error("Error logging in: ", loginMessage)
    }
  }

  return (
    <View style={styles.screen}>
      {/* Fixed background decorations */}
      <View style={styles.background} pointerEvents="none">
        <View style={[styles.circle, styles.topLeftCircle]} />
        <View style={[styles.circle, styles.topCenterCircle]} />
        <View style={[styles.circle, styles.topRightCircle]} />
        <View style={[styles.circle, styles.bottomLeftCircle]} />
        <View style={[styles.circle, styles.bottomRightCircle]} />
      </View>
      
      {/* <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
      > */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView>
        {/* <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        > */}
          
            

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
                <View style={[styles.inputContainer, 
                    emailMessage ? styles.inputContainerError : styles.inputBottomSpace,
                  ]}>
                  {/* <Text style={styles.inputIcon}>✉</Text> */}
                  <TextInput
                      style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
                      placeholderTextColor="#9da7b7"
                      keyboardType="email-address"
                      textContentType='username'
                      autoComplete="username"
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={email}
                      onFocus={() => setLoginMessage('')}
                      onChangeText={(text) => {
                        setEmail(text);
                        setEmailMessage('');
                        // setLoginMessage('');
                      }}
                    />
                </View>
                {emailMessage ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{emailMessage}</Text>
                    </View>
                    ) : null}
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>
                  {/* need to implement the Forgot Password? still */}
                  <Pressable onPress={() => setPasswordMessage('Password reset selected.')}> 
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </Pressable>
                </View>
                <View style={[styles.inputContainer, 
                    passwordMessage ? styles.inputContainerError : styles.inputBottomSpace,]}>
                  {/* <Text style={styles.inputIcon}>⌑</Text> */}
                  <TextInput
                      style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
                      placeholder="At least 8 characters"
                      placeholderTextColor="#9da7b7"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      value={password}
                      onFocus={() => setLoginMessage('')}
                      onChangeText={(text) => {
                        setPassword(text);
                        setPasswordMessage('');
                        // setLoginMessage('');
                      }}
                    />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword((current) => !current)}
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Text style={styles.eyeText}>{showPassword ? 'Close' : 'Show'}</Text>
                  </Pressable>
                  
                </View>
                {passwordMessage ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{passwordMessage}</Text>
                    </View>
                    ) : null}
                  
                
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


                <Pressable style={styles.logInButton} onPress={handleLogin}>
                  <Text style={styles.signInText}>Log In</Text>
                </Pressable>
                
                {/* display the login error message */}
                {loginMessage ? <Text style={styles.loginMessage}>{loginMessage}</Text> : null}
              </View>

              
              {/* <View style={styles.dividerRow}>
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
              </Pressable> */}

              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Pressable onPress={() => router.replace('/signup')}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
          {/* </ScrollView>
      </KeyboardAvoidingView> */}
    </View>
  );
}

const createStyles = (s: (value: number) => number) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: '#efffff',
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    width: s(300),
    height: s(300),
    bottom: s(-155),
    left: s(-50),
    backgroundColor: '#f9f6c7',
  },
  bottomRightCircle: {
    width: s(410),
    height: s(410),
    right: s(-200),
    bottom: s(-200),
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
  // inputIcon: {
  //   width: s(25),
  //   marginLeft: s(15),
  //   color: '#9da7b7',
  //   fontSize: s(22),
  //   textAlign: 'center',
  // },
  inputBottomSpace: {
    marginBottom: s(14),
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#343c4c',
    fontSize: s(14),
    marginLeft: s(3),
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
    fontSize: s(15),
    fontWeight: '700'
  },
  logInButton: {
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
  loginMessage: {
    marginTop: s(13),
    color: '#f51639',
    fontSize: s(14),
    textAlign: 'center',
    fontWeight: '500',
  },
  inputErrorMessage: {
    marginTop: s(12),
    color: '#f51639',
    fontSize: s(13),
    textAlign: 'left',
    fontWeight: '500',
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
    marginBottom: s(25)
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
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  
  inputContainerError: {
      borderColor: '#c21f16',
      borderWidth: s(2),
      backgroundColor: '#fff3f1',
    },
    
    
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: s(8),
      marginBottom: s(4),
    },
    
    errorIcon: {
      width: s(20),
      height: s(20),
      marginRight: s(8),
      borderWidth: s(2),
      borderColor: '#c21f16',
      borderRadius: s(10),
      color: '#c21f16',
      fontSize: s(13),
      fontWeight: '700',
      lineHeight: s(16),
      textAlign: 'center',
    },
    
    errorText: {
      color: '#c21f16',
      fontSize: s(14),
      fontWeight: '600',
    },
});
