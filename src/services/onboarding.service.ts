export const OnboardingService = {
  updateProfile: async (userId: string, data: any) => {
    return new Promise(resolve => setTimeout(resolve, 800));
  },
  createFacility: async (userId: string, data: any) => {
    return new Promise(resolve => setTimeout(resolve, 800));
  },
  skipDigitalTwinSetup: async (userId: string) => {
    return new Promise(resolve => setTimeout(resolve, 800));
  },
  approveOrganization: async (userId: string) => {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
};
