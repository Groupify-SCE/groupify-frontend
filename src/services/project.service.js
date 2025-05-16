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

  async addCriterion(projectId) {
    return await this.sendRequest(`criteria/add/${projectId}`, {
      credentials: 'include',
      method: 'POST',
    });
  }

  async getAllCriteria(projectId) {
    return await this.sendRequest(`criteria/get-all/${projectId}`, {
      credentials: 'include',
      method: 'GET',
    });
  }

  async deleteCriterion(criterionId) {
    return await this.sendRequest(`criteria/delete/${criterionId}`, {
      credentials: 'include',
      method: 'DELETE',
    });
  }

  async updateCriteria(criterionId, name, range) {
    return await this.sendRequest(`criteria/update`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        criterionId,
        name,
        range,
      }),
    });
  }

  async addParticipant(projectId, firstName, lastName, tz) {
    return await this.sendRequest('participants/add', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, firstName, lastName, tz }),
    });
  }

  async getAllParticipants(projectId) {
    return await this.sendRequest(`participants/get-all/${projectId}`, {
      credentials: 'include',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getParticipantCriteria(participantId) {
    const res = await this.sendRequest(
      `participants/criteria/get/${participantId}`,
      {
        credentials: 'include',
        method: 'GET',
      }
    );

    return await res.json();
  }

  async submitParticipantCriteria(participantId, criteria) {
    return await this.sendRequest(
      `participants/criteria/update/${participantId}`,
      {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ criteria }),
      }
    );
  }
}

const projectService = ProjectService.getInstance();
export default projectService;
