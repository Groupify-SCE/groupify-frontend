export class BackendManager {
  constructor(extension) {
    this.baseUrl = `http://localhost:3001/${extension}`;
  }

  async sendRequest(path, init) {
    try {
      const response = await fetch(`${this.baseUrl}/${path}`, init);
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
}
