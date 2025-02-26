export abstract class BackendManager {
  private baseUrl: string;

  constructor(extension: string) {
    this.baseUrl = `http://localhost:3001/${extension}`;
  }

  protected async sendRequest(path: string, init?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}/${path}`, init);
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
}