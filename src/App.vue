<template>
  <div class="wrapper">
    
    <details :data-title="Edit" class="edit">
      <summary>Upload/Download</summary>
      <h4>Upload new source file</h4>
      <label for="field-upload"><i class="fa fa-download" aria-hidden="true"></i> Upload source file</label><br>
      <input name="field-upload" @change="onFileUploadChanged" type="file" accept=".md,.txt,text/markdown,text/plain">
      <p>Upload any .txt or .md file. File is converted as follows:</p>
      <ul>
        <li>Any line starting with <samp>#</samp> will be the start of a new section.</li>
        <li>Any line starting with (and optionally ending with) <samp>**</samp> will become a non-clickable sub-heading or note.</li>
        <li>Any line starting with <samp>&gt;</samp> will become a note that can be edited in the browser. Multiple lines starting with <samp>&gt;</samp> will be combined into a single note.</li>
        <li>Any line starting with <samp>-&gt;</samp> will become a button that jumps to that section (and closes the current one).</li>
        <li>Any other line of text will become a clickable message that copies into the clipboard when clicked.</li>
        <li>Any line inside a section called "Settings" will be read as <samp>TEXT_TO_SEARCH_FOR: TEXT_TO_REPLACE_WITH</samp>, and then every instance of <samp>[TEXT_TO_SEARCH_FOR]</samp> in the entire document will be replaced by <samp>TEXT_TO_REPLACE_WITH</samp>, and made editable inside a Settings section. This allows for any number of customisable fields (such as Character name, account name, guild name/etc to be used in the same document)</li>
        <li>Any section called "Quick Access" will be displayed in a fixed bar at the top right, as abbreviated buttons.</li>
      </ul>
      <hr>
      <h4>Download current source file</h4>
      <button @click="onFileDownloadClicked"><i class="fa fa-download" aria-hidden="true"></i> Download original source file</button>
      <p>File will be downloaded as a Markdown (.md) text file.</p>
    </details>
    
    <details v-for="group in contentblockGroups" :data-title="group.name" :open="group.name == 'Quick Access'">
      <summary>{{group.name}}</summary>
      <component v-if="group.name != 'Settings'" v-for="block in group.blocks" :is="block.type" :content="block.content" :group-name="group.name"></component>
      <SettingsField v-if="group.name == 'Settings'" v-for="block in group.blocks" :content="block.content" :group-name="group.name" @changed="onSettingsValueChanged"></SettingsField>
    </details>

  </div>
</template>

<script setup>
  import Heading from './components/Heading.vue'
  import Subheading from './components/Subheading.vue'
  import Note from './components/Note.vue'
  import Text from './components/Text.vue'
  import Link from './components/Link.vue'
  import SettingsField from './components/SettingsField.vue'
  import metas from './data/metas.json'
  import copypastaText from './data/fam.md'
  
  import { computed, ref, onMounted } from 'vue';
  
  const settingsValues = ref({});  
  
  const sourceText = ref("");
  onMounted(() => {
    settingsValues.value = {...extractSettingsValues(copypastaText)};
    sourceText.value = copypastaText;
  });
  
  const extractSettingsValues = (text) => {
    let results = {};
    let multilineMessage = '';
    let isInSettingsGroup = false;
    for( let line of text.split("\n") ) {
      // Headings start with one or more hashes
      if( line.startsWith('#') ) {
        isInSettingsGroup = line.trim().replace(/^#+/,'').replace(/#+$/,'').trim() == "Settings";        
      } else if( isInSettingsGroup && line.indexOf(":") > 0 ) {
        results[line.split(':')[0].trim()] = line.split(':')[1].trim();
      }
    }
    return results;
  }

  const contentblockGroups = computed(() => {
    let sourceTextReplaced = sourceText.value;
    for (const [key, value] of Object.entries(settingsValues.value)) {
        sourceTextReplaced = sourceTextReplaced.replaceAll("["+key+"]",value);
    }
    let blocks = textToContentBlocks(sourceTextReplaced);
    let groups = [];
    let latestGroup = { name: "", blocks: [] };
    for( let block of blocks ) {
      if( block.type == Heading ) {
        if( latestGroup.name ) {
          groups.push( latestGroup );
        }
        latestGroup = { name: block.content, blocks: [] };
      } else {
        latestGroup.blocks.push(block);
      }
    }
    if( latestGroup.name ) {
      groups.push( latestGroup );
    }
    return groups;
  });
  
  const textToContentBlocks = (text) => {
    let results = [];
    let multilineMessage = '';
    for( let line of text.split("\n") ) {

      // Headings start with one or more hashes
      if( line.startsWith('#') ) {
        results.push({ type: Heading, content: line.trim().replace(/^#+/,'').replace(/#+$/,'').trim() });
        continue;
      }

      // Subheadings start with ** (and optionally end with **)
      if( line.startsWith('**') ) {
        results.push({ type: Subheading, content: line.trim().replace(/^\*+/,'').replace(/\*+$/,'').trim() });
        continue;
      }
      
      // Section links start with ->
      if( line.startsWith('->') ) {
        results.push({ type: Link, content: line.trim().replace(/^->/,'').trim() });
        continue;
      }
      
      // Notes can also be multiline and start with >
      if( line.startsWith('>') ) {
        if( multilineMessage ) {
          multilineMessage += "\n";
        }
        multilineMessage += line.trim().replace(/^\>+/,'').trim();
        continue;
      }
      
      // Blank or normal line, but we were building a multiline message?
      // Store it      
      if( multilineMessage ) {
        results.push({ type: Note, content: multilineMessage });
        multilineMessage = '';
        continue;
      }
      
      // Ignore empty lines
      if( line.trim().length == 0 ) {
        continue;
      }
      
      // Normal line 
      results.push({ type: Text, content: line.trim().replace(/^\*+/,'').replace(/\*+$/,'') });
      
    }    
    return results;
  };
  
  const onSettingsValueChanged = (a,b) => {
    settingsValues.value[a] = b;
  }
  
  const onFileUploadChanged = (e) => {
    var file = e.target.files[0]; 

    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!
      console.log( content );
      settingsValues.value = {...extractSettingsValues(content)};
      sourceText.value = content;
    }
  }
  
  const onFileDownloadClicked = (e) => {
    let blob = new Blob([sourceText.value], {
      type: "text/plain",
    });
    downloadBlob(blob,'copypastas.md');
  }
  
  function downloadBlob(blob, name = 'file.txt') {
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    );

    document.body.removeChild(link);
  }
</script>

<style>

:root {
  --color-background: #ced3db;
  --color-block-background: #FFF;
  --color-block-background-hover: #d4e4ff;
  --color-block-background-copied: #4273c2;
  --color-block-border: #93a0b5;
  --color-note-background: #fff6de;
  --color-text-on-background: #333;
  --color-text-main: --color-text-on-background;
  --font-sans: Open Sans,sans-serif;
  background: var(--color-background);
  font-family: var(--font-sans);
  color: var(--color-text-on-background);
  position: relative;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #121212;
    --color-text-on-background: #FFFFFF;
    --color-block-background: #333;
    --color-block-background-hover: #555; 
    --color-block-background-copied: #4273c2;
    --color-block-border: #444;
    --color-note-background: #262521;
  }
}
.wrapper {
  position: relative;
  padding-top: 2em;
}
summary {
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  padding: 0.5em 0;
}
details {
  margin-bottom: 0;
}
.block--note + p {
   margin-top: 0.25em;
}
p + .block--note {
   margin-top: 1em;
}
details[data-title="Quick Access"] summary {
  display: none;
}
details[data-title="Quick Access"] {
  position: fixed;
  top: 6px;
  right: 0;
  z-index: 10000;
}
samp {
  font-weight: bold;
  font-size: 1.2em;
  padding: 0.1em 0.25em;
  display: inline-block;
  border: 1px solid rgba(128,128,128,0.5);
}
</style>
