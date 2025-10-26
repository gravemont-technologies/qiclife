// Session management utilities
export const initSession = (): string => {
  let sessionId = sessionStorage.getItem('session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session-id', sessionId);
  }
  return sessionId;
};

export const getSessionId = (): string | null => {
  return sessionStorage.getItem('session-id');
};

export const clearSession = (): void => {
  sessionStorage.removeItem('session-id');
};

// Initialize session on app start
initSession();
