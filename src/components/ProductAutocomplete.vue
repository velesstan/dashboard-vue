<template>
  <v-autocomplete
    :items="products"
    :loading="loading"
    :search-input.sync="searchTerm"
    @change="onSelect"
    return-object
    item-text="code"
    item-value="_id"
    placeholder="Поиск"
  >
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title>{{ data.item.code }}</v-list-item-title>
        <v-list-item-subtitle>{{ data.item.title }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import qs from "querystring";
import api from "@/plugins/api";
export default {
  name: "ProductAutocomplete",
  props: ["value"],
  data() {
    return {
      products: [],
      loading: false,
      select: this.value,
      searchTerm: "",
    };
  },
  watch: {
    searchTerm(val) {
      val && val !== this.select && this.search(val);
    },
  },
  methods: {
    async search(term) {
      this.loading = true;
      const query = qs.stringify({ code: term });
      const { data } = await api.get(`/api/products?${query}`);
      this.products = data;
      this.loading = false;
    },
    onSelect(value) {
      this.$emit("input", value);
    },
  },
};
</script>