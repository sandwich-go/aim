<template>
  <aim-form-input
      :schema="formSchema"
      :data="formData"
  >
    <template v-slot:aim-proxy-slot-commentSlot>
      <el-table
          :data="[]"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址">
        </el-table-column>
      </el-table>
    </template>

  </aim-form-input>
</template>
<script>
import AimFormInput from "@/components/AimFormInput/index.vue";

export default {
  name: 'TestingAimFormInput',
  components: {AimFormInput},
  data(){
    return {
      formData:{},
      formSchema: [
        { field: 'id', showForm: false },
        { field: 'name', name: '名称', required: true },
        { field: 'alias', name: '别名', required: true },
        { field: 'pid', name: '上级权限', type: 'input', formSlot: 'commentSlot' }
      ],
    }
  }
}
</script>