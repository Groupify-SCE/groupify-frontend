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
    return this.sendRequest('login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  }
}

const authService = AuthService.getInstance();
export default authService;
