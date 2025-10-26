import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

// Only initialize Supabase if we have the required environment variables
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Mock user for development when Clerk is not available
const mockUser = {
  id: 'mock-user-001',
  email: 'user@qiclife.com',
  username: 'qicuser'
};

// Authentication middleware
export const authenticateUser = async (req, res, next) => {
  // MVP: Bypass auth entirely and always attach a mock user and session
  const sessionId = req.headers['x-session-id'] || 'dev-session';
  req.user = mockUser;
  req.sessionId = sessionId;
  return next();
};

// Optional authentication middleware (doesn't fail if no auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionId = req.headers['x-session-id'];

    if (!authHeader) {
      req.user = null;
      req.sessionId = sessionId;
      return next();
    }

    // Try to authenticate, but don't fail if it doesn't work
    await authenticateUser(req, res, next);
  } catch (error) {
    req.user = null;
    req.sessionId = req.headers['x-session-id'];
    next();
  }
};

// Admin role check
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Session validation
export const validateSession = async (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: 'Session ID required'
    });
  }

  // MVP: accept any session id and attach mock session
  req.session = { session_id: sessionId };
  next();
};
