import { BackendManager } from './backend.manager';
import Cookies from 'js-cookie';

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
    });
    if (response.headers.get('Authorization')) {
      Cookies.set('Authorization', response.headers.get('Authorization'), {
        expires: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return response;
  }

  async status() {
    return this.sendRequest('status', {
      credentials: 'include',
      method: 'GET',
    });
  }

  async logout() {
    Cookies.remove('Authorization');
  }
}

const authService = AuthService.getInstance();
export default authService;
