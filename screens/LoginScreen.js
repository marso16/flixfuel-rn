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

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState("login");

  const handleAuth = async (formData) => {
    setIsLoading(true);

    try {
      let result;
      if (authType === "login") {
        result = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        result = await login({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      }

      if (result.success) {
        Alert.alert(
          "Success",
          authType === "login"
            ? "Login successful!"
            : "Account created successfully!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Authentication failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthType = () => {
    setAuthType(authType === "login" ? "register" : "login");
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
          type={authType}
          onSubmit={handleAuth}
          isLoading={isLoading}
          onToggleType={toggleAuthType}
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

export default LoginScreen;
