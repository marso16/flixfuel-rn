import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';

const PaymentScreen = ({ route, navigation }) => {
  const { orderId, totalAmount } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethods] = useState([
    { id: 'stripe', name: 'Credit/Debit Card', icon: 'card' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: 'cash' },
  ]);
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await ApiService.getPaymentHistory();
      setPaymentHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const processPayment = async () => {
    if (selectedMethod === 'cash_on_delivery') {
      Alert.alert(
        'Order Confirmed',
        'Your order has been placed successfully. You can pay when the order is delivered.',
        [{ text: 'OK', onPress: () => navigation.navigate('Orders') }]
      );
      return;
    }

    setLoading(true);
    try {
      // Create payment intent
      const intentResponse = await ApiService.createPaymentIntent(orderId);
      const { clientSecret, paymentIntentId } = intentResponse;

      // In a real app, you would integrate with Stripe SDK here
      // For demo purposes, we'll simulate payment confirmation
      Alert.alert(
        'Payment Processing',
        'In a real app, this would integrate with Stripe SDK for secure payment processing.',
        [
          {
            text: 'Simulate Success',
            onPress: async () => {
              try {
                await ApiService.confirmPayment(paymentIntentId, orderId);
                Alert.alert(
                  'Payment Successful',
                  'Your payment has been processed successfully!',
                  [{ text: 'OK', onPress: () => navigation.navigate('Orders') }]
                );
              } catch (error) {
                console.error('Error confirming payment:', error);
                Alert.alert('Error', 'Payment confirmation failed');
              }
            },
          },
          {
            text: 'Simulate Failure',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Payment Failed', 'Payment could not be processed. Please try again.');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedMethod(method.id)}
    >
      <View style={styles.methodContent}>
        <Ionicons
          name={method.icon}
          size={24}
          color={selectedMethod === method.id ? '#007AFF' : '#666'}
        />
        <Text
          style={[
            styles.methodName,
            selectedMethod === method.id && styles.selectedMethodName,
          ]}
        >
          {method.name}
        </Text>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedMethod === method.id && styles.selectedRadioButton,
        ]}
      >
        {selectedMethod === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.amount}>Total: ${totalAmount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {paymentMethods.map(renderPaymentMethod)}
      </View>

      {selectedMethod === 'stripe' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoText}>
              In a production app, this would show Stripe's secure card input form.
            </Text>
          </View>
        </View>
      )}

      {selectedMethod === 'paypal' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PayPal</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoText}>
              You will be redirected to PayPal to complete your payment.
            </Text>
          </View>
        </View>
      )}

      {selectedMethod === 'cash_on_delivery' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cash on Delivery</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoText}>
              Pay with cash when your order is delivered to your doorstep.
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.payButton, loading && styles.disabledButton]}
        onPress={processPayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>
            {selectedMethod === 'cash_on_delivery' ? 'Place Order' : 'Pay Now'}
          </Text>
        )}
      </TouchableOpacity>

      {paymentHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          {paymentHistory.slice(0, 3).map((payment, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyAmount}>${payment.amount}</Text>
              <Text style={styles.historyDate}>
                {new Date(payment.createdAt).toLocaleDateString()}
              </Text>
              <Text style={[
                styles.historyStatus,
                { color: payment.status === 'succeeded' ? '#34C759' : '#FF3B30' }
              ]}>
                {payment.status}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  selectedMethodName: {
    color: '#007AFF',
    fontWeight: '600',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  cardInfo: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  cardInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default PaymentScreen;

