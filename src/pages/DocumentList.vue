<script setup>
import {onMounted, ref, reactive} from "vue";
import {useRouter} from "vue-router";
import {getDocumentList, createDocument} from "../request/services.js";


const router = useRouter()
const tableData = ref([])
const dialogFormVisible = ref(false)
const form = reactive({name: ''})

onMounted(async () => {
  tableData.value = await getDocumentList()
})

function clickRow(row, column, event) {
  router.push(`/editor?doc=${row.id}`)
}

async function createDoc() {
  let data = await createDocument(form)
  tableData.value.push(data)
  dialogFormVisible.value = false
}


</script>

<template>
  <el-button type="info" @click="dialogFormVisible = true">新建</el-button>
  <el-table :data="tableData" @row-click="clickRow" style="width: 100%">
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="create_at" label="创建时间"/>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="新建一个文档">
    <el-form :model="form">
      <el-form-item label="名称" label-width="140px">
        <el-input v-model="form.name" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createDoc()">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>