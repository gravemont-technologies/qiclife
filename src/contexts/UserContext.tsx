// QIC Gamified Insurance App - User Context
// Provides user state management and gamification data

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, UserState } from '@/types';

// User context state interface
interface UserContextState extends UserState {
  dispatch: React.Dispatch<UserAction>;
  updateUser: (updates: Partial<User>) => void;
  updateLifeScore: (change: number) => void;
  updateXP: (amount: number) => void;
  updateLevel: () => void;
  updateStreak: (increment: boolean) => void;
  updateCoins: (amount: number) => void;
  resetUser: () => void;
}

// User action types
type UserAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_LIFESCORE'; payload: number }
  | { type: 'UPDATE_XP'; payload: number }
  | { type: 'UPDATE_LEVEL' }
  | { type: 'UPDATE_STREAK'; payload: boolean }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'RESET_USER' };

// User reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    case 'UPDATE_LIFESCORE':
      if (!state.user) return state;
      const newLifeScore = Math.min(Math.max(state.user.lifescore + action.payload, 0), 1000);
      return {
        ...state,
        user: {
          ...state.user,
          lifescore: newLifeScore
        }
      };
    
    case 'UPDATE_XP':
      if (!state.user) return state;
      const newXP = Math.max(state.user.xp + action.payload, 0);
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: newLevel
        }
      };
    
    case 'UPDATE_LEVEL':
      if (!state.user) return state;
      const calculatedLevel = Math.floor(state.user.xp / 100) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          level: calculatedLevel
        }
      };
    
    case 'UPDATE_STREAK':
      if (!state.user) return state;
      const newStreak = action.payload 
        ? state.user.streak_days + 1 
        : Math.max(state.user.streak_days - 1, 0);
      return {
        ...state,
        user: {
          ...state.user,
          streak_days: newStreak
        }
      };
    
    case 'UPDATE_COINS':
      if (!state.user) return state;
      const newCoins = Math.max(state.user.coins + action.payload, 0);
      return {
        ...state,
        user: {
          ...state.user,
          coins: newCoins
        }
      };
    
    case 'RESET_USER':
      return {
        user: null,
        isLoading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null
};

// Create context
const UserContext = createContext<UserContextState | undefined>(undefined);

// User provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Try to load from localStorage first
        const savedUser = localStorage.getItem('qic-user');
        let userData: User;
        
        if (savedUser) {
          try {
            userData = JSON.parse(savedUser);
          } catch (error) {
            console.error('Error parsing saved user data:', error);
            // Fallback to mock data
            userData = {
              id: 'user_001',
              email: 'user@qiclife.com',
              lifescore: 1250,
              xp: 750,
              level: 5,
              streak_days: 7,
              avatar_config: {
                skin_tone: 'medium',
                hair_color: 'brown',
                eye_color: 'brown',
                accessories: ['glasses'],
                background: 'blue'
              },
              language_preference: 'en',
              theme_preference: 'light',
              coins: 250,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: new Date().toISOString()
            };
          }
        } else {
          // Use mock data as default
          userData = {
            id: 'user_001',
            email: 'user@qiclife.com',
            lifescore: 1250,
            xp: 750,
            level: 5,
            streak_days: 7,
            avatar_config: {
              skin_tone: 'medium',
              hair_color: 'brown',
              eye_color: 'brown',
              accessories: ['glasses'],
              background: 'blue'
            },
            language_preference: 'en',
            theme_preference: 'light',
            coins: 250,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
          };
        }
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to load user data' 
        });
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage
  const saveUserToStorage = (user: User) => {
    try {
      localStorage.setItem('qic-user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Context methods
  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    // Save to localStorage after update
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      saveUserToStorage(updatedUser);
    }
  };

  const updateLifeScore = (change: number) => {
    dispatch({ type: 'UPDATE_LIFESCORE', payload: change });
    // Save to localStorage after update
    if (state.user) {
      const newLifeScore = Math.min(Math.max(state.user.lifescore + change, 0), 1000);
      const updatedUser = { ...state.user, lifescore: newLifeScore };
      saveUserToStorage(updatedUser);
    }
  };

  const updateXP = (amount: number) => {
    dispatch({ type: 'UPDATE_XP', payload: amount });
    // Save to localStorage after update
    if (state.user) {
      const newXP = Math.max(state.user.xp + amount, 0);
      const newLevel = Math.floor(newXP / 100) + 1;
      const updatedUser = { ...state.user, xp: newXP, level: newLevel };
      saveUserToStorage(updatedUser);
    }
  };

  const updateLevel = () => {
    dispatch({ type: 'UPDATE_LEVEL' });
    // Save to localStorage after update
    if (state.user) {
      const calculatedLevel = Math.floor(state.user.xp / 100) + 1;
      const updatedUser = { ...state.user, level: calculatedLevel };
      saveUserToStorage(updatedUser);
    }
  };

  const updateStreak = (increment: boolean) => {
    dispatch({ type: 'UPDATE_STREAK', payload: increment });
    // Save to localStorage after update
    if (state.user) {
      const newStreak = increment 
        ? state.user.streak_days + 1 
        : Math.max(state.user.streak_days - 1, 0);
      const updatedUser = { ...state.user, streak_days: newStreak };
      saveUserToStorage(updatedUser);
    }
  };

  const updateCoins = (amount: number) => {
    dispatch({ type: 'UPDATE_COINS', payload: amount });
    // Save to localStorage after update
    if (state.user) {
      const newCoins = Math.max(state.user.coins + amount, 0);
      const updatedUser = { ...state.user, coins: newCoins };
      saveUserToStorage(updatedUser);
    }
  };

  const resetUser = () => {
    dispatch({ type: 'RESET_USER' });
    // Clear localStorage
    localStorage.removeItem('qic-user');
  };

  const contextValue: UserContextState = {
    ...state,
    dispatch,
    updateUser,
    updateLifeScore,
    updateXP,
    updateLevel,
    updateStreak,
    updateCoins,
    resetUser
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = (): UserContextState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Custom hooks for specific user data
export const useUserData = () => {
  const { user, isLoading, error } = useUser();
  return { user, isLoading, error };
};

export const useLifeScore = () => {
  const { user, updateLifeScore } = useUser();
  return {
    lifescore: user?.lifescore || 0,
    updateLifeScore
  };
};

export const useXP = () => {
  const { user, updateXP, updateLevel } = useUser();
  return {
    xp: user?.xp || 0,
    level: user?.level || 1,
    updateXP,
    updateLevel
  };
};

export const useStreak = () => {
  const { user, updateStreak } = useUser();
  return {
    streak: user?.streak_days || 0,
    updateStreak
  };
};

export const useCoins = () => {
  const { user, updateCoins } = useUser();
  return {
    coins: user?.coins || 0,
    updateCoins
  };
};

export const useAvatar = () => {
  const { user, updateUser } = useUser();
  return {
    avatar: user?.avatar_config,
    updateAvatar: (avatarConfig: User['avatar_config']) => {
      updateUser({ avatar_config: avatarConfig });
    }
  };
};

// Utility functions
export const getLifeScoreColor = (lifescore: number): string => {
  if (lifescore >= 800) return 'hsl(var(--qic-lifescore-excellent))';
  if (lifescore >= 600) return 'hsl(var(--qic-lifescore-high))';
  if (lifescore >= 400) return 'hsl(var(--qic-lifescore-medium))';
  return 'hsl(var(--qic-lifescore-low))';
};

export const getLifeScoreLabel = (lifescore: number): string => {
  if (lifescore >= 800) return 'Excellent';
  if (lifescore >= 600) return 'Good';
  if (lifescore >= 400) return 'Fair';
  return 'Needs Improvement';
};

export const getXPToNextLevel = (currentXP: number): number => {
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const xpForNextLevel = currentLevel * 100;
  return xpForNextLevel - currentXP;
};

export const getLevelProgress = (currentXP: number): number => {
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export default UserContext;
