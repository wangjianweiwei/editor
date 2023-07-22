<script setup>
import {onMounted, onBeforeUnmount} from "vue";
import {useRouter} from 'vue-router'
import Quill from "quill/dist/quill.js";
import 'quill/dist/quill.snow.css'
import Doc from "../core/doc.js";

const router = useRouter()
let editor = null
const doc_id = router.currentRoute.value.query.doc
let doc = null
const options = {theme: 'snow'};


onMounted(() => {
  editor = new Quill('#editor', options);
  doc = new Doc(doc_id, editor)
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
