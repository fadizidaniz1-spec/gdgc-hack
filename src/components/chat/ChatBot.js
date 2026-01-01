import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLanguage } from '../../context';
import { useAuthStore } from '../../store';
import { chatService } from '../../services/chatService';
import { SIZES, FONTS, FONT_SIZES, GRADIENTS, SHADOWS } from '../../constants';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const ChatBot = () => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const result = await chatService.getSuggestions();
      setSuggestions(result.suggestions || [
        'هل توجد مباريات اليوم؟',
        'أريد البحث عن ملعب قريب',
        'ما هي أفضل الملاعب؟',
      ]);
    } catch (error) {
      setSuggestions([
        'هل توجد مباريات اليوم؟',
        'أريد البحث عن ملعب قريب',
        'ما هي أفضل الملاعب؟',
      ]);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputText.trim(), {
        skillLevel: user?.skillLevel,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        data: response.data,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    chatService.clearHistory().catch(() => {});
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}>
        {!isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="football" size={16} color={colors.primary} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser 
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.botBubble, { backgroundColor: colors.surface }],
          item.isError && { backgroundColor: colors.error + '20' },
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#fff' : colors.text },
            item.isError && { color: colors.error },
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
          ]}>
            {new Date(item.timestamp).toLocaleTimeString('ar-DZ', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="person" size={16} color={colors.secondary} />
          </View>
        )}
      </View>
    );
  };

  const chatTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 90 + insets.bottom }]}
        onPress={toggleChat}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name={isOpen ? 'close' : 'chatbubble-ellipses'} 
            size={26} 
            color="#fff" 
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* Chat Modal */}
      {isOpen && (
        <Animated.View 
          style={[
            styles.chatContainer,
            { 
              transform: [{ translateY: chatTranslateY }],
              paddingBottom: insets.bottom,
            }
          ]}
        >
          <View style={[
            styles.chatInner,
            { backgroundColor: colors.background }
          ]}>
            {/* Header */}
            <LinearGradient
              colors={isDarkMode ? GRADIENTS.dark : GRADIENTS.primary}
              style={styles.chatHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerLeft}>
                <View style={styles.botAvatar}>
                  <Ionicons name="football" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Stadium AI</Text>
                  <Text style={styles.headerSubtitle}>
                    {isLoading ? 'يكتب...' : 'متصل'}
                  </Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={clearChat} style={styles.headerBtn}>
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleChat} style={styles.headerBtn}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              ListEmptyComponent={
                <View style={styles.emptyChat}>
                  <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="chatbubbles" size={40} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    مرحباً! 👋
                  </Text>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    أنا مساعدك الذكي. اسألني عن الملاعب والمباريات!
                  </Text>
                  
                  {/* Suggestions */}
                  <View style={styles.suggestionsContainer}>
                    <Text style={[styles.suggestionsTitle, { color: colors.textSecondary }]}>
                      جرب أن تسأل:
                    </Text>
                    {suggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.suggestionChip, { backgroundColor: colors.surface }]}
                        onPress={() => handleSuggestion(suggestion)}
                      >
                        <Text style={[styles.suggestionText, { color: colors.primary }]}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              }
            />

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="اكتب رسالتك..."
                  placeholderTextColor={colors.textTertiary}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    (!inputText.trim() || isLoading) && styles.sendBtnDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={!inputText.trim() || isLoading}
                >
                  <LinearGradient
                    colors={inputText.trim() && !isLoading ? GRADIENTS.primary : [colors.disabled, colors.disabled]}
                    style={styles.sendBtnGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="send" size={18} color="#fff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: SIZES.md,
    zIndex: 1000,
    ...SHADOWS.large,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  chatInner: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: SIZES.md,
    paddingHorizontal: SIZES.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: SIZES.md,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.md,
    alignItems: 'flex-end',
    gap: SIZES.xs,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: SIZES.sm,
    borderRadius: SIZES.radius,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
    textAlign: 'right',
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
    marginBottom: SIZES.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  suggestionsContainer: {
    width: '100%',
    paddingHorizontal: SIZES.md,
  },
  suggestionsTitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  suggestionChip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.xs,
  },
  suggestionText: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SIZES.sm,
    gap: SIZES.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: FONT_SIZES.md,
    textAlign: 'right',
  },
  sendBtn: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
  sendBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
