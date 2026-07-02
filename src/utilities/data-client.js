import { settings } from "../config/settings.js";

export default class DataClient {
  #data = undefined;
  #url = "";

  constructor(resource) {
    this.#url = `${settings.BASE_API_URL}/${resource}`;
  }

  async add(data) {
    const success = await this.#addData(data);
    return success;
  }

  async listAll() {
    await this.#fetchData();
    return this.#data;
  }

  async removeById(id) {
    await this.#deleteData(id);
    return this.#data;
  }

  async login(data) {
    try {
      let response;
      const username = data.username;
      const password = data.password;

      const url = `${this.#url}?email=${username}`;
      response = await fetch(url);

      if (response.ok) {
        const result = await response.json();
        const user = result[0];

        if (user.password === password) {
          return user;
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id) {
    await this.#fetchData(id);
    return this.#data;
  }

  async #addData(data) {
    try {
      const response = await fetch(this.#url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 201) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async #fetchData(id = undefined) {
    try {
      let response;
      if (!id) {
        response = await fetch(this.#url);
      } else {
        const url = this.#url + "/" + id;
        response = await fetch(url);
      }

      if (response.ok) {
        const result = await response.json();
        this.#data = result;
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async #deleteData(id) {
    try {
      const url = this.#url + "/" + id;
      const response = await fetch(url, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${this.#url}/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return response.ok;
    } catch (error) {
      console.log(error);
    }
  }
}
