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
          <v-col>
            <v-card>
              <v-card-title class="text-h5">Todo List</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="sortedTodos"
                  item-key="title"
                >
                  <template v-slot:item.updated_at="{ item }">
                    <td>{{ formatDate(item.updated_at) }}</td>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon @click="openDialog(item.id)" color="blue"
                      >mdi-pencil</v-icon
                    >
                    <v-icon @click="confirmDelete(item.id)" color="red"
                      >mdi-delete</v-icon
                    >
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteTodo">Yes</v-btn>
          <v-btn color="red darken-1" text @click="cancelDelete">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface Todo {
  id: string;
  title: string;
  description: string;
  updated_at: string;
}
const todos = ref<Todo>([]);
const router = useRouter();
const todoIdToDelete = ref<string | null>(null);
const showConfirmDialog = ref(false);

const headers = [
  { text: "Title", value: "title" },
  { text: "Description", value: "description" },
  { text: "Updated At", value: "updated_at" },
  { text: "Actions", value: "actions", sortable: false },
];

const formatDate = (dateStr) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const confirmDelete = (id: string) => {
  todoIdToDelete.value = id;
  showConfirmDialog.value = true;
};

const cancelDelete = () => {
  showConfirmDialog.value = false;
};

const deleteTodo = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    await axios.delete(`/api/todo/${todoIdToDelete.value}`, { headers });
    cancelDelete();
    fetchTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

const openDialog = (id: string) => {
  router.push(`/todo/edit/${id}`);
};

const fetchTodos = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`/api/todo`, {
      headers,
    });
    if (response.data.isSuccess === true) {
      todos.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Call fetchTodos when the component is mounted
fetchTodos();

const sortedTodos = computed(() => {
  return todos.value
    .slice()
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
});

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
<style scoped>
.v-data-table {
  max-width: 100%;
  overflow-x: auto;
}

.v-data-table .v-data-table__cell {
  font-size: 14px; /* ปรับขนาดฟอนต์ */
  padding: 8px; /* ปรับระยะห่างภายในเซลล์ */
}

.v-data-table .v-data-table__column--actions {
  width: 100px; /* ตั้งค่าความกว้างของคอลัมน์ actions */
}
</style>
