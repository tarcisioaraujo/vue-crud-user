<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mt-5 mb-3">Lista de usuários</h2>
      <div class="card">
        <div class="card-header">
          <router-link to="/create" class="btn btn-outline-primary">
            Criar novo usuário
          </router-link>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from "axios";
import LayoutDiv from "../LayoutDiv.vue";

export default {
  name: "UserList",
  components: {
    LayoutDiv,
  },
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.fetchUserList();
  },
  methods: {
    fetchUserList() {
      axios
        .get("/api/registerUsers")
        .then((response) => {
          console.log("response.data", response.data);
          this.users = response.data.data;
          return response;
        })
        .catch((error) => {
          return error;
        });
    },
  },
};
</script>
