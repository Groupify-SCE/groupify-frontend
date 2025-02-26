import { UserRegisterData } from "../components/types/auth.types";
import { BackendManager } from "./backend.manager";

class AuthService extends BackendManager {

  private static instance: AuthService;

  private constructor() {
    super('auth');
  }

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signup(userData: UserRegisterData) {
    return this.sendRequest('signup', {
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
