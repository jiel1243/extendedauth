import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { initDatabase, registerUser, loginUser } from './utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // what is useEffect?
    // this is a hook that runs when the component is mounted
    useEffect(() => {
        initDatabase()
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem('isLoggedIn')
        if (status === 'true') {
            setIsLoggedIn(true)
        }
    }

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        try {
            if (isLogin) {
                const success = await loginUser(username, password)
                if (success) {
                    await AsyncStorage.setItem('isLoggedIn', 'true')
                    setIsLoggedIn(true)
                    Alert.alert('Success', 'Logged in successfully')
                } else {
                    Alert.alert('Error', 'Invalid credentials')
                }
            } else {
                await registerUser(username, password)
                Alert.alert('Success', 'Registration successful')
                setIsLogin(true)
            }
        } catch (error) {
            Alert.alert('Error', error.message)
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn')
        setIsLoggedIn(false)
        setUsername('')
        setPassword('')
    }

    if (isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loggedInContainer}>
                    <Image
                        source={require('./assets/avatar.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeTitle}>
                        Welcome, {username}!
                    </Text>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    <Image
                        source={require('./assets/icon.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isLogin
                            ? 'Please sign in to continue'
                            : 'Please fill in the form to continue'}
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin
                                ? 'New user? Create an account'
                                : 'Already have an account? Sign in'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});