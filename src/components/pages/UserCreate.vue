<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Criar novo usuário</h2>
    <div class="card">
      <div class="card-body">
        <form>
          <div class="form-group">
            <label htmlFor="name">Nome</label>
            <input
              v-model="user.name"
              type="text"
              class="form-control"
              id="name"
              name="name"
            />
          </div>
          <div class="form-group">
            <label htmlFor="name">CPF</label>
            <input
              v-model="user.cpf"
              type="text"
              class="form-control"
              id="cpf"
              name="cpf"
            />
          </div>
          <div class="form-group">
            <label htmlFor="name">E-mail</label>
            <input
              v-model="user.email"
              type="text"
              class="form-control"
              id="email"
              name="email"
            />
          </div>
          <div class="form-group">
            <label htmlFor="profile_id">Perfil</label>
            <select
              v-model="user.profile_id"
              id="profile_id"
              class="form-select"
            >
              <option
                v-for="profile in profiles"
                :key="profile.id"
                :value="profile.id"
              >
                {{ profile.name }}
              </option>
            </select>
          </div>
          <button
            @click="handleSave()"
            :disabled="isSaving"
            type="button"
            class="btn btn-outline-primary mt-3"
          >
            Salvar usuário
          </button>
        </form>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from "axios";
import LayoutDiv from "../LayoutDiv.vue";
import Swal from "sweetalert2";

export default {
  name: "UserCreate",
  components: {
    LayoutDiv,
  },
  data() {
    return {
      user: {
        name: "",
        cpf: 12345678932,
        email: "",
        profile_id: "",
        addresses_ids: [1, 2],
      },
      profiles: [],
      isSaving: false,
    };
  },
  created() {
    this.fetchProfileList();
  },
  methods: {
    fetchProfileList() {
      axios
        .get("/api/profiles")
        .then((response) => {
          this.profiles = response.data.data;
          return response;
        })
        .catch((error) => {
          return error;
        });
    },
    handleSave() {
      this.isSaving = true;
      console.log("this.user", this.user);
      axios
        .post("/api/registerUsers", this.user)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Usuário persistido!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.isSaving = false;
          this.user.name = "";
          this.user.cpf = "";
          this.user.email = "";
          return response;
        })
        .catch((error) => {
          this.isSaving = false;
          Swal.fire({
            icon: "error",
            title: "Ocorreu um erro!",
            showConfirmButton: false,
            timer: 1500,
          });
          return error;
        });
    },
  },
};
</script>
