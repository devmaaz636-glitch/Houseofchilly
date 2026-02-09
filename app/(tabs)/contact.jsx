import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Contact() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL('tel:+923318555546');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@houseofchill.pk');
  };

  const handleAddress = () => {
    const address = 'Main Service Rd F, F-10 Markaz, Islamabad';
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Contact</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Address Card */}
        <TouchableOpacity style={styles.card} onPress={handleAddress} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="location-on" size={26} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Address</Text>
          <Text style={styles.cardText}>Main Service Rd F, F-10 Markaz, Islamabad</Text>
        </TouchableOpacity>

        {/* Phone Card */}
        <TouchableOpacity style={styles.card} onPress={handleCall} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Feather name="phone-call" size={22} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Phone</Text>
          <Text style={styles.cardText}>+923318555546</Text>
        </TouchableOpacity>

        {/* Email Card */}
        <TouchableOpacity style={styles.card} onPress={handleEmail} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="email" size={24} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>Email</Text>
          <Text style={styles.cardText}>info@houseofchill.pk</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    marginBottom: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    
    // Android Shadow
    elevation: 3,
  },
  iconCircle: {
    backgroundColor: '#CF2526',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    
    // iOS Shadow
    shadowColor: '#CF2526',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    
    // Android Shadow
    elevation: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: 6,
    color: '#000',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});