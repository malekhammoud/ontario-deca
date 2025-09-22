import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ExploreScreen() {
  const { user } = useUser();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerSection}>
          <IconSymbol
            size={80}
            color="#00539E"
            name="graduation.cap.fill"
            style={styles.headerIcon}
          />
          <ThemedText type="title" style={styles.title}>
            Explore DECA
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover opportunities, resources, and connections in business education
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Competition Categories</ThemedText>

          <TouchableOpacity style={styles.categoryCard}>
            <IconSymbol size={24} color="#00539E" name="chart.line.uptrend.xyaxis" />
            <ThemedView style={styles.categoryContent}>
              <ThemedText style={styles.categoryTitle}>Business Management & Administration</ThemedText>
              <ThemedText style={styles.categoryDescription}>
                Principles of Management, Human Resources Management, Operations Research
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <IconSymbol size={24} color="#00539E" name="dollarsign.circle.fill" />
            <ThemedView style={styles.categoryContent}>
              <ThemedText style={styles.categoryTitle}>Finance</ThemedText>
              <ThemedText style={styles.categoryDescription}>
                Financial Analysis, Personal Financial Literacy, Banking Services
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <IconSymbol size={24} color="#00539E" name="megaphone.fill" />
            <ThemedView style={styles.categoryContent}>
              <ThemedText style={styles.categoryTitle}>Marketing</ThemedText>
              <ThemedText style={styles.categoryDescription}>
                Sports & Entertainment Marketing, Digital Marketing, Retail Merchandising
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <IconSymbol size={24} color="#00539E" name="building.2.fill" />
            <ThemedView style={styles.categoryContent}>
              <ThemedText style={styles.categoryTitle}>Hospitality & Tourism</ThemedText>
              <ThemedText style={styles.categoryDescription}>
                Hotel & Lodging Management, Restaurant & Food Service, Travel & Tourism
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Resources</ThemedText>

          <TouchableOpacity style={styles.resourceCard}>
            <ThemedText style={styles.resourceTitle}>📚 Study Guides</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Comprehensive guides for all DECA competition areas
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <ThemedText style={styles.resourceTitle}>🎯 Practice Tests</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Test your knowledge with sample questions and mock exams
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <ThemedText style={styles.resourceTitle}>🏆 Past Winners</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Learn from successful case studies and role-play examples
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00539E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00539E',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#00539E',
  },
  categoryContent: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00539E',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00539E',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
