const { snakeCase } = require('snake-case')
const Action = require('../../actions/action')
const ServerActionList = require('./serverActionList')
const SSHKey = require('../../sshKeys/sshKey')
const Image = require('../../images/image')
const ServerType = require('../../serverTypes/serverType')
const ISO = require('../../isos/iso')

class ServerActionsEndpoint {
  constructor(client) {
    this.client = client
  }

  async list(id, params) {
    const snakeCaseParams = {}
    if (params) {
      Object.keys(params).forEach(key => {
        snakeCaseParams[snakeCase(key)] = params[key]
      })
    }

    const response = await this.client.axios({
      url: '/servers/' + id + '/actions',
      method: 'GET',
      params: snakeCaseParams
    })

    // Make new Action objects
    const actions = []
    response.data.actions.forEach(action => actions.push(new Action(action)))

    // Return a list
    const meta = response.data.meta
    return new ServerActionList(this, params, meta, id, actions)
  }

  async get(serverID, actionID) {
    const response = await this.client.axios({
      url: '/servers/' + serverID + '/actions/' + actionID,
      method: 'GET'
    })

    // Return new Action instance
    return new Action(response.data.action)
  }

  async powerOn(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/poweron',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async powerOff(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/poweroff',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async reboot(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/reboot',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async reset(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/reset',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async shutdown(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/shutdown',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async resetPassword(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/reset_password',
      method: 'POST'
    })

    return {
      rootPassword: response.data.root_password,
      action: new Action(response.data.action)
    }
  }

  async enableRescue(id, type = 'linux64', sshKeys = []) {
    const sshKeyIDs = []
    for (let i = 0; i < sshKeys.length; i++) {
      if (sshKeys[i] instanceof SSHKey) {
        sshKeyIDs.push(sshKeys[i].id)
      } else {
        sshKeyIDs.push(sshKeys[i])
      }
    }

    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/enable_rescue',
      method: 'POST',
      data: {
        type,
        ssh_keys: sshKeyIDs
      }
    })

    return {
      rootPassword: response.data.root_password,
      action: new Action(response.data.action)
    }
  }

  async disableRescue(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/disable_rescue',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async createImage(id, type = 'snapshot', description) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/create_image',
      method: 'POST',
      data: {
        type,
        description
      }
    })

    return {
      image: new Image(this.client.images, response.data.image),
      action: new Action(response.data.action)
    }
  }

  async rebuild(id, image) {
    let imageID = image
    if (image instanceof Image) {
      imageID = image.id
    }

    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/rebuild',
      method: 'POST',
      data: {
        image: imageID
      }
    })

    return {
      rootPassword: response.data.root_password,
      action: new Action(response.data.action)
    }
  }

  async changeType(id, serverType, upgradeDisk = true) {
    let serverTypeID = serverType
    if (serverType instanceof ServerType) {
      serverTypeID = serverType.id
    }

    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/change_type',
      method: 'POST',
      data: {
        server_type: serverTypeID,
        upgrade_disk: upgradeDisk
      }
    })

    return new Action(response.data.action)
  }

  async enableBackup(id, backupWindow) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/enable_backup',
      method: 'POST',
      data: {
        backup_window: backupWindow
      }
    })

    return new Action(response.data.action)
  }

  async disableBackup(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/disable_backup',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async attachISO(id, iso) {
    let isoID = iso
    if (iso instanceof ISO) {
      isoID = iso.id
    }

    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/attach_iso',
      method: 'POST',
      data: {
        iso: isoID
      }
    })

    return new Action(response.data.action)
  }

  async detachISO(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/detach_iso',
      method: 'POST'
    })

    return new Action(response.data.action)
  }

  async changeDnsPointer(id, ip, pointer = null) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/change_dns_ptr',
      method: 'POST',
      data: {
        ip,
        dns_ptr: pointer
      }
    })

    return new Action(response.data.action)
  }

  async changeProtection(id, data) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/change_protection',
      method: 'POST',
      data
    })

    return new Action(response.data.action)
  }

  async requestConsole(id) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/request_console',
      method: 'POST'
    })

    return {
      wssUrl: response.data.wss_url,
      password: response.data.password,
      action: new Action(response.data.action)
    }
  }

  async attachToNetwork(id, networkId, ip, aliasIps) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/attach_to_network',
      method: 'POST',
      data: {
        network: networkId,
        ip,
        alias_ips: aliasIps
      }
    })

    return new Action(response.data.action)
  }

  async detachFromNetwork(id, networkId) {
    const response = await this.client.axios({
      url: '/servers/' + id + '/actions/detach_from_network',
      method: 'POST',
      data: {
        network: networkId
      }
    })

    return new Action(response.data.action)
  }
}

module.exports = ServerActionsEndpoint
