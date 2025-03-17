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
    return await this.sendRequest('', {
      credentials: 'include',
      method: 'GET',
    });
  }

  async editUser(updateData, userId) {
    return await this.sendRequest(`/edit`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  }
}

const userService = UserService.getInstance();
export default userService;
