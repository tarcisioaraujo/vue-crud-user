<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Criar novo usuário</h2>
    <div class="card">
      <div class="card-header">
        <router-link class="btn btn-outline-info float-right" to="/"
          >Visualizar lista de usuários
        </router-link>
      </div>
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
              <option value="" selected>Selecione</option>
              <option
                v-for="profile in profiles"
                :key="profile.id"
                :value="profile.id"
              >
                {{ profile.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label htmlFor="profile_id">Endereços</label>
            <div class="container overflow-hidden bg-light p-3">
              <form>
                <div class="form-group">
                  <label htmlFor="name">Logradouro</label>
                  <input
                    v-model="address.street"
                    type="text"
                    class="form-control"
                    id="street"
                    name="street"
                  />
                </div>
                <div class="form-group">
                  <label htmlFor="name">CEP</label>
                  <input
                    v-model="address.cep"
                    type="text"
                    class="form-control"
                    id="cep"
                    name="cep"
                  />
                </div>
                <button
                  @click="handleSaveAddress()"
                  type="button"
                  class="btn btn-outline-primary mt-3"
                >
                  Cadastrar novo endereço
                </button>
              </form>
            </div>
            <div
              class="form-check"
              v-for="address in addresses"
              :key="address.id"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :value="address.id"
                v-model="user.addresses_ids"
                :id="address.id"
              />
              <label class="form-check-label" :for="address.id">
                {{ address.street }} (Cep: {{ address.cep }})
              </label>
              <button
                @click="handleDeleteAddress(address.id)"
                type="button"
                className="btn btn-outline-danger mx-3 btn-sm"
              >
                Excluir
              </button>
            </div>
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
        cpf: "",
        email: "",
        profile_id: "",
        addresses_ids: [],
      },
      address: {
        street: "",
        cep: "",
      },
      profiles: [],
      addresses: [],
      isSaving: false,
    };
  },
  created() {
    this.fetchProfileList();
    this.fetchAddressList();
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
    fetchAddressList() {
      axios
        .get("/api/address")
        .then((response) => {
          this.addresses = response.data.data;
          return response;
        })
        .catch((error) => {
          return error;
        });
    },
    handleSave() {
      this.isSaving = true;
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
          this.user.profile_id = "";
          this.user.addresses_ids = "";
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
    handleSaveAddress() {
      axios
        .post("/api/address", this.address)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Endereço persistido!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.address.street = "";
          this.address.cep = "";
          this.fetchAddressList();
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
    },
    handleDeleteAddress(id) {
      Swal.fire({
        title: "Tem certeza que deseja apagar o endereço?",
        text: "Não será possível reverter!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "sim, apagar!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/address/${id}`)
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Endereço apagado com sucesso!",
                showConfirmButton: false,
                timer: 1500,
              });
              this.fetchAddressList();
              return response;
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title:
                  "Não foi possível excluir o endereço! Ele pode ser o endereço de outro usuário.",
                showConfirmButton: false,
                timer: 1500,
              });
              return error;
            });
        }
      });
    },
  },
};
</script>
