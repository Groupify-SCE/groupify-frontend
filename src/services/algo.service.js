import { BackendManager } from './backend.manager';

class AlgoService extends BackendManager {
  static instance;

  constructor() {
    super('algorithm');
  }

  static getInstance() {
    if (!AlgoService.instance) {
      AlgoService.instance = new AlgoService();
    }
    return AlgoService.instance;
  }

  async runAlgorithm(projectId) {
    return await this.sendRequest(`${projectId}`, {
      credentials: 'include',
      method: 'PUT',
    });
  }

  async getAlgorithmResults(projectId) {
    return await this.sendRequest(`${projectId}`, {
      credentials: 'include',
      method: 'GET',
    });
  }
}

const algoService = AlgoService.getInstance();
export default algoService;
