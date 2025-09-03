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
          <form class="row g-3">
            <div class="col-md-6">
              <label for="inputNome" class="form-label">Nome</label>
              <input
                v-model="filterText.name"
                type="text"
                class="form-control"
                id="name"
                name="name"
              />
            </div>
            <div class="col-md-6">
              <label for="inputCpf" class="form-label">CPF</label>
              <input
                v-model="filterText.cpf"
                type="number"
                class="form-control"
                id="cpf"
                name="cpf"
              />
            </div>
            <div class="col-md-6">
              <label for="inputStartDate" class="form-label">Início</label>
              <input
                v-model="filterText.startDate"
                type="date"
                class="form-control"
                id="startDate"
                name="startDate"
              />
            </div>
            <div class="col-md-6">
              <label for="inputEndDate" class="form-label">Fim</label>
              <input
                v-model="filterText.endDate"
                type="date"
                class="form-control"
                id="endDate"
                name="endDate"
              />
            </div>
            <div class="col-12">
              <button
                @click="fetchUserList()"
                type="button"
                class="btn btn-primary mb-3"
              >
                Filtrar
              </button>
            </div>
          </form>
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
      filterText: {
        name: null,
        cpf: "",
        startDate: "",
        endDate: "",
      },
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
          let responseUserData = response.data.data;
          if (this.filterText.name) {
            responseUserData = responseUserData.filter((user) =>
              user.name
                .toLowerCase()
                .includes(this.filterText.name.toLowerCase())
            );
          }

          if (this.filterText.cpf) {
            responseUserData = responseUserData.filter(
              (user) => user.cpf == this.filterText.cpf
            );
          }

          if (this.filterText.startDate) {
            const selectedStartDate = new Date(this.filterText.startDate);
            selectedStartDate.setDate(selectedStartDate.getDate() + 1);
            selectedStartDate.setHours(0, 0, 0, 0);
            responseUserData = responseUserData.filter((user) => {
              const userCreateDate = new Date(user.created_at);
              userCreateDate.setHours(0, 0, 0, 0);
              return userCreateDate.getTime() >= selectedStartDate.getTime();
            });
          }

          if (this.filterText.endDate) {
            const selectedEndDate = new Date(this.filterText.endDate);
            selectedEndDate.setDate(selectedEndDate.getDate() + 1);
            selectedEndDate.setHours(0, 0, 0, 0);
            responseUserData = responseUserData.filter((user) => {
              const userCreateDate = new Date(user.created_at);
              userCreateDate.setHours(0, 0, 0, 0);
              return userCreateDate.getTime() <= selectedEndDate.getTime();
            });
          }

          this.users = responseUserData;

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
                title: "Usuário apagado com sucesso!",
                showConfirmButton: false,
                timer: 1500,
              });
              this.fetchUserList();
              return response;
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Ocorreu um erro!",
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
