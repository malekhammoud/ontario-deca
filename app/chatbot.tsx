import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { COLORS, SPACING } from '@/constants/colors';

// Mock chatbot responses for demo purposes
const MOCK_RESPONSES = {
  'default': "I'm your DECA Provincials Assistant. How can I help you today?",
  'greeting': ["Hello! How can I help with DECA Provincials today?", "Hi there! What information do you need about the event?"],
  'schedule': "The DECA Provincials event runs from September 22-25, 2025. You can find the full schedule in the Schedule tab.",
  'location': "The event is being held at the Toronto Convention Center. You can find detailed maps and directions in the Venue tab.",
  'competition': "There are several competition categories including Business Management, Marketing, Finance, and Hospitality. Each has different case studies and requirements.",
  'dress': "Business professional attire is required for all competitions. This includes a suit or blazer with dress pants/skirt and dress shoes.",
  'awards': "The Awards Ceremony will be held on September 25th at 4:00 PM in the Main Auditorium.",
  'registration': "Registration is open daily from 8:00 AM to 10:00 AM at the Main Entrance on Day 1 (September 22).",
  'contact': "You can contact the event organizers through the Contact section in the More tab, or email directly at info@decaontario.ca",
  'wifi': "Free Wi-Fi is available throughout the venue. Network: DECA_Event, Password: Provincial2025",
  'food': "There are food courts and cafés throughout the venue. Some meal options are included with registration, check your registration package for details.",
  'transportation': "Shuttle services are available from partner hotels. Public transportation is also convenient, with subway and bus stops nearby.",
  'hotel': "Our partner hotels include The Grand Hotel, City Center Inn, and Business Plaza Hotel. Special rates are available for DECA members."
};

// Chat message types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your DECA Provincials AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = generateResponse(inputText.trim().toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);

    Keyboard.dismiss();
  };

  // Mock response generation for demo purposes
  // In a real app, this would be an API call to a backend service
  const generateResponse = (query: string): string => {
    // Check for keywords
    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      return MOCK_RESPONSES.greeting[Math.floor(Math.random() * MOCK_RESPONSES.greeting.length)];
    } else if (query.includes('schedule') || query.includes('timetable') || query.includes('when')) {
      return MOCK_RESPONSES.schedule;
    } else if (query.includes('where') || query.includes('location') || query.includes('venue')) {
      return MOCK_RESPONSES.location;
    } else if (query.includes('competition') || query.includes('compete') || query.includes('events')) {
      return MOCK_RESPONSES.competition;
    } else if (query.includes('dress') || query.includes('attire') || query.includes('wear')) {
      return MOCK_RESPONSES.dress;
    } else if (query.includes('award') || query.includes('ceremony') || query.includes('prize')) {
      return MOCK_RESPONSES.awards;
    } else if (query.includes('register') || query.includes('registration') || query.includes('check-in')) {
      return MOCK_RESPONSES.registration;
    } else if (query.includes('contact') || query.includes('organizer') || query.includes('email')) {
      return MOCK_RESPONSES.contact;
    } else if (query.includes('wifi') || query.includes('internet') || query.includes('connection')) {
      return MOCK_RESPONSES.wifi;
    } else if (query.includes('food') || query.includes('eat') || query.includes('restaurant')) {
      return MOCK_RESPONSES.food;
    } else if (query.includes('transport') || query.includes('travel') || query.includes('shuttle')) {
      return MOCK_RESPONSES.transportation;
    } else if (query.includes('hotel') || query.includes('stay') || query.includes('accommodation')) {
      return MOCK_RESPONSES.hotel;
    } else {
      return "I'm not sure about that. Please check the app for more information or contact the organizers for specific details about your question.";
    }
  };

  return (
    <View style={styles.container}>
      <Header title="AI Assistant" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              {message.sender === 'bot' && (
                <View style={styles.botAvatarContainer}>
                  <View style={styles.botAvatar}>
                    <Ionicons name="school" size={16} color="#FFFFFF" />
                  </View>
                </View>
              )}

              <View style={[
                styles.messageContent,
                message.sender === 'user' ? styles.userContent : styles.botContent,
              ]}>
                <StyledText style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userText : styles.botText,
                ]}>
                  {message.text}
                </StyledText>
                <StyledText style={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </StyledText>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.botBubble]}>
              <View style={styles.botAvatarContainer}>
                <View style={styles.botAvatar}>
                  <Ionicons name="school" size={16} color="#FFFFFF" />
                </View>
              </View>

              <View style={[styles.messageContent, styles.botContent]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDotMiddle]} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question..."
            placeholderTextColor={COLORS.text_tertiary}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!inputText.trim()}
            onPress={handleSend}
          >
            <Ionicons
              name="send"
              size={20}
              color={!inputText.trim() ? COLORS.text_tertiary : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  messagesContent: {
    flexGrow: 1,
    paddingBottom: SPACING.md,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  botAvatarContainer: {
    alignSelf: 'flex-end',
    marginRight: SPACING.xs,
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  userContent: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },
  botContent: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
    color: COLORS.text_tertiary,
  },
  typingIndicator: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.text_tertiary,
    marginRight: 4,
    opacity: 0.6,
  },
  typingDotMiddle: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxHeight: 120,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
});
