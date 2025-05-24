import { BackendManager } from './backend.manager';

class HealthService extends BackendManager {
  static instance;

  constructor() {
    super('');
  }

  static getInstance() {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  /**
   * Check if the backend is alive and responsive
   * @returns {Promise<boolean>} - True if backend is healthy, false otherwise
   */
  async checkBackendHealth() {
    try {
      const response = await this.sendRequest('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Consider the backend healthy if we get any response (even 404 is better than no response)
      return response.status < 500;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Wait for backend to be healthy with retry logic
   * @param {number} maxRetries - Maximum number of retry attempts
   * @param {number} retryDelay - Delay between retries in milliseconds
   * @returns {Promise<boolean>} - True if backend becomes healthy, false if all retries exhausted
   */
  async waitForBackendHealth(maxRetries = 10, retryDelay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const isHealthy = await this.checkBackendHealth();
      if (isHealthy) {
        return true;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    return false;
  }
}

const healthService = HealthService.getInstance();
export default healthService;
