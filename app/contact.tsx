import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Mock contact data
const CONTACT_DATA = [
  {
    id: '1',
    name: 'Event Coordinator',
    email: 'coordinator@decaontario.ca',
    phone: '+1 (416) 555-0123',
    department: 'Event Management',
    description: 'For questions about event schedule, venue, and general inquiries.',
    avatar: 'EC',
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Technical Support',
    email: 'support@decaontario.ca',
    phone: '+1 (416) 555-0124',
    department: 'IT Support',
    description: 'For assistance with the app, website, or any technical issues.',
    avatar: 'TS',
    color: '#2196F3',
  },
  {
    id: '3',
    name: 'Competition Director',
    email: 'competitions@decaontario.ca',
    phone: '+1 (416) 555-0125',
    department: 'Competitions',
    description: 'For questions about case studies, judging, or competition rules.',
    avatar: 'CD',
    color: '#FF9800',
  },
  {
    id: '4',
    name: 'Chapter Relations',
    email: 'chapters@decaontario.ca',
    phone: '+1 (416) 555-0126',
    department: 'Chapter Support',
    description: 'For chapter advisors needing assistance or information.',
    avatar: 'CR',
    color: '#9C27B0',
  },
  {
    id: '5',
    name: 'Emergency Contact',
    email: 'emergency@decaontario.ca',
    phone: '+1 (416) 555-0127',
    department: 'Security & Safety',
    description: 'For urgent matters requiring immediate attention.',
    avatar: 'EM',
    color: '#F44336',
    emergency: true,
  },
];

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showMessageSent, setShowMessageSent] = useState(false);
  
  const handleInputChange = (field, value) => {
    setMessageForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!messageForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!messageForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(messageForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!messageForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!messageForm.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, this would send the message to a backend service
      console.log('Form submitted:', messageForm);
      
      // Show success message
      setShowMessageSent(true);
      
      // Reset form
      setMessageForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowMessageSent(false);
      }, 5000);
    }
  };
  
  const handleCall = (phone) => {
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch(err => {
        console.error('Error opening phone app:', err);
      });
  };
  
  const handleEmail = (email) => {
    const emailUrl = `mailto:${email}`;
    Linking.canOpenURL(emailUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(emailUrl);
        } else {
          Alert.alert('Error', 'Email is not supported on this device');
        }
      })
      .catch(err => {
        console.error('Error opening email app:', err);
      });
  };
  
  const handleCopyToClipboard = async (text, type) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${type} copied to clipboard`);
  };

  return (
    <View style={styles.container}>
      <Header title="Contact Organizers" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Cards */}
        <View style={styles.section}>
          <StyledText type="heading3" style={styles.sectionTitle}>
            Key Contacts
          </StyledText>
          
          {CONTACT_DATA.map((contact) => (
            <Card 
              key={contact.id} 
              style={[
                styles.contactCard,
                contact.emergency && styles.emergencyCard
              ]}
            >
              {contact.emergency && (
                <View style={styles.emergencyBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
                  <StyledText style={styles.emergencyText}>EMERGENCY</StyledText>
                </View>
              )}
              
              <View style={styles.contactHeader}>
                <View style={[styles.contactAvatar, { backgroundColor: contact.color }]}>
                  <StyledText type="heading3" color="#FFFFFF">
                    {contact.avatar}
                  </StyledText>
                </View>
                
                <View style={styles.contactInfo}>
                  <StyledText type="subheading">{contact.name}</StyledText>
                  <StyledText type="caption">{contact.department}</StyledText>
                </View>
              </View>
              
              <StyledText style={styles.contactDescription}>
                {contact.description}
              </StyledText>
              
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.contactAction}
                  onPress={() => handleCall(contact.phone)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: contact.color }]}>
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.actionInfo}>
                    <StyledText type="bodyBold">Call</StyledText>
                    <StyledText type="caption" style={styles.actionDetail}>
                      {contact.phone}
                    </StyledText>
                  </View>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyToClipboard(contact.phone, 'Phone number')}
                  >
                    <Ionicons name="copy-outline" size={18} color={COLORS.text_secondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.contactAction}
                  onPress={() => handleEmail(contact.email)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: contact.color }]}>
                    <Ionicons name="mail" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.actionInfo}>
                    <StyledText type="bodyBold">Email</StyledText>
                    <StyledText type="caption" style={styles.actionDetail}>
                      {contact.email}
                    </StyledText>
                  </View>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyToClipboard(contact.email, 'Email address')}
                  >
                    <Ionicons name="copy-outline" size={18} color={COLORS.text_secondary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
        
        {/* Message Form */}
        {/* <View style={styles.section}>
          <StyledText type="heading3" style={styles.sectionTitle}>
            Send Message
          </StyledText>
          
          <Card style={styles.formCard}>
            <StyledText style={styles.formDescription}>
              Send a message to the organizing team. We'll respond as soon as possible.
            </StyledText>
            
            <Input
              label="Your Name"
              value={messageForm.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
              error={formErrors.name}
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />}
            />
            
            <Input
              label="Email Address"
              value={messageForm.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={formErrors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.text_secondary} />}
            />
            
            <Input
              label="Subject"
              value={messageForm.subject}
              onChangeText={(text) => handleInputChange('subject', text)}
              placeholder="Enter subject"
              error={formErrors.subject}
              leftIcon={<Ionicons name="create-outline" size={20} color={COLORS.text_secondary} />}
            />
            
            <Input
              label="Message"
              value={messageForm.message}
              onChangeText={(text) => handleInputChange('message', text)}
              placeholder="Type your message here..."
              multiline
              numberOfLines={4}
              style={styles.messageInput}
              error={formErrors.message}
            />
            
            <Button
              label="Send Message"
              variant="primary"
              leftIcon={<Ionicons name="send" size={18} color="#FFFFFF" />}
              onPress={handleSubmit}
              style={styles.submitButton}
            />
            
            {showMessageSent && (
              <View style={styles.successMessage}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <StyledText style={styles.successText}>
                  Message sent successfully!
                </StyledText>
              </View>
            )}
          </Card>
        </View> */}
        
        {/* Additional Info */}
        <View style={styles.section}>
          <StyledText type="heading3" style={styles.sectionTitle}>
            Additional Information
          </StyledText>
          
          <Card style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Main Office</StyledText>
                <StyledText>
                  123 DECA Avenue, Toronto, ON M5V 2K1
                </StyledText>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Office Hours</StyledText>
                <StyledText>
                  Monday to Friday: 9:00 AM - 5:00 PM
                </StyledText>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="globe" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Website</StyledText>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.decaontario.ca')}
                >
                  <StyledText style={styles.link}>
                    www.decaontario.ca
                  </StyledText>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-twitter" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  contactCard: {
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  emergencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  emergencyBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactDescription: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  contactActions: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  contactAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionDetail: {
    color: COLORS.text_secondary,
  },
  copyButton: {
    padding: SPACING.xs,
  },
  formCard: {
    ...SHADOWS.sm,
  },
  formDescription: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  successText: {
    color: COLORS.success,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  infoCard: {
    ...SHADOWS.sm,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  infoIcon: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
});
