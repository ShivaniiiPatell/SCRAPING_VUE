<template>
  <v-container>
    <v-form @submit.prevent="submitUrl" class="pb-50">
      <v-row align="center" justify="start" class="align-center">
        <v-col cols="8">
          <v-text-field
            v-model="url"
            label="Enter domain name"
            required
            class="pa-2"
            outlined
            style="height: 56px"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn
            type="submit"
            color="purple darken-2"
            class="full-height"
            style="height: 56px"
          >
            Fetch & Save Details
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="start" class="align-center">
        <v-col cols="1"> {{ selectedRowsCount }} Selected </v-col>
        <v-col cols="2">
          <v-btn @click="deleteSelected" color="red darken-2">
            Delete Selected
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-btn @click="downloadCSV" color="red darken-2">Download CSV</v-btn>
        </v-col>
      </v-row>
      <br />
    </v-form>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-circular>
    <v-card v-if="!loading && scrapedData.length">
      <v-data-table
        :headers="headers"
        :items="scrapedData"
        :items-per-page="10"
        item-key="_id"
        class="elevation-1 custom-row-height"
        show-select
        fixed-header
      >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item._id">
              <td class="text-center">
                <v-checkbox
                  :value="isSelected(item)"
                  @change="toggleSelection(item)"
                  class="ma-0"
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.description }}</td>
              <td class="text-center">
                <v-img
                  :src="item.companyLogo"
                  alt="Company Logo"
                  max-height="50"
                  max-width="50"
                ></v-img>
              </td>
              <td class="text-center">
                <v-icon @click="redirectToUrl(item.facebookURL)"
                  >mdi-facebook</v-icon
                >
                <v-icon @click="redirectToUrl(item.linkedinURL)"
                  >mdi-linkedin</v-icon
                >
                <v-icon @click="redirectToUrl(item.twitterURL)"
                  >mdi-twitter</v-icon
                >
                <v-icon @click="redirectToUrl(item.instagramURL)"
                  >mdi-instagram</v-icon
                >
              </td>
              <td class="text-center">{{ item.address }}</td>
              <td class="text-center">{{ item.phoneNumber }}</td>
              <td class="text-center">{{ item.email }}</td>
              <td class="text-center">
                <router-link :to="`/detail/${item._id}`">
                  <v-btn x-small outlined color="black">View Details</v-btn>
                </router-link>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      url: "",
      scrapedData: [],
      headers: [
        { text: "Name", align: "center", width: "150px", value: "name" },
        {
          text: "Description",
          align: "center",
          width: "150px",
          value: "description",
        },
        {
          text: "Company Logo",
          align: "center",
          width: "150px",
          value: "companyLogo",
        },
        {
          text: "Social Media",
          align: "center",
          width: "150px",
          value: "socialMedia",
        },
        { text: "Address", align: "center", width: "150px", value: "address" },
        {
          text: "Phone Number",
          align: "center",
          width: "150px",
          value: "phoneNumber",
        },
        { text: "Email", align: "center", width: "150px", value: "email" },
        { text: "Actions", align: "center", width: "150px", value: "actions" },
      ],
      selectedRows: [],
      selectedRowsCount: 0,
      loading: false,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        console.log("url------------", this.url);
        const response = await axios.post(
          "https://scraping-node-gfcl.onrender.com/api/scrape",
          { url: this.url },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          this.scrapedData = response.data;
          console.log("Fetched data:", this.scrapedData);
        } else {
          console.error("Unexpected response format:", response.data);
          this.scrapedData = [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(
          "Error fetching data. Please check the console for more details."
        );
        this.scrapedData = [];
      } finally {
        this.loading = false;
      }
    },
    submitUrl() {
      this.fetchData();
    },
    toggleSelection(item) {
      if (item && item._id) {
        const index = this.selectedRows.indexOf(item._id);
        if (index === -1) {
          this.selectedRows.push(item._id);
        } else {
          this.selectedRows.splice(index, 1);
        }
        this.selectedRowsCount = this.selectedRows.length;
      }
    },
    isSelected(item) {
      return this.selectedRows.includes(item._id);
    },
    async deleteSelected() {
      try {
        await axios.post(
          "https://scraping-node-gfcl.onrender.com/api/scrape/deleteItems",
          {
            ids: this.selectedRows,
          }
        );

        this.fetchData();
        this.selectedRows = [];
      } catch (error) {
        console.error("Error deleting items:", error);
        alert(
          "Error deleting items. Please check the console for more details."
        );
      }
    },
    downloadCSV() {
      const headers = this.headers.map((header) => header.text);
      const rows = this.scrapedData.map((item) => [
        item.name,
        item.description,
        item.companyLogo,
        item.facebookURL,
        item.linkedinURL,
        item.twitterURL,
        item.instagramURL,
        item.address,
        item.phoneNumber,
        item.email,
      ]);

      let csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        rows.map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "scraped_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    redirectToUrl(url) {
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}

.custom-row-height .v-data-table__wrapper tr {
  height: 100px;
}
.text-center {
  text-align: center;
}

.selected-row {
  background-color: lightblue;
}
</style>
