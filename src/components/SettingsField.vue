<template>
<div ref="root" class="block block--settings-field">
  <label :for="'settings-field--'+fieldNameSlug">{{fieldName}}</label>
  <input :name="'settings-field--'+fieldNameSlug" v-model="settingValue" @change="onChanged" @keyup="onChanged">
</div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue';
const emit = defineEmits(['changed']);

const props = defineProps({
  content: String,
  groupName: String
});

const root = ref(null);
  
const settingValue = ref('');

const onChanged = (a) => {
  emit('changed', fieldName.value, settingValue.value);
};

watch(()=>props.content, async(newContent, oldContent) => {
  try {
    settingValue.value = newContent.split(':')[1].trim();
  } catch( error ) {
    settingValue.value = '';
  }
}, { immediate: true });
  
const originalFieldValue = computed(() => {
  return props.content.split(':')[0].trim();
});
  
const fieldName = computed(() => {
  return props.content.split(':')[0].trim();
});

const fieldNameSlug = computed(() => {
  return fieldName.value;
})
  
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
  .block--settings-field {
    background: var(--color-note-background);
    border: none;
    padding: 0.75em;
    margin: 0 0;
    font-size: 0.9em;
    font-weight: 600;
    
    transition-property: background-color, border-color;
    transition-timing-function: ease-out;
  }
  label {
    margin-right: 1em;
  }
  input {
    padding: 0.25em 0.5em;
    background-color: var(--color-block-background-hover);
    color: var(--color-text-on-background);
    border: none;
    border-radius: 4px;
  }
</style>