import axios from 'axios'

/**
 * Class for creating new http connection and fetching server params
 * @class HttpClient
 */
export class HttpClient {
  /**
   * Gets Roschat server config
   * @param {string} url - ip address of Roschat server
   * @returns {Promise}
   * @memberof HttpClient
   */
  async getServerConfig (url: string): Promise<any> {
    const res = await axios.get(`${url}/ajax/config.json`)
    return res.data
  }
}
