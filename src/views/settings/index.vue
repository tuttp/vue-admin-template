<template>
  <div style="padding: 30px;">
    <el-divider content-position="left">当前打印机</el-divider>
    <el-row>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <div style="padding-top: 30px;">
      <el-button type="primary" @click="setPrint">确认</el-button>
    </div>
    
  </div>
</template>
<script>
import { getToken, setToken, setCode, getCode, removeToken, removeCode } from '@/utils/auth'
export default {
  data(){
    return {
      options: [],
      value: ''
    }
  },
  methods: {
    setPrint(){
      setToken(this.value)
      this.$router.push('purchase')
      this.$message({
          message: '修改成功！',
          type: 'success'
        })
    }
  },
  created(){
    console.log("加载");
    this.value = getToken()
    if(this.value==='BCKJ'){
      this.options.push({
        value: 'BCKJ',
        label: 'BCKJ'
      })
      this.options.push({
        value: 'BCKJ1',
        label: 'BCKJ1'
      })
    }else{
      this.options.push({
        value: this.value,
        label: this.value
      })
    }
  }
}
</script>