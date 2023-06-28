<script setup>
import {onMounted} from "vue";
import {io} from "socket.io-client";
import Quill from "quill/dist/quill.js";
import 'quill/dist/quill.snow.css'

const Delta = Quill.import('delta');

const socket = io("http://127.0.0.1:8000", {transports: ["websocket"]});

const options = {
  theme: 'snow'
};
let editor = null
let seq = 0
let version = 0
let inflightOp = null
let pendingOps = []
let currentDelta = new Delta()
let composeDebounceTimer = null

/*
* compose防抖函数
* */
function composeDebounce(delta, oldDelta, source) {
  if (composeDebounceTimer) {
    clearTimeout(composeDebounceTimer)
  }
  currentDelta = currentDelta.compose(delta)
  composeDebounceTimer = setTimeout(function () {
    submitOp()
  }, 300)
}

/*
* 提交写的数据
* */
function submitOp() {
  console.log(currentDelta)
  // 将op添加到待发送的列表中
  pendingOps.push(currentDelta.ops)
  currentDelta = new Delta()
  flush()
}

function flush() {
  console.log("pendingOps", pendingOps)
  if (pendingOps.length) {
    sendOp()
  }
}

function sendOp() {
  console.log("sendOp", inflightOp)
  if (!inflightOp) {
    inflightOp = pendingOps.shift()
    socket.emit("op", {op: inflightOp, seq: seq, v: version})
  }
}

function handleOp(message) {
  console.log("handleOp", message.v, message.seq)
  console.log("handleOp222", version, seq)
  if (message.v === version && message.seq === seq) {
    console.log("okokoko")
    version += 1
    seq += 1
    inflightOp = null
  }
}

onMounted(function () {
  editor = new Quill('#editor', options);
  editor.on('text-change', function (delta, oldDelta, source) {
    composeDebounce(delta, oldDelta, source)
  });
})


socket.on("op", (data) => {
  console.log(data)
  handleOp(data)
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
