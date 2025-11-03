import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-576ea37e`;

export const api = {
  async signup(email: string, password: string, name: string, jobPreferences: string[], experienceYears: number) {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name, jobPreferences, experienceYears })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  },

  async getProfile(accessToken: string) {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  async updateProfile(accessToken: string, updates: any) {
    const response = await fetch(`${API_BASE}/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },

  async createSession(accessToken: string, config: any) {
    const response = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return response.json();
  },

  async completeSession(accessToken: string, sessionId: string, results: any) {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(results)
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete session');
    }
    
    return response.json();
  },

  async getSessions(accessToken: string) {
    const response = await fetch(`${API_BASE}/sessions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    
    return response.json();
  },

  async getLeaderboard() {
    const response = await fetch(`${API_BASE}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    return response.json();
  },

  async generateQuestions(accessToken: string, config: any) {
    const response = await fetch(`${API_BASE}/questions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate questions');
    }
    
    return response.json();
  },

  async generateFeedback(accessToken: string, data: any) {
    const response = await fetch(`${API_BASE}/generate-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate feedback');
    }
    
    return response.json();
  }
};
