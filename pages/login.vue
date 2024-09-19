<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                label="Username"
                v-model="username"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                label="Password"
                v-model="password"
                :rules="[rules.required]"
                type="password"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface LoginResponse {
  access_token: string;
}

const router = useRouter();

const username = ref("");
const password = ref("");

const rules = {
  required: (v) => !!v || "Field is required",
};

const login = async () => {
  const payload = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await axios.post<LoginResponse>(
      "/api/auth/login",
      payload
    );

    console.log("response", response);
    if (response.status === 201) {
      const data = response.data;
      console.log("Login successful:", data);
      localStorage.setItem("token", data.access_token);

      router.push("/todo/list");
    } else {
      console.error("Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
