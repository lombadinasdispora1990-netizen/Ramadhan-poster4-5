import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // State
  uploadedImage: null,
  imageName: '',
  uploadedImage2: null, // Second reference photo for better resemblance
  imageName2: '',
  transformedImage: null, // AI-transformed Islamic attire image
  userName: '',
  greetingType: 'formal', // formal, funny, casual
  generatedText: '',
  isLoading: false,
  isTransforming: false, // Loading state for image transformation
  error: null,
  isGenerated: false,
  isTransformed: false, // Whether image has been transformed
  generationMode: 'realistic', // Mode selection: 'text-only', 'realistic', '3d', 'anime', 'painting'
  exportQuality: 'high', // Export quality: 'standard', 'high', 'ultra'
  exportFormat: 'png', // Export format: 'png', 'jpeg'
  
  // Credit & Subscription state
  credits: 0,
  isPremium: false,
  subscriptionEndDate: null,

  // Actions
  setUploadedImage: (image) => set({ uploadedImage: image }),

  setImageName: (name) => set({ imageName: name }),

  setUploadedImage2: (image) => set({ uploadedImage2: image }),

  setImageName2: (name) => set({ imageName2: name }),

  setTransformedImage: (image) => set({
    transformedImage: image,
    isTransformed: image !== null
  }),

  setUserName: (name) => set({ userName: name }),

  setGreetingType: (type) => set({ greetingType: type }),

  setGeneratedText: (text) => set({ generatedText: text, isGenerated: true }),

  setLoading: (loading) => set({ isLoading: loading }),

  setTransforming: (transforming) => set({ isTransforming: transforming }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setGenerationMode: (mode) => set({ generationMode: mode }),

  setExportQuality: (quality) => set({ exportQuality: quality }),

  setExportFormat: (format) => set({ exportFormat: format }),

  // Credit & Subscription actions
  setCredits: (credits) => set({ credits }),
  
  setIsPremium: (isPremium) => set({ isPremium }),
  
  setSubscriptionEndDate: (date) => set({ subscriptionEndDate: date }),

  consumeCredit: () => set((state) => ({ 
    credits: Math.max(0, state.credits - 1) 
  })),

  resetPoster: () => set({
    uploadedImage: null,
    imageName: '',
    uploadedImage2: null,
    imageName2: '',
    transformedImage: null,
    userName: '',
    greetingType: 'formal',
    generatedText: '',
    isLoading: false,
    isTransforming: false,
    error: null,
    isGenerated: false,
    isTransformed: false,
    generationMode: 'realistic',
    exportQuality: 'high',
    exportFormat: 'png',
  }),

  // Helper to get all state
  getState: () => get(),
}));

export default useAppStore;
