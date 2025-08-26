import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (formData) => {
    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <AuthForm
          type="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
          onToggleType={navigateToLogin}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default RegisterScreen;
