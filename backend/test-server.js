// Simple test server to verify backend works
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'test'
    }
  });
});

// Test onboarding endpoint
app.post('/api/onboarding/submit', (req, res) => {
  console.log('Onboarding data received:', req.body);
  res.json({
    success: true,
    message: 'Onboarding completed successfully',
    data: {
      profile: { integrations: ['QIC Mobile App', 'QIC Health Portal', 'QIC Rewards Program'] },
      rewards: {
        xpResult: { xpGained: 200, newXP: 950, newLevel: 6, levelUp: true },
        lifescoreResult: { change: 50, newLifeScore: 1300 },
        coinsResult: { coinsGained: 20, newCoins: 270 }
      }
    }
  });
});

// Test missions endpoint
app.get('/api/missions', (req, res) => {
  res.json({
    success: true,
    data: {
      missions: [
        {
          id: 'mission-1',
          category: 'safe_driving',
          title_en: 'Daily Safe Drive',
          title_ar: 'قيادة آمنة يومية',
          description_en: 'Complete your daily commute with a perfect safe driving score.',
          description_ar: 'أكمل تنقلاتك اليومية بنتيجة قيادة آمنة مثالية.',
          difficulty: 'easy',
          xp_reward: 20,
          lifescore_impact: 5,
          is_collaborative: false,
          max_participants: 1,
          duration_days: 1,
          is_active: true
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 }
    }
  });
});

// Test AI recommendations
app.get('/api/ai/recommendations', (req, res) => {
  res.json({
    success: true,
    data: {
      recommendations: [
        {
          id: 'rec-1',
          type: 'mission',
          title: 'Daily Health Check',
          description: 'Complete your daily health assessment',
          priority: 'high',
          reason: 'Based on your health focus',
          xp_reward: 50,
          lifescore_impact: 10
        }
      ],
      generated_at: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
