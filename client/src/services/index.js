import api from "./api";

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put("/auth/settings", settings);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

// Deck Services
export const deckService = {
  getMyDecks: async () => {
    const response = await api.get("/decks/my");
    return response.data;
  },

  getPublicDecks: async () => {
    const response = await api.get("/decks/public");
    return response.data;
  },

  getDeckById: async (deckId) => {
    const response = await api.get(`/decks/${deckId}`);
    return response.data;
  },

  createDeck: async (deckData) => {
    const response = await api.post("/decks", deckData);
    return response.data;
  },

  updateDeck: async (deckId, deckData) => {
    const response = await api.put(`/decks/${deckId}`, deckData);
    return response.data;
  },

  deleteDeck: async (deckId) => {
    const response = await api.delete(`/decks/${deckId}`);
    return response.data;
  },
};

// Card Services
export const cardService = {
  getCardsByDeck: async (deckId) => {
    const response = await api.get(`/cards/byDeck/${deckId}`);
    return response.data;
  },

  getCardById: async (cardId) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },

  createCard: async (cardData) => {
    const response = await api.post("/cards", cardData);
    return response.data;
  },

  updateCard: async (cardId, cardData) => {
    const response = await api.put(`/cards/${cardId}`, cardData);
    return response.data;
  },

  deleteCard: async (cardId) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
  },
};

// Study Services
export const studyService = {
  getStudySession: async (limit = 50, deckId = null) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (deckId) params.append("deckId", deckId);
    const response = await api.get(`/study/session?${params.toString()}`);
    return response.data;
  },

  reviewCard: async (cardId, grade) => {
    const response = await api.post(`/study/review/${cardId}`, { grade });
    return response.data;
  },

  getStudyStats: async () => {
    const response = await api.get("/study/stats");
    return response.data;
  },
};

// System Deck Services
export const systemDeckService = {
  getSystemDecks: async (language, level) => {
    const params = new URLSearchParams();
    if (language) params.append("language", language);
    if (level) params.append("level", level);
    const response = await api.get(`/system-decks?${params.toString()}`);
    return response.data;
  },

  getSystemDeckById: async (systemDeckId) => {
    const response = await api.get(`/system-decks/${systemDeckId}`);
    return response.data;
  },

  copySystemDeck: async (systemDeckId) => {
    const response = await api.post(`/system-decks/${systemDeckId}/copy`);
    return response.data;
  },
};
