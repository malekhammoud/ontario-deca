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
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { COLORS, SPACING } from '@/constants/colors';

// Chat message types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

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

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      // Generate response using Gemini AI
      const response = await generateGeminiResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "DECA AI BOT not available",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    Keyboard.dismiss();
  };

  // Generate response using Gemini AI
  const generateGeminiResponse = async (query: string): Promise<string> => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an AI assistant for the DECA Provincials event in Ontario. The event runs from September 22-25, 2025, and is held at the Toronto Convention Center. You should provide helpful, accurate information about:

- Event schedule and timing
- Competition categories (Business Management, Marketing, Finance, Hospitality)
- Venue information and maps
- Registration details
- Dress code (business professional attire required)
- Awards ceremony (September 25th at 4:00 PM)
- Contact information (info@decaontario.ca)
- Wi-Fi access (Network: DECA_Event, Password: Provincial2025)
- Food and dining options
- Transportation and shuttle services
- Partner hotel accommodations
- General event information

Please keep responses concise, helpful, and professional. If you don't know specific information, suggest they check the app or contact organizers.

User question: ${query}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  messagesContent: {
    flexGrow: 1,
    paddingBottom: SPACING.md,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '90%',
    width: 'auto',
  },
  userBubble: {
    alignSelf: 'flex-end',
    marginLeft: '10%',
  },
  botBubble: {
    alignSelf: 'flex-start',
    marginRight: '10%',
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
    flex: 1,
    minWidth: 0, // Allow text to wrap properly
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
    lineHeight: 22,
    flexWrap: 'wrap',
    flexShrink: 1,
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
    textAlignVertical: 'center',
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
