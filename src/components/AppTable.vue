<template>
  <v-data-table
    v-bind="$attrs"
    :headers="computedHeaders"
    :items="items"
    :sort-by="[{ key: 'id', order: 'asc' }]"
    class="elevation-1"
  >
    <template #top>
      <v-toolbar :flat="true">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" :inset="true" :vertical="true" />
        <v-spacer />
        <!--        <v-dialog v-model="dialog" max-width="500px">-->
        <!--          <template v-slot:activator="{ props }">-->
        <v-btn color="primary" dark class="mb-2" @click="emit('click:add')">
          New Item
        </v-btn>
        <!--          </template>-->
        <!--          <v-card>-->
        <!--            <v-card-title>-->
        <!--              <span class="text-h5">{{ formTitle }}</span>-->
        <!--            </v-card-title>-->

        <!--            <v-card-text>-->
        <!--              <v-container>-->
        <!--                <v-row>-->
        <!--                  <v-col cols="12" sm="6" md="4">-->
        <!--                    <v-text-field-->
        <!--                      v-model="editedItem.name"-->
        <!--                      label="Dessert name"-->
        <!--                    ></v-text-field>-->
        <!--                  </v-col>-->
        <!--                  <v-col cols="12" sm="6" md="4">-->
        <!--                    <v-text-field-->
        <!--                      v-model="editedItem.calories"-->
        <!--                      label="Calories"-->
        <!--                    ></v-text-field>-->
        <!--                  </v-col>-->
        <!--                  <v-col cols="12" sm="6" md="4">-->
        <!--                    <v-text-field-->
        <!--                      v-model="editedItem.fat"-->
        <!--                      label="Fat (g)"-->
        <!--                    ></v-text-field>-->
        <!--                  </v-col>-->
        <!--                  <v-col cols="12" sm="6" md="4">-->
        <!--                    <v-text-field-->
        <!--                      v-model="editedItem.carbs"-->
        <!--                      label="Carbs (g)"-->
        <!--                    ></v-text-field>-->
        <!--                  </v-col>-->
        <!--                  <v-col cols="12" sm="6" md="4">-->
        <!--                    <v-text-field-->
        <!--                      v-model="editedItem.protein"-->
        <!--                      label="Protein (g)"-->
        <!--                    ></v-text-field>-->
        <!--                  </v-col>-->
        <!--                </v-row>-->
        <!--              </v-container>-->
        <!--            </v-card-text>-->

        <!--            <v-card-actions>-->
        <!--              <v-spacer></v-spacer>-->
        <!--              <v-btn color="blue-darken-1" variant="text" @click="close">-->
        <!--                Cancel-->
        <!--              </v-btn>-->
        <!--              <v-btn color="blue-darken-1" variant="text" @click="save">-->
        <!--                Save-->
        <!--              </v-btn>-->
        <!--            </v-card-actions>-->
        <!--          </v-card>-->
        <!--        </v-dialog>-->
        <!--        <v-dialog v-model="dialogDelete" max-width="500px">-->
        <!--          <v-card>-->
        <!--            <v-card-title class="text-h5"-->
        <!--              >Are you sure you want to delete this item?</v-card-title-->
        <!--            >-->
        <!--            <v-card-actions>-->
        <!--              <v-spacer></v-spacer>-->
        <!--              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"-->
        <!--                >Cancel</v-btn-->
        <!--              >-->
        <!--              <v-btn-->
        <!--                color="blue-darken-1"-->
        <!--                variant="text"-->
        <!--                @click="deleteItemConfirm"-->
        <!--                >OK</v-btn-->
        <!--              >-->
        <!--              <v-spacer></v-spacer>-->
        <!--            </v-card-actions>-->
        <!--          </v-card>-->
        <!--        </v-dialog>-->
        <template v-if="$slots['toolbar-extension']" #extension>
          <slot name="toolbar-extension" />
        </template>
      </v-toolbar>
    </template>
    <!-- this allow to overwrite all slots -->
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.logoUrl="{ item }">
      <v-avatar v-if="item.logoUrl" color="grey-lighten-4" class="border-solid">
        <v-img
          :cover="true"
          :src="item.logoUrl"
          :alt="`logo-url-${item.name}`"
        ></v-img>
      </v-avatar>
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="emit('click:edit:item', item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="emit('click:delete:item', item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  items: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["click:add", "click:delete:item", "click:edit:item"]);

// const dialog = ref(false);
// const dialogDelete = ref(false);

const computedHeaders = computed(() => {
  return [
    ...props.headers,
    { title: "Actions", key: "actions", sortable: false },
  ];
});
// const editedIndex = ref(-1);
// const editedItem = ref({
//   name: "",
//   calories: 0,
//   fat: 0,
//   carbs: 0,
//   protein: 0,
// });
// const defaultItem = ref({
//   name: "",
//   calories: 0,
//   fat: 0,
//   carbs: 0,
//   protein: 0,
// });
// const formTitle = computed(() => {
//   return editedIndex.value === -1 ? "New Item" : "Edit Item";
// });
// function editItem(item) {
//   // editedIndex.value = desserts.value.indexOf(item);
//   editedItem.value = Object.assign({}, item);
//   dialog.value = true;
// }
// function deleteItem(item) {
//   // editedIndex.value = desserts.value.indexOf(item);
//   editedItem.value = Object.assign({}, item);
//   dialogDelete.value = true;
// }
// function deleteItemConfirm() {
//   // desserts.value.splice(editedIndex.value, 1);
//   closeDelete();
// }
// function close() {
//   dialog.value = false;
//   nextTick(() => {
//     editedItem.value = Object.assign({}, defaultItem.value);
//     editedIndex.value = -1;
//   });
// }
// function closeDelete() {
//   dialogDelete.value = false;
//   nextTick(() => {
//     editedItem.value = Object.assign({}, defaultItem.value);
//     editedIndex.value = -1;
//   });
// }
// function save() {
//   // if (editedIndex.value > -1) {
//   //   Object.assign(desserts.value[editedIndex.value], editedItem.value);
//   // } else {
//   //   desserts.value.push(editedItem.value);
//   // }
//   close();
// }
// watch(dialog, (val) => {
//   val || close();
// });
// watch(dialogDelete, (val) => {
//   val || closeDelete();
// });
</script>

<style scoped></style>
