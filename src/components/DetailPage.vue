<template>
  <v-container>
    <v-btn @click="goHome" color="purple darken-2" class="mb-10">
      <v-icon left>mdi-home</v-icon> Home
    </v-btn>
    <br />
    <v-card>
      <v-card-title>
        <v-icon left class="mr-2">mdi-web</v-icon>
        {{ item.name }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="text-center">
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-if="!loading">
          <v-col cols="6">
            <p><strong>Description:</strong> {{ item.description }}</p>
          </v-col>
          <v-col cols="6" class="text-right">
            <p><strong>Phone Number:</strong> {{ item.phoneNumber }}</p>
            <p><strong>Email:</strong> {{ item.email }}</p>
          </v-col>
        </v-row>
        <v-row v-if="!loading">
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-icon left>mdi-facebook</v-icon>
                <strong>Facebook URL:</strong>
              </v-col>
              <v-col cols="12">
                <a :href="item.facebookURL">{{ item.facebookURL }}</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-icon left>mdi-linkedin</v-icon>
                <strong>LinkedIn URL:</strong>
              </v-col>
              <v-col cols="12">
                <a :href="item.linkedinURL">{{ item.linkedinURL }}</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-icon left>mdi-twitter</v-icon>
                <strong>Twitter URL:</strong>
              </v-col>
              <v-col cols="12">
                <a :href="item.twitterURL">{{ item.twitterURL }}</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-icon left>mdi-instagram</v-icon>
                <strong>Instagram URL:</strong>
              </v-col>
              <v-col cols="12">
                <a :href="item.instagramURL">{{ item.instagramURL }}</a>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" class="text-right">
            <img v-if="screenshot" :src="screenshot" alt="Website Screenshot" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "DetailPage",
  props: ["id"],
  data() {
    return {
      item: {},
      url: "",
      screenshot: null,
      loading: false,
    };
  },
  mounted() {
    this.fetchItemDetails();
  },
  methods: {
    async fetchItemDetails() {
      this.loading = true;
      try {
        console.log(this.id);
        const response = await axios.get(
          `https://scraping-node-gfcl.onrender.com/api/scrape/${this.id}`
        );
        this.item = response.data;
        console.log("this.item", this.item);
        this.url = this.item?.url;
        await this.fetchScreenshot();
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchScreenshot() {
      try {
        if (this.url) {
          const response = await axios.get(
            `https://scraping-node-gfcl.onrender.com/api/scrape/screenshot?url=${this.url}`,
            {
              responseType: "arraybuffer",
            }
          );
          const base64Image = this.arrayBufferToBase64(response.data);
          this.screenshot = `data:image/png;base64,${base64Image}`;
        }
      } catch (error) {
        console.error("Error fetching screenshot:", error);
      }
    },
    arrayBufferToBase64(buffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>