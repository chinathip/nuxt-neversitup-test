<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Todo App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer app>
      <v-list dense>
        <v-list-item link :to="{ path: '/' }">
          <v-list-item-icon> <v-icon>mdi-home</v-icon> Home </v-list-item-icon>
        </v-list-item>
        <v-list-item link :to="{ path: '/todo/list' }">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon> Todos List
          </v-list-item-icon>
        </v-list-item>

        <v-list-item link :to="{ path: '/todo/create' }">
          <v-list-item-icon>
            <v-icon>mdi-plus-circle-outline</v-icon> Create Todos
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-h5">Create Todo</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="createTodo">
                  <v-text-field
                    label="Title"
                    v-model="title"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Description"
                    v-model="description"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-btn type="submit" color="primary">Create</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const title = ref<string>("");
const description = ref<string>("");
const router = useRouter();

const rules = {
  required: (v: string) => !!v || "Field is required",
};

const createTodo = async () => {
  const payload = {
    title: title.value,
    description: description.value,
  };

  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post("/api/todo", payload, { headers });

    if (response.data.isSuccess === true) {
      console.log("Todo created successfully");
      router.push("/todo/list"); // Redirect to the Todo list page or another page
    } else {
      console.error("Error creating todo:", response.data.message);
    }
  } catch (error) {
    console.error("Error during todo creation:", error);
  }
};
const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
