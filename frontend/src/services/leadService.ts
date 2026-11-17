import type { DemoRequestData } from '../types';

const DEMO_REQUESTS_KEY = 'cloud_optimizer_demo_requests';
const CONTACT_INQUIRIES_KEY = 'cloud_optimizer_contact_inquiries';

export interface StoredDemoRequest extends DemoRequestData {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified';
}

export interface StoredContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'responded';
}

export const leadService = {
  submitDemoRequest: async (data: DemoRequestData): Promise<{ success: boolean; id: string }> => {
    // Simulate server latency 600ms
    await new Promise((resolve) => setTimeout(resolve, 600));

    const id = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: StoredDemoRequest = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    try {
      const existing = JSON.parse(localStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
      existing.unshift(newRecord);
      localStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    return { success: true, id };
  },

  submitContactInquiry: async (inquiry: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; id: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: StoredContactInquiry = {
      ...inquiry,
      id,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    try {
      const existing = JSON.parse(localStorage.getItem(CONTACT_INQUIRIES_KEY) || '[]');
      existing.unshift(newRecord);
      localStorage.setItem(CONTACT_INQUIRIES_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to save contact inquiry:', e);
    }

    return { success: true, id };
  },

  getStoredDemoRequests: (): StoredDemoRequest[] => {
    try {
      return JSON.parse(localStorage.getItem(DEMO_REQUESTS_KEY) || '[]');
    } catch {
      return [];
    }
  },
};
