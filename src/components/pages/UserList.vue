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
                <th>Data cadastro</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ formatMyDate(user.created_at) }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.cpf }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.profile.name }}</td>
                <td>
                  <router-link
                    :to="`/show/${user.id}`"
                    class="btn btn-outline-info mx-1"
                    >Show</router-link
                  >
                  <router-link
                    :to="`/edit/${user.id}`"
                    class="btn btn-outline-success mx-1"
                    >Editar</router-link
                  >
                  <button
                    @click="handleDelete(user.id)"
                    className="btn btn-outline-danger mx-1"
                  >
                    Apagar
                  </button>
                </td>
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
import Swal from "sweetalert2";

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
          this.users = response.data.data;
          return response;
        })
        .catch((error) => {
          return error;
        });
    },
    handleDelete(id) {
      Swal.fire({
        title: "Tem certeza que deseja apagar o usuário?",
        text: "Não será possível reverter!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "sim, apagar!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/registerUsers/${id}`)
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "usuário apagado com sucesso!",
                showConfirmButton: false,
                timer: 1500,
              });
              this.fetchUserList();
              return response;
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "An Error Occured!",
                showConfirmButton: false,
                timer: 1500,
              });
              return error;
            });
        }
      });
    },
    formatMyDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
        date
      );
    },
  },
};
</script>
