<template>
  <h4 class="block block--subheading">{{content}}</h4>
</template>

<script setup>
import ChatCode from './ChatCode.vue'
import { defineProps, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: String,
  groupName: String
})
</script>

<style scoped>
  h4 {
    font-size: 0.8em;
    opacity: 0.64;
    margin: 1.5em 0 0.25em;
  }
</style>