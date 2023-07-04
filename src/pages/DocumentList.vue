<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getDocumentList} from "../request/services.js";


const router = useRouter()
const tableData = ref([])

onMounted(async () => {
  tableData.value = await getDocumentList()
})

function clickRow(row, column, event) {
  router.push(`/editor?doc=${row.id}`)
}


</script>

<template>
  <el-table :data="tableData" @row-click="clickRow" style="width: 100%">
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="create_at" label="创建时间"/>
  </el-table>
</template>

<style scoped>

</style>