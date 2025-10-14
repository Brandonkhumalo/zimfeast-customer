// MobilePaymentFields.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface MobilePaymentFieldsProps {
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  mobileProvider: string;
  setMobileProvider: (val: string) => void;
}

export const MobilePaymentFields = ({
  phoneNumber,
  setPhoneNumber,
  mobileProvider,
  setMobileProvider,
}: MobilePaymentFieldsProps) => {
  return (
    <View>
      <View style={styles.field}>
        <Text style={styles.label}>Mobile Provider</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={mobileProvider}
            onValueChange={setMobileProvider}
            style={styles.picker}
          >
            <Picker.Item label="EcoCash" value="ecocash" />
            <Picker.Item label="OneMoney" value="onemoney" />
            <Picker.Item label="TeleCash" value="telecash" />
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+263 77 123 4567 or 0771234567"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
