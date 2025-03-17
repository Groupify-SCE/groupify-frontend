import { BackendManager } from './backend.manager';

class AuthService extends BackendManager {
  static instance;

  constructor() {
    super('auth');
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(userData) {
    return this.sendRequest('register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  }

  async login(userData) {
    const response = await this.sendRequest('login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return response;
  }

  async status() {
    return this.sendRequest('status', {
      credentials: 'include',
      method: 'GET',
    });
  }

  async logout() {
    return this.sendRequest('logout', {
      credentials: 'include',
      method: 'POST',
    });
  }

  async forgotPassword(email) {
    return this.sendRequest('request-reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password, passwordConfirmation) {
    return this.sendRequest('reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password, passwordConfirmation }),
    });
  }
}

const authService = AuthService.getInstance();
export default authService;
