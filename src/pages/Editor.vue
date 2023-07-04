<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import Quill from "quill/dist/quill.js";
import 'quill/dist/quill.snow.css'
import Connection from "../core/connection.js";
import Doc from "../core/doc.js";

const connection = new Connection("http://127.0.0.1:8000")
const doc = new Doc("1", connection)
const options = {
  theme: 'snow'
};
let editor = null

onMounted(() => {
  editor = new Quill('#editor', options);
  editor.on('text-change', function (delta, oldDelta, source) {
    doc.submitOp(delta)
  });
})

onBeforeUnmount(() => {
  doc.destroy()
})


</script>

<template>
  <div>
    <div id="editor">

    </div>
  </div>

</template>

<style scoped>

</style>
