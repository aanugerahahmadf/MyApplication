import React, { useState, useEffect, createContext, useContext } from 'react';
import { Animated, Text, StyleSheet, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');
  const opacity = useState(new Animated.Value(0))[0];

  const showToast = (msg: string, t: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setVisible(false));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[
          styles.toastContainer,
          {
            opacity,
            backgroundColor: type === 'success' ? colors.success : (type === 'error' ? colors.danger : colors.info)
          }
        ]}>
          <View style={styles.content}>
            {type === 'success' && <CheckCircle size={18} color="#fff" />}
            {type === 'error' && <AlertCircle size={18} color="#fff" />}
            {type === 'info' && <Info size={18} color="#fff" />}
            <Text style={styles.toastText}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
