import { useState} from 'react';
import { Image, Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {useRouter} from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



export default function SignUpScreen() {
    const { width, height } = useWindowDimensions();
    const isSmallScreen = height < 700;

    const scale = Math.min(width / 390, height / 844, 1);
    const s = (value: number) => Math.round(value * scale);
    const styles = createStyles(s);
  
    const horizontalPadding = Math.min(width * 0.08, 45);
    const topPadding = Math.min(height * 0.2, 108);
  
    const router = useRouter();
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameMessage, setNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const[message, setMessage] = useState('');

    const API_URL = "http://10.0.0.11:3000"

    const handleSignup = async () => {
        setPasswordMessage('');
        setNameMessage('');
        setEmailMessage('');

        let hasErrorMessage = false;

      if (!name.trim()) {
        setNameMessage('Name is required.');
        hasErrorMessage = true;
      }
  
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
  
      try {

        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setMessage(data.message || 'Could not create account.');
          return;
        }
  
        router.replace('/login');
      } catch (error) {
        setMessage('Unable to connect to the server.');
        console.error('Signup error:', error);
      }
    };
  
    return (
      <View style={styles.screen}>
        {/* Background circles */}
        <View style={styles.background} pointerEvents="none">
          <View style={[styles.circle, styles.topLeftCircle]} />
          <View style={[styles.circle, styles.topCenterCircle]} />
          <View style={[styles.circle, styles.topRightCircle]} />
          <View style={[styles.circle, styles.bottomLeftCircle]} />
          <View style={[styles.circle, styles.bottomRightCircle]} />
        </View>
  
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView>
          {/* <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            > */}
              <View
                style={[
                  styles.content,
                  {
                    paddingHorizontal: horizontalPadding,
                    paddingTop: topPadding,
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
                     Create Account
                </Text>
                <Text style={styles.subtitle}>
                  Fill your information below
                </Text>
  
                <View style={styles.form}>
                  <Text style={styles.label}>Name</Text>
                  <View style={[
                    styles.inputContainer,
                    nameMessage ? styles.inputContainerError : styles.inputBottomSpace,
                    ]}>
                    <TextInput
                      style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
                      placeholderTextColor="#9da7b7"
                      placeholder='FirstName LastName'
                      autoCapitalize="words"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        setNameMessage('');
                      }}
                    />
                  </View>
                  {nameMessage ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{nameMessage}</Text>
                    </View>
                    ) : null}
  

                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputContainer, 
                    emailMessage ? styles.inputContainerError : styles.inputBottomSpace,
                  ]}>
                    <TextInput
                      style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
                      placeholderTextColor="#9da7b7"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setEmailMessage('');
                      }}
                    />
                  </View>
                  {emailMessage ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{emailMessage}</Text>
                    </View>
                    ) : null}

  
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.inputContainer, 
                    passwordMessage ? styles.inputContainerError : styles.inputBottomSpace,]}>
                    <TextInput
                      style={[styles.input,{paddingHorizontal: isSmallScreen ? 9 : 13,},]}
                      placeholder="At least 8 characters"
                      placeholderTextColor="#9da7b7"
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setPasswordMessage('');
                      }}
                    />
  
                    <Pressable
                      style={styles.eyeButton}
                      onPress={() =>
                        setShowPassword((current) => !current)
                      }
                    >
                      <Text style={styles.eyeText}>
                        {showPassword ? 'Close' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                  {passwordMessage ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{passwordMessage}</Text>
                    </View>
                    ) : null}
                  
  
                  <Pressable
                    style={styles.signUpButton}
                    onPress={handleSignup}
                  >
                    <Text style={styles.signUpText}>Sign Up</Text>
                  </Pressable>
                  {message ? (
                    <View style={styles.errorRow}>
                        <Text style={styles.errorIcon}>!</Text>
                        <Text style={styles.errorText}>{message}</Text>
                    </View>
                    ) : null}
                </View>
                  
  
  
                <View style={styles.signupRow}>
                  <Text style={styles.signupText}>
                    Already have an account?{' '}
                  </Text>
  
                  <Pressable onPress={() => router.replace('/login')}>
                    <Text style={styles.signupLink}>Log In</Text>
                  </Pressable>
                </View>
              </View>
              </KeyboardAwareScrollView>
            {/* </ScrollView>
          </KeyboardAvoidingView> */}
        </TouchableWithoutFeedback>
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
      paddingBottom: s(35),
    },  
    content: {
        zIndex: 1,
        width: '100%',
        maxWidth: s(590),
        alignSelf: 'center',
        paddingTop: s(45),
        paddingBottom: s(35),
        justifyContent: 'flex-start',
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
      justifyContent: 'flex-start',
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
    signUpButton: {
      height: s(47),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: s(25),
      borderRadius: s(14),
      backgroundColor: '#a4e68e',
    },
    signUpText: {
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
    inputContainerError: {
        borderColor: '#c21f16',
        borderWidth: s(2),
        backgroundColor: '#fff3f1',
      },
      inputBottomSpace: {
        marginBottom: s(18),
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
    keyboardContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    termsText: {
        marginTop: s(14),
        color: '#30256b',
        fontSize: s(14),
      },
      
      termsLink: {
        color: '#55b6c8',
        fontWeight: '700',
      },
  });