import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import validationSchema from "../../utils/guestFormSchema";

const FindSlots = ({
  date,
  selectedNumber,
  slots = [],
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate time slots if none are provided
  useEffect(() => {
    if (slots && slots.length > 0) {
      setAvailableSlots(slots);
    } else {
      // Generate default time slots
      const generatedSlots = generateTimeSlots();
      setAvailableSlots(generatedSlots);
    }
  }, [slots]);

  const generateTimeSlots = () => {
    const timeSlots = [];
    const startHour = 11; // 11 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Add :00 slot
      const time00 = formatTime(hour, 0);
      timeSlots.push(time00);
      
      // Add :30 slot (except for last hour)
      if (hour < endHour) {
        const time30 = formatTime(hour, 30);
        timeSlots.push(time30);
      }
    }
    
    return timeSlots;
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute === 0 ? '00' : minute;
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const handlePress = () => {
    if (!date) {
      Alert.alert("Date Required", "Please select a date first");
      return;
    }
    if (!selectedNumber || selectedNumber <= 0) {
      Alert.alert("Guests Required", "Please select number of guests");
      return;
    }
    setSlotsVisible((prev) => !prev);
  };

  const handleSlotPress = (slot) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");

    // Validation checks
    if (!selectedSlot) {
      Alert.alert("Selection Required", "Please select a time slot first");
      return;
    }

    if (!date) {
      Alert.alert("Selection Required", "Please select a date first");
      return;
    }

    if (!selectedNumber || selectedNumber <= 0) {
      Alert.alert("Selection Required", "Please select number of guests");
      return;
    }

    if (!restaurant) {
      Alert.alert("Error", "Restaurant information is missing");
      return;
    }

    // If user is logged in
    if (userEmail) {
      try {
        const bookingData = {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: parseInt(selectedNumber),
          restaurant: typeof restaurant === 'string' ? restaurant : restaurant?.name || 'Unknown Restaurant',
          createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, "bookings"), bookingData);
        
        Alert.alert(
          "Success! 🎉", 
          `Your table for ${selectedNumber} guests at ${selectedSlot} has been confirmed!`,
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedSlot(null);
                setSlotsVisible(false);
              }
            }
          ]
        );
      } catch (error) {
        console.error("Booking error:", error);
        Alert.alert("Error", "Failed to create booking. Please try again.");
      }
    } 
    // If guest user
    else if (guestStatus === "true") {
      setModalVisible(true);
    } 
    // Not logged in and not guest
    else {
      Alert.alert(
        "Sign In Required",
        "Please sign in or continue as guest to make a booking",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => {
            // You can add navigation to sign in here if needed
          }}
        ]
      );
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const bookingData = {
        email: values.phoneNumber + "@guest.com", // Create a pseudo-email for guests
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: parseInt(selectedNumber),
        restaurant: typeof restaurant === 'string' ? restaurant : restaurant?.name || 'Unknown Restaurant',
        isGuest: true,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "bookings"), bookingData);
      
      setModalVisible(false);
      
      Alert.alert(
        "Success! 🎉",
        `Your table for ${selectedNumber} guests at ${selectedSlot} has been confirmed!`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedSlot(null);
              setSlotsVisible(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error("Guest booking error:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    }
  };

  return (
    <View className="flex-1">
      {/* BUTTONS */}
      <View className={`flex ${selectedSlot ? "flex-row" : ""}`}>
        <View className={`${selectedSlot ? "flex-1" : ""}`}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg text-white">
              {slotsVisible ? "Hide Slots" : "Find Slots"}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSlot && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-center text-white text-lg font-semibold bg-green-600 p-2 my-3 mx-2 rounded-lg">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SLOTS */}
      {slotsVisible && (
        <View className="mx-2 p-4 bg-[#474747] rounded-lg">
          <View className="mb-3">
            <Text className="text-white text-center text-base font-semibold">
              Available Time Slots
            </Text>
            <Text className="text-white/60 text-center text-sm mt-1">
              Select your preferred time
            </Text>
          </View>
          
          {availableSlots.length > 0 ? (
            <View className="flex-row flex-wrap justify-center">
              {availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className={`m-2 px-6 py-4 rounded-lg items-center justify-center min-w-[100px] ${
                    selectedSlot === slot 
                      ? "bg-[#f49b33]" 
                      : "bg-[#5a5a5a]"
                  }`}
                  onPress={() => handleSlotPress(slot)}
                >
                  <Text className={`font-bold text-base ${
                    selectedSlot === slot ? "text-white" : "text-white/80"
                  }`}>
                    {slot}
                  </Text>
                  {selectedSlot === slot && (
                    <View className="mt-1">
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="py-8">
              <Ionicons name="time-outline" size={48} color="#f49b33" style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text className="text-white text-center text-base">
                No slots available for the selected date
              </Text>
              <Text className="text-white/60 text-center text-sm mt-2">
                Please try a different date
              </Text>
            </View>
          )}
        </View>
      )}

      {/* GUEST BOOKING MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-[#00000080] justify-end">
          <View className="bg-[#474747] mx-4 rounded-t-3xl p-6 pb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Complete Booking</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#f49b33" />
              </TouchableOpacity>
            </View>

            <View className="bg-[#5a5a5a] p-4 rounded-lg mb-4">
              <Text className="text-white/70 text-sm mb-1">Booking Details:</Text>
              <Text className="text-white font-semibold">
                {selectedNumber} guests • {selectedSlot}
              </Text>
            </View>

            <Formik
              initialValues={{ fullName: "", phoneNumber: "" }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <View className="mb-4">
                    <Text className="text-[#f49b33] mb-2 font-semibold">Full Name *</Text>
                    <TextInput
                      className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                      placeholder="Enter your name"
                      placeholderTextColor="#888"
                      onChangeText={handleChange("fullName")}
                      onBlur={handleBlur("fullName")}
                      value={values.fullName}
                    />
                    {touched.fullName && errors.fullName && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.fullName}
                      </Text>
                    )}
                  </View>

                  <View className="mb-6">
                    <Text className="text-[#f49b33] mb-2 font-semibold">Phone Number *</Text>
                    <TextInput
                      className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                      placeholder="Enter your phone number"
                      placeholderTextColor="#888"
                      keyboardType="phone-pad"
                      onChangeText={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                      value={values.phoneNumber}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.phoneNumber}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="p-4 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-white text-lg font-bold text-center">
                      Confirm Booking
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;