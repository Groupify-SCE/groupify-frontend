export class BackendManager {
  constructor(extension) {
    this.baseUrl = `${process.env.REACT_APP_API_URL}/${extension}`;
  }

  async sendRequest(path, init) {
    try {
      const response = await fetch(
        `${this.baseUrl}${path.length > 0 ? `/${path}` : ''}`,
        init
      );
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }
}
