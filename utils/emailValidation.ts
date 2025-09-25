// Simple email validation utility that works with your existing infrastructure
// This creates a local list for development and uses the API for production
const API_URL = process.env.ONTARIO_DECA_API_URL

const DEVELOPMENT_ALLOWED_EMAILS = [
  // Add some test emails for development - you can add your actual email here for testing
  { email: 'test@example.com', name: 'Test User', school: 'Test High School' },
  { email: 'admin@deca.org', name: 'Admin User', school: 'DECA Ontario' },
  { email: 'student@school.edu', name: 'John Doe', school: 'Sample Secondary School' },
  // Add your actual email here for testing with mock data
];

export const validateEmailLocally = (email: string): { exists: boolean; studentData: any } => {
  const normalizedEmail = email.toLowerCase().trim();
  const student = DEVELOPMENT_ALLOWED_EMAILS.find(s => s.email === normalizedEmail);
  return {
    exists: !!student,
    studentData: student ? { name: student.name, school: student.school } : null
  };
};

export const validateEmailInDatabase = async (email: string): Promise<{ exists: boolean; studentData: any }> => {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email validation attempt ${attempt}/${maxRetries} for:`, email);

      // In development, try the API first, but fall back to local validation
      if (__DEV__) {
        try {
          // Try the production API first
          const response = await fetch(`${API_URL}/api/validate-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.toLowerCase().trim() }),
            signal: AbortSignal.timeout(8000), // 8 second timeout
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Production API validation result:', data);

            // Enhanced debugging
            if (data.debug) {
              console.log('API Debug Info:', {
                rowCount: data.debug.rowCount,
                firstRow: data.debug.firstRow,
                hasStudentData: !!data.studentData
              });
            }

            return {
              exists: data.exists,
              studentData: data.studentData
            };
          }
        } catch (apiError) {
          console.log('Production API failed in development, using local validation:', apiError);
          // Fall back to local development validation
          const localResult = validateEmailLocally(email);
          console.log('Local validation result:', localResult);
          return localResult;
        }
      }

      // Production: try multiple endpoints
      const endpoints = [
        `${API_URL}/api/validate-email`,
        '/api/validate-email'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.toLowerCase().trim() }),
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Email validation successful via ${endpoint}:`, data);
            return {
              exists: data.exists,
              studentData: data.studentData
            };
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError);
          continue;
        }
      }

      throw new Error('All API endpoints failed');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Email validation attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const waitTime = 2000 * attempt; // 2s, 4s
        console.log(`Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // Final fallback
  if (__DEV__) {
    console.warn('All validation attempts failed in development, using local fallback');
    return validateEmailLocally(email);
  }

  throw new Error('Email validation service is temporarily unavailable. Please try again in a few moments.');
};
