import { create } from "zustand";
import { Company } from "@/types";
import { companyService } from "@/services/companyService";

// Store
interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;

  // Actions
  getCompanies: () => Promise<Company[]>;
  getCompanyById: (id: string) => Company | undefined;
  selectCompany: (company: Company) => void;
  clearSelectedCompany: () => void;

  // CRUD Operations
  addCompany: (companyData: Company) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  selectedCompany: null,

  // Get all companies
  getCompanies: async () => {
    try {
      const companies = await companyService.getCompanies();
      set({ companies });
      return companies;
    } catch (error) {
      console.error("Error fetching companies:", error);
      return get().companies; // Return existing companies if API call fails
    }
  },

  // Get company by ID
  getCompanyById: (id) => get().companies.find((company) => company._id === id),

  // Select company
  selectCompany: (company) => set({ selectedCompany: company }),

  // Clear selected company
  clearSelectedCompany: () => set({ selectedCompany: null }),

  // Add new company
  addCompany: async (companyData) => {
    try {
      await companyService.createCompany(companyData);
      get().getCompanies();
    } catch (error) {
      console.error("Error adding company:", error);
      throw error;
    }
  },

  // Update company
  updateCompany: async (id, data) => {
    try {
      await companyService.updateCompany(id, data);
      get().getCompanies();
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (id) => {
    try {
      await companyService.deleteCompany(id);
      get().getCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  },
}));
