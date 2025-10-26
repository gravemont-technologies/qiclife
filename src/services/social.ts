// QIC Gamified Insurance App - Social Service
// Handles all social features, friends, and collaborative operations with mock data

import type {
  SocialConnection,
  RelationshipType,
  ConnectionStatus,
  User
} from '@/types';

// Mock users data for social features
const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'john.doe@example.com',
    lifescore: 750,
    xp: 250,
    level: 3,
    streak_days: 5,
    avatar_config: {
      skin_tone: 'medium',
      hair_color: 'brown',
      eye_color: 'brown',
      accessories: ['glasses'],
      background: 'blue'
    },
    language_preference: 'en',
    theme_preference: 'light',
    coins: 150,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_002',
    email: 'sarah.smith@example.com',
    lifescore: 820,
    xp: 180,
    level: 2,
    streak_days: 12,
    avatar_config: {
      skin_tone: 'light',
      hair_color: 'blonde',
      eye_color: 'blue',
      accessories: [],
      background: 'green'
    },
    language_preference: 'en',
    theme_preference: 'dark',
    coins: 200,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'user_003',
    email: 'ahmed.hassan@example.com',
    lifescore: 680,
    xp: 320,
    level: 4,
    streak_days: 3,
    avatar_config: {
      skin_tone: 'medium',
      hair_color: 'black',
      eye_color: 'brown',
      accessories: ['hat'],
      background: 'purple'
    },
    language_preference: 'ar',
    theme_preference: 'light',
    coins: 75,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z'
  },
  {
    id: 'user_004',
    email: 'maria.garcia@example.com',
    lifescore: 900,
    xp: 450,
    level: 5,
    streak_days: 25,
    avatar_config: {
      skin_tone: 'medium',
      hair_color: 'black',
      eye_color: 'brown',
      accessories: ['earrings'],
      background: 'red'
    },
    language_preference: 'es',
    theme_preference: 'dark',
    coins: 300,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z'
  }
];

// Mock social connections data
const mockSocialConnections: SocialConnection[] = [
  {
    id: 'connection_001',
    user_id: 'user_001',
    friend_id: 'user_002',
    relationship_type: 'friend',
    status: 'accepted',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: 'connection_002',
    user_id: 'user_001',
    friend_id: 'user_003',
    relationship_type: 'family',
    status: 'accepted',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: 'connection_003',
    user_id: 'user_002',
    friend_id: 'user_004',
    relationship_type: 'colleague',
    status: 'accepted',
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z'
  },
  {
    id: 'connection_004',
    user_id: 'user_001',
    friend_id: 'user_004',
    relationship_type: 'friend',
    status: 'pending',
    created_at: '2024-01-16T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  }
];

// Social Service Class
export class SocialService {
  // Get user's friends
  async getUserFriends(userId: string): Promise<User[]> {
    await this.simulateDelay();
    
    const connections = mockSocialConnections.filter(
      conn => conn.user_id === userId && conn.status === 'accepted'
    );
    
    const friendIds = connections.map(conn => conn.friend_id);
    return mockUsers.filter(user => friendIds.includes(user.id));
  }

  // Get user's family members
  async getUserFamily(userId: string): Promise<User[]> {
    await this.simulateDelay();
    
    const connections = mockSocialConnections.filter(
      conn => conn.user_id === userId && 
              conn.relationship_type === 'family' && 
              conn.status === 'accepted'
    );
    
    const familyIds = connections.map(conn => conn.friend_id);
    return mockUsers.filter(user => familyIds.includes(user.id));
  }

  // Get user's colleagues
  async getUserColleagues(userId: string): Promise<User[]> {
    await this.simulateDelay();
    
    const connections = mockSocialConnections.filter(
      conn => conn.user_id === userId && 
              conn.relationship_type === 'colleague' && 
              conn.status === 'accepted'
    );
    
    const colleagueIds = connections.map(conn => conn.friend_id);
    return mockUsers.filter(user => colleagueIds.includes(user.id));
  }

  // Get user's mentors
  async getUserMentors(userId: string): Promise<User[]> {
    await this.simulateDelay();
    
    const connections = mockSocialConnections.filter(
      conn => conn.user_id === userId && 
              conn.relationship_type === 'mentor' && 
              conn.status === 'accepted'
    );
    
    const mentorIds = connections.map(conn => conn.friend_id);
    return mockUsers.filter(user => mentorIds.includes(user.id));
  }

  // Get all social connections for a user
  async getUserConnections(userId: string): Promise<SocialConnection[]> {
    await this.simulateDelay();
    return mockSocialConnections.filter(conn => conn.user_id === userId);
  }

  // Send friend request
  async sendFriendRequest(
    userId: string,
    friendId: string,
    relationshipType: RelationshipType = 'friend'
  ): Promise<SocialConnection> {
    await this.simulateDelay();
    
    // Check if connection already exists
    const existingConnection = mockSocialConnections.find(
      conn => conn.user_id === userId && conn.friend_id === friendId
    );
    
    if (existingConnection) {
      throw new Error('Connection already exists');
    }
    
    // Check if user is trying to connect to themselves
    if (userId === friendId) {
      throw new Error('Cannot connect to yourself');
    }
    
    const connection: SocialConnection = {
      id: `connection_${Date.now()}`,
      user_id: userId,
      friend_id: friendId,
      relationship_type: relationshipType,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockSocialConnections.push(connection);
    return connection;
  }

  // Accept friend request
  async acceptFriendRequest(connectionId: string): Promise<SocialConnection> {
    await this.simulateDelay();
    
    const connection = mockSocialConnections.find(conn => conn.id === connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    
    if (connection.status !== 'pending') {
      throw new Error('Connection is not pending');
    }
    
    connection.status = 'accepted';
    connection.updated_at = new Date().toISOString();
    
    return connection;
  }

  // Decline friend request
  async declineFriendRequest(connectionId: string): Promise<void> {
    await this.simulateDelay();
    
    const connectionIndex = mockSocialConnections.findIndex(conn => conn.id === connectionId);
    if (connectionIndex === -1) {
      throw new Error('Connection not found');
    }
    
    mockSocialConnections.splice(connectionIndex, 1);
  }

  // Remove friend
  async removeFriend(connectionId: string): Promise<void> {
    await this.simulateDelay();
    
    const connectionIndex = mockSocialConnections.findIndex(conn => conn.id === connectionId);
    if (connectionIndex === -1) {
      throw new Error('Connection not found');
    }
    
    mockSocialConnections.splice(connectionIndex, 1);
  }

  // Block user
  async blockUser(userId: string, friendId: string): Promise<void> {
    await this.simulateDelay();
    
    const connection = mockSocialConnections.find(
      conn => conn.user_id === userId && conn.friend_id === friendId
    );
    
    if (connection) {
      connection.status = 'blocked';
      connection.updated_at = new Date().toISOString();
    } else {
      // Create new blocked connection
      const blockedConnection: SocialConnection = {
        id: `connection_${Date.now()}`,
        user_id: userId,
        friend_id: friendId,
        relationship_type: 'friend',
        status: 'blocked',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockSocialConnections.push(blockedConnection);
    }
  }

  // Unblock user
  async unblockUser(userId: string, friendId: string): Promise<void> {
    await this.simulateDelay();
    
    const connection = mockSocialConnections.find(
      conn => conn.user_id === userId && conn.friend_id === friendId
    );
    
    if (connection && connection.status === 'blocked') {
      const connectionIndex = mockSocialConnections.findIndex(conn => conn.id === connection.id);
      mockSocialConnections.splice(connectionIndex, 1);
    }
  }

  // Get pending friend requests
  async getPendingRequests(userId: string): Promise<SocialConnection[]> {
    await this.simulateDelay();
    return mockSocialConnections.filter(
      conn => conn.friend_id === userId && conn.status === 'pending'
    );
  }

  // Get sent friend requests
  async getSentRequests(userId: string): Promise<SocialConnection[]> {
    await this.simulateDelay();
    return mockSocialConnections.filter(
      conn => conn.user_id === userId && conn.status === 'pending'
    );
  }

  // Search users
  async searchUsers(query: string, excludeUserId?: string): Promise<User[]> {
    await this.simulateDelay();
    
    const searchTerm = query.toLowerCase();
    let filteredUsers = mockUsers.filter(user =>
      user.email.toLowerCase().includes(searchTerm)
    );
    
    if (excludeUserId) {
      filteredUsers = filteredUsers.filter(user => user.id !== excludeUserId);
    }
    
    return filteredUsers;
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    await this.simulateDelay();
    return mockUsers.find(user => user.id === userId) || null;
  }

  // Get collaborative missions for user's network
  async getCollaborativeMissions(userId: string): Promise<any[]> {
    await this.simulateDelay();
    
    // Mock collaborative missions
    const collaborativeMissions = [
      {
        id: 'collab_mission_001',
        title: 'Family Safety Challenge',
        description: 'Work together with family members to improve home safety',
        participants: ['user_001', 'user_003'],
        status: 'active',
        progress: 60,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        id: 'collab_mission_002',
        title: 'Team Health Goals',
        description: 'Set and achieve health goals as a team',
        participants: ['user_001', 'user_002'],
        status: 'completed',
        progress: 100,
        created_at: '2024-01-10T00:00:00Z'
      }
    ];
    
    return collaborativeMissions.filter(mission =>
      mission.participants.includes(userId)
    );
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    await this.simulateDelay();
    
    return mockUsers
      .sort((a, b) => b.lifescore - a.lifescore)
      .slice(0, limit);
  }

  // Get user's social statistics
  async getSocialStats(userId: string): Promise<{
    total_connections: number;
    friends_count: number;
    family_count: number;
    colleagues_count: number;
    mentors_count: number;
    pending_requests: number;
    sent_requests: number;
    collaborative_missions: number;
    social_score: number;
  }> {
    await this.simulateDelay();
    
    const connections = await this.getUserConnections(userId);
    const friends = await this.getUserFriends(userId);
    const family = await this.getUserFamily(userId);
    const colleagues = await this.getUserColleagues(userId);
    const mentors = await this.getUserMentors(userId);
    const pendingRequests = await this.getPendingRequests(userId);
    const sentRequests = await this.getSentRequests(userId);
    const collaborativeMissions = await this.getCollaborativeMissions(userId);
    
    const socialScore = (friends.length * 10) + (family.length * 15) + (colleagues.length * 5) + (mentors.length * 20);
    
    return {
      total_connections: connections.length,
      friends_count: friends.length,
      family_count: family.length,
      colleagues_count: colleagues.length,
      mentors_count: mentors.length,
      pending_requests: pendingRequests.length,
      sent_requests: sentRequests.length,
      collaborative_missions: collaborativeMissions.length,
      social_score: socialScore
    };
  }

  // Get relationship types
  getRelationshipTypes(): RelationshipType[] {
    return ['friend', 'family', 'colleague', 'mentor'];
  }

  // Get connection statuses
  getConnectionStatuses(): ConnectionStatus[] {
    return ['pending', 'accepted', 'blocked'];
  }

  // Private helper methods
  private async simulateDelay(): Promise<void> {
    const delay = 500 + Math.random() * 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const socialService = new SocialService();

// Export individual functions for easier use
export const getUserFriends = (userId: string) => socialService.getUserFriends(userId);
export const getUserFamily = (userId: string) => socialService.getUserFamily(userId);
export const getUserColleagues = (userId: string) => socialService.getUserColleagues(userId);
export const getUserMentors = (userId: string) => socialService.getUserMentors(userId);
export const getUserConnections = (userId: string) => socialService.getUserConnections(userId);
export const sendFriendRequest = (userId: string, friendId: string, relationshipType?: RelationshipType) => socialService.sendFriendRequest(userId, friendId, relationshipType);
export const acceptFriendRequest = (connectionId: string) => socialService.acceptFriendRequest(connectionId);
export const declineFriendRequest = (connectionId: string) => socialService.declineFriendRequest(connectionId);
export const removeFriend = (connectionId: string) => socialService.removeFriend(connectionId);
export const blockUser = (userId: string, friendId: string) => socialService.blockUser(userId, friendId);
export const unblockUser = (userId: string, friendId: string) => socialService.unblockUser(userId, friendId);
export const getPendingRequests = (userId: string) => socialService.getPendingRequests(userId);
export const getSentRequests = (userId: string) => socialService.getSentRequests(userId);
export const searchUsers = (query: string, excludeUserId?: string) => socialService.searchUsers(query, excludeUserId);
export const getUserById = (userId: string) => socialService.getUserById(userId);
export const getCollaborativeMissions = (userId: string) => socialService.getCollaborativeMissions(userId);
export const getLeaderboard = (limit?: number) => socialService.getLeaderboard(limit);
export const getSocialStats = (userId: string) => socialService.getSocialStats(userId);
export const getRelationshipTypes = () => socialService.getRelationshipTypes();
export const getConnectionStatuses = () => socialService.getConnectionStatuses();
