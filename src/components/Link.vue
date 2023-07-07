<template>
<button ref="root" class="block block--link" @click="onClicked">{{content}}</button>
</template>

<script setup>
import { ref, defineProps, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  content: String,
  groupName: String
});

const root = ref(null);

const onClicked = () => {
  root.value.parentNode.removeAttribute('open');
  let targetEl = document.querySelector('details[data-title="'+props.content+'"]');
  if( targetEl ) {
    targetEl.setAttribute('open',true);
    targetEl.scrollIntoView();
  }  
};
  
const parts = computed(() => {
  return props.content.split(/(\[&.*?\])/).map( (word) => {
    return {
      chatcode: !!word.match(/(\[&.*?\])/),
      content: word
    }
  });
});

</script>

<style scoped>
  button {
    opacity: 0.7;
    font-size: 0.8em;
    margin: 0;
    white-space: pre;
  }
</style>