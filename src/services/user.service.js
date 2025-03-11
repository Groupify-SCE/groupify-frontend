import { BackendManager } from './backend.manager';

class UserService extends BackendManager {
  static instance;

  constructor() {
    super('user');
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async userInfo() {
    return this.sendRequest('', {
      credentials: 'include',
      method: 'GET',
    });
  }
}

const userService = UserService.getInstance();
export default userService;
