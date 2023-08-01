<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import {useRouter} from 'vue-router'
import Quill from "quill/dist/quill.js";
import 'quill/dist/quill.snow.css'
import Doc from "../core/doc.js";
import Connection from "../core/connection.js";
import {config} from "../config/index.js";

const router = useRouter()
let editor = null
const doc_id = router.currentRoute.value.query.doc
let doc = null
const options = {theme: 'snow'};


onMounted(() => {
  editor = new Quill('#editor', options);
  const connection = new Connection(config.WEBSOCKET_SERVER, '/socket.io', {doc: doc_id})
  doc = new Doc(doc_id, editor, connection)
  doc.subscribe(() => {
    editor.setContents(doc.snapshot)
  })

  editor.on('text-change', function (delta, oldDelta, source) {
    if (source === "user") {
      doc.submitOp(delta)
    }
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
