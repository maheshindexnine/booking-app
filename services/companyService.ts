import { Company } from '@/types';
import api from './api';

// API calls
export const companyService = {
  // Get all companies
  getCompanies: async (): Promise<Company[]> => {
    try {
      const response = await api.get('/company');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get company by ID
  getCompanyById: async (id: string): Promise<Company> => {
    try {
      const response = await api.get(`/company/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new company
  createCompany: async (companyData: Omit<Company, 'id'>): Promise<Company> => {
    try {
      const response = await api.post('/company', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update company
  updateCompany: async (id: string, companyData: Partial<Company>): Promise<Company> => {
    try {
      const response = await api.put(`/company/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating company with id ${id}:`, error);
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (id: string): Promise<void> => {
    try {
      await api.delete(`/company/${id}`);
    } catch (error) {
      console.error(`Error deleting company with id ${id}:`, error);
      throw error;
    }
  },
}; 