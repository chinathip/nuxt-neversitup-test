<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Edit Todo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer app>
      <v-list dense>
        <v-list-item link :to="{ path: '/' }">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/todo/list' }">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Todos List</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/todo/create' }">
          <v-list-item-icon>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Create Todos</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-card>
          <v-card-title class="text-h5">Edit Todo</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="updateTodo">
              <v-text-field
                v-model="todo.title"
                label="Title"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="todo.description"
                label="Description"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-btn type="submit" color="primary">Update</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

interface Todo {
  title: string;
  description: string;
}

const router = useRouter();
const route = useRoute();

const todo = ref<Todo>({
  title: "",
  description: "",
});

const rules = {
  required: (v: string) => !!v || "Field is required",
};

const fetchTodo = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    //console.log("routerouterouteroute", route);
    const { id } = route.params as string;
    const response = await axios.get(`/api/todo/${id}`, { headers });
    console.log("response", response.data.data.title);
    if (response.data.isSuccess) {
      todo.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
  }
};

const updateTodo = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { id } = route.params as string;
    const response = await axios.patch(`/api/todo/${id}`, todo.value, {
      headers,
    });
    if (response.data.isSuccess) {
      router.push("/todo/list");
    }
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

// Call fetchTodo when the component is mounted
onMounted(fetchTodo);
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
