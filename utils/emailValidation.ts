// Simple email validation utility that works with your existing infrastructure
// This creates a local list for development and uses the API for production

const DEVELOPMENT_ALLOWED_EMAILS = [
  // Add some test emails for development - you can add your actual email here for testing
  'test@example.com',
  'admin@deca.org',
  'student@school.edu',
  // Add your actual email here for testing
];

export const validateEmailLocally = (email: string): boolean => {
  const normalizedEmail = email.toLowerCase().trim();
  return DEVELOPMENT_ALLOWED_EMAILS.includes(normalizedEmail);
};

export const validateEmailInDatabase = async (email: string): Promise<boolean> => {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email validation attempt ${attempt}/${maxRetries} for:`, email);

      // In development, try the API first, but fall back to local validation
      if (__DEV__) {
        try {
          // Try the production API first
          const response = await fetch('https://ontario-deca.vercel.app/api/validate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.toLowerCase().trim() }),
            signal: AbortSignal.timeout(8000), // 8 second timeout
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Production API validation result:', data);
            return data.exists;
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
        'https://ontario-deca.vercel.app/api/validate-email',
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
            return data.exists;
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
