import { BusinessProfile, Tool, ChartData, Currency } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getTools = async (): Promise<Tool[]> => {
    const response = await fetch(`${API_BASE_URL}/meta/tools`);
    if (!response.ok) throw new Error('Failed to fetch tools');
    return response.json();
};

export const getCurrencies = async (): Promise<Currency[]> => {
    const response = await fetch(`${API_BASE_URL}/meta/currencies`);
    if (!response.ok) throw new Error('Failed to fetch currencies');
    return response.json();
};

export const getProfiles = async (): Promise<BusinessProfile[]> => {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    if (!response.ok) throw new Error('Failed to fetch profiles');
    return response.json();
};

export const getProfile = async (id: string): Promise<BusinessProfile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};

export const createProfile = async (profile: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
};

export const updateProfile = async (id: string, updates: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};

export const getInsights = async (profileId: string): Promise<ChartData[]> => {
    const response = await fetch(`${API_BASE_URL}/insights/${profileId}`);
    if (!response.ok) throw new Error('Failed to fetch insights');
    // Map backend insight to frontend ChartData if necessary
    const data = await response.json();
    return data.map((item: any) => ({
        name: item.month,
        revenue: item.revenue,
        expenses: item.expenses
    }));
};
