<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3">Visualizar usuário</h2>
    <div class="card">
      <div class="card-header">
        <router-link class="btn btn-outline-info float-right" to="/"
          >Visualizar todos usuários
        </router-link>
        <div class="card-body">
          <b className="text-muted">Name:</b>
          <p>{{ user.name }}</p>
          <b className="text-muted">CPF:</b>
          <p>{{ user.cpf }}</p>
          <b className="text-muted">E-mail:</b>
          <p>{{ user.email }}</p>
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
      user: {
        name: "",
        cpf: "",
        email: "",
      },
      isSaving: false,
    };
  },
  created() {
    const id = this.$route.params.id;
    axios
      .get(`/api/registerUsers/${id}`)
      .then((response) => {
        let userInfo = response.data.data;
        this.user.name = userInfo.name;
        this.user.cpf = userInfo.cpf;
        this.user.email = userInfo.email;
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
  methods: {},
};
</script>
