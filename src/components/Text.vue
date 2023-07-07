<template>
  <p class="block block--text" :class="classes" @click="onClicked">{{textcontent}}</p>
</template>

<script setup>
import ChatCode from './ChatCode.vue'
import { defineProps, computed, ref, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: String,
  groupName: String
})

const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.content);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
}

const hasBeenClickedAtLeastOnce = ref(false);
const isJustClicked = ref(false);
const isRecentlyClicked = ref(false);
  
const textcontent = computed(() => {
  if( props.groupName == "Quick Access") {
    return props.content.split(' ')[0];
  } else {
    return props.content;
  }
});
  
const classes = computed(() => {
  
  let result = '';
  if( isJustClicked.value && isRecentlyClicked.value ) {
    result += 'recently-clicked ';
  } else if( isJustClicked.value ) {
    result += 'just-clicked ';
  }
  
  if( hasBeenClickedAtLeastOnce.value ) {
    result += "has-been-clicked ";
  }
  
  if( props.groupName == "Quick Access") {
    result += "tiny ";
  }
  
  if( props.content.indexOf('NEXT META:') === 0 ) {
    result += "next-meta-link ";
  }
  return result;
});

const onClicked = () => {
  isJustClicked.value = true;
  hasBeenClickedAtLeastOnce.value = true;
  copyToClipboard();
  setTimeout( () => { isRecentlyClicked.value = true }, 20 );
  setTimeout( () => { isJustClicked.value = false }, 500 );
  setTimeout( () => { isRecentlyClicked.value = false }, 500 );
}

</script>

<style scoped>
  .block--text {
    background: var(--color-block-background);
    border: 0.25em solid var(--color-block-background);
    padding: 0.75em;
    margin: 0 0 0.5em 0;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: 600;
    
    transition-property: background-color, border-color;
    transition-timing-function: ease-out;
  }
  .block--text.tiny {
    float:right;
    display: inline-block;
    margin-right: 0.25em;
    min-width: 1em;
    text-align: center;
    font-size: 0.68em;
    padding: 0.25em 0.5em 0.3em;
    box-shadow: 0 0 4px rgba(0,0,0,0.5); 
  }
  .block--text:hover {
    background: var(--color-block-background-hover);
    border-color: var(--color-block-background-hover);
    cursor: pointer;
  }
  .block--text.just-clicked {
    background: var(--color-block-background-copied);
    border-color: var(--color-block-background-copied);
    transition-duration: 0s;
  }
  .block--text.recently-clicked {
    transition-duration: 2s;
  }
  .block--text.next-meta-link {
     border-color: var(--color-block-border);
    font-weight: 800;
  }
  .block--text.next-meta-link.just-clicked {
    border-color: #2f528a;
  }
  .block--text.has-been-clicked {
    box-shadow: -20px 0 8px var(--color-block-background-copied),0 0 14px var(--color-block-background-copied),20px 0 8px var(--color-block-background-copied); 
  }
  .block--text.tiny.has-been-clicked {
    box-shadow: 0 0 4px var(--color-block-background-copied); 
  }
</style>