<template>
<p contenteditable class="block block--note">
  <template v-for="part in parts">
    <template v-if="part.chatcode"><ChatCode :content="part.content"></ChatCode></template>
    <template v-if="!part.chatcode">{{part.content}}</template>
  </template>
</p>
</template>

<script setup>
import ChatCode from './ChatCode.vue'
import { defineProps, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: String,
  groupName: String
});
  
const parts = computed(() => {
  return props.content.split(/(\[&.*?\])/).map( (word) => {
    return {
      chatcode: !!word.match(/(\[&.*?\])/),
      content: word
    }
  });
});

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
  p {
    opacity: 0.7;
    font-size: 0.8em;
    margin: 0;
    white-space: pre;
  }
  .block--note {
    background: var(--color-note-background);
    border: 0.25em solid var(--color-block-background);
    padding: 0.75em;
    margin: 0 0 0.5em 0;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: 600;
    
    transition-property: background-color, border-color;
    transition-timing-function: ease-out;
    font-family: monospace;
  }
</style>