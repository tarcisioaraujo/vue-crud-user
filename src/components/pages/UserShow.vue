<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Visualizar usuário</h2>
    <div class="card">
      <div class="card-header">
        <router-link class="btn btn-outline-info float-right" to="/"
          >Visualizar todos usuários
        </router-link>
        <div class="card-body">
          <b className="text-muted">Data cadastro:</b>
          <p>{{ user.createdAt }}</p>
          <b className="text-muted">Name:</b>
          <p>{{ user.name }}</p>
          <b className="text-muted">CPF:</b>
          <p>{{ user.cpf }}</p>
          <b className="text-muted">E-mail:</b>
          <p>{{ user.email }}</p>
          <b className="text-muted">Perfil:</b>
          <p>{{ user.profileName }}</p>
          <div class="container overflow-hidden">
            <legend>Endereços</legend>
            <div
              class="row gx-5"
              v-for="address in user.addresses"
              :key="address.id"
            >
              <div class="col">
                <div class="p-3 border bg-light">
                  {{ address.street }} (Cep: {{ address.cep }})
                </div>
              </div>
            </div>
          </div>
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
  name: "UserShow",
  components: {
    LayoutDiv,
  },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    formatMyDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
        date
      );
    },
  },
  created() {
    const id = this.$route.params.id;
    axios
      .get(`/api/registerUsers/${id}`)
      .then((response) => {
        let userInfo = response.data.data;
        this.user.createdAt = this.formatMyDate(userInfo.created_at);
        this.user.name = userInfo.name;
        this.user.cpf = userInfo.cpf;
        this.user.email = userInfo.email;
        this.user.profileName = userInfo.profile.name;
        this.user.addresses = userInfo.address;
        return response;
      })
      .catch((error) => {
        console.log("erro", error);
        Swal.fire({
          icon: "error",
          title: "Ocorreu um erro!",
          showConfirmButton: false,
          timer: 1500,
        });
        return error;
      });
  },
};
</script>
