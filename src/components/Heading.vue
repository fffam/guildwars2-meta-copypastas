<template>
  <h3 class="block block--heading">{{content}}</h3>
</template>

<script setup>
import ChatCode from './ChatCode.vue'
import { defineProps, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: String,
  groupName: String
})

const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
      buttonText.value = "Copied";
      setTimeout( () => {   }, 1000 );
    } catch (err) {
      console.error('Failed to copy: ', err);
      buttonText.value = "Error";
      setTimeout( () => {   }, 1000 );
    }
}

</script>

<style scoped>
  h3 {
    
  }
</style>