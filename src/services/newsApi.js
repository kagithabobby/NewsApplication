const API_KEY = '76df3e36d94745ad8c45d37c8e1034dc';
const BASE_URL = 'https://newsapi.org/v2';

// Valid categories for NewsAPI.org
const VALID_CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
];

// Request queue to manage API calls
let requestQueue = [];
let isProcessingQueue = false;
const MIN_DELAY = 2000; // 2 seconds between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for storing API responses
const responseCache = new Map();

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  try {
    const data = await response.json();
    console.log('API Response Status:', response.status);

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    if (data.status === 'error') {
      throw new Error(data.message || 'API returned an error');
    }

    if (!data.articles) {
      throw new Error('Invalid API response format: missing articles field');
    }
    
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Error parsing API response:', error);
      throw new Error('Invalid JSON response from API');
    }
    console.error('API Response Error:', error);
    throw error;
  }
};

// Process the request queue
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const { url, resolve, reject, retryCount = 0 } = requestQueue.shift();
    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': API_KEY,
          'Accept': 'application/json'
        }
      });
      const data = await handleApiResponse(response);
      resolve(data);
    } catch (error) {
      console.error(`API request failed (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
      if (error.message.includes('Rate limit exceeded') && retryCount < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying in ${RETRY_DELAY * (retryCount + 1)}ms`);
        await delay(RETRY_DELAY * (retryCount + 1));
        requestQueue.push({ url, resolve, reject, retryCount: retryCount + 1 });
      } else {
        reject(error);
      }
    }
    await delay(MIN_DELAY);
  }
  isProcessingQueue = false;
};

// Helper function to make API requests with retries
const makeApiRequest = async (url) => {
  if (!url) {
    throw new Error('URL is required for API request');
  }

  return new Promise((resolve, reject) => {
    requestQueue.push({ url, resolve, reject });
    processQueue();
  });
};

// Helper function to get cached data
const getCachedData = (key) => {
  const cachedData = responseCache.get(key);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const getTopHeadlines = async () => {
  try {
    const cacheKey = 'headlines-home';
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Get general headlines without category
    const url = `${BASE_URL}/top-headlines?country=us&apiKey=${API_KEY}`;
    console.log('Fetching headlines from:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    console.log('API Response:', data);

    if (data.status !== 'ok') {
      throw new Error(data.message || 'API returned an error');
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from API');
    }

    const validArticles = data.articles.filter(article => 
      article && article.title && article.url
    );

    setCachedData(cacheKey, validArticles);
    return validArticles;
  } catch (error) {
    console.error('Error in getTopHeadlines:', error);
    throw error;
  }
};

export const getNewsByCategory = async (category) => {
  try {
    if (!category) {
      throw new Error('Category is required');
    }

    // Validate category
    const normalizedCategory = category.toLowerCase();
    if (!VALID_CATEGORIES.includes(normalizedCategory)) {
      throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }

    const cacheKey = `category-${normalizedCategory}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const url = `${BASE_URL}/top-headlines?country=us&category=${normalizedCategory}&apiKey=${API_KEY}`;
    console.log('Fetching category news from:', url);
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'API returned an error');
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from API');
    }

    const validArticles = data.articles.filter(article => 
      article && article.title && article.url
    );

    setCachedData(cacheKey, validArticles);
    return validArticles;
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    throw error;
  }
};

export const searchNews = async (query) => {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const cacheKey = `search-${query}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) return cachedData;

    const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;
    console.log('Searching news with URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'API returned an error');
    }

    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from API');
    }

    const validArticles = data.articles.filter(article => 
      article && article.title && article.url
    );

    setCachedData(cacheKey, validArticles);
    return validArticles;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};