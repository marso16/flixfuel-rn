import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, SPACING, VALIDATION } from "../utils/constants";

const AuthForm = ({
  type = "login",
  onSubmit,
  isLoading = false,
  onToggleType,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }

    // Registration-specific validations
    if (type === "register") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      } else if (formData.firstName.length < VALIDATION.NAME_MIN_LENGTH) {
        newErrors.firstName = `First name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
      }

      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      } else if (formData.lastName.length < VALIDATION.NAME_MIN_LENGTH) {
        newErrors.lastName = `Last name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (formData.phone && !VALIDATION.PHONE_REGEX.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderInput = (
    field,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default"
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={field === "email" ? "none" : "words"}
        autoCorrect={false}
        placeholderTextColor={COLORS.GRAY[500]}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === "login" ? "Welcome Back" : "Create Account"}
      </Text>
      <Text style={styles.subtitle}>
        {type === "login"
          ? "Sign in to your account"
          : "Sign up to get started"}
      </Text>

      <View style={styles.form}>
        {type === "register" && (
          <>
            {renderInput("firstName", "First Name")}
            {renderInput("lastName", "Last Name")}
          </>
        )}

        {renderInput("email", "Email Address", false, "email-address")}

        {type === "register" &&
          renderInput("phone", "Phone Number (Optional)", false, "phone-pad")}

        {renderInput("password", "Password", true)}

        {type === "register" &&
          renderInput("confirmPassword", "Confirm Password", true)}

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>
              {type === "login" ? "Sign In" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={onToggleType}>
          <Text style={styles.toggleButtonText}>
            {type === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE,
    justifyContent: "center",
    backgroundColor: COLORS.WHITE,
  },
  title: {
    fontSize: FONTS.SIZES.LARGE_HEADING,
    fontWeight: FONTS.WEIGHTS.BOLD,
    color: COLORS.DARK,
    textAlign: "center",
    marginBottom: SPACING.SMALL,
  },
  subtitle: {
    fontSize: FONTS.SIZES.LARGE,
    color: COLORS.GRAY[600],
    textAlign: "center",
    marginBottom: SPACING.EXTRA_LARGE,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: SPACING.MEDIUM,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY[300],
    borderRadius: 8,
    padding: SPACING.MEDIUM,
    fontSize: FONTS.SIZES.LARGE,
    backgroundColor: COLORS.WHITE,
  },
  inputError: {
    borderColor: COLORS.DANGER,
  },
  errorText: {
    color: COLORS.DANGER,
    fontSize: FONTS.SIZES.SMALL,
    marginTop: SPACING.EXTRA_SMALL,
    marginLeft: SPACING.SMALL,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MEDIUM,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.GRAY[400],
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: FONTS.SIZES.LARGE,
    fontWeight: FONTS.WEIGHTS.SEMI_BOLD,
  },
  toggleButton: {
    alignItems: "center",
    padding: SPACING.SMALL,
  },
  toggleButtonText: {
    color: COLORS.PRIMARY,
    fontSize: FONTS.SIZES.MEDIUM,
    fontWeight: FONTS.WEIGHTS.MEDIUM,
  },
});

export default AuthForm;
