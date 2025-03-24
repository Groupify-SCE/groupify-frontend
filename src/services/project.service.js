import { BackendManager } from './backend.manager';

class ProjectService extends BackendManager {
  static instance;

  constructor() {
    super('projects');
  }

  static getInstance() {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async create() {
    return await this.sendRequest('create', {
      credentials: 'include',
      method: 'POST',
    });
  }

  async getAll() {
    return await this.sendRequest('get-all', {
      credentials: 'include',
      method: 'GET',
    });
  }

  async delete(projectId) {
    return await this.sendRequest(`delete/${projectId}`, {
      credentials: 'include',
      method: 'DELETE',
    });
  }

  async get(projectId) {
    return await this.sendRequest(`get/${projectId}`, {
      credentials: 'include',
      method: 'GET',
    });
  }

  async update(projectId, name, participants, group_size) {
    return await this.sendRequest(`update`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        name,
        participants: Number(participants),
        group_size: Number(group_size),
      }),
    });
  }
}

const projectService = ProjectService.getInstance();
export default projectService;
