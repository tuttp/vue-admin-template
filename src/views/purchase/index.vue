<template>
  <div class="app-container">
    <div class="order-card-body">
      <div class="search-input" style="display: flex;">
        <!-- <el-input v-model="customer" />
        <el-input
          v-model="searchInput"
          placeholder="规格、品名、采购单号"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" @click="searchBtn">搜索</el-button> -->
        <el-form :inline="true" class="demo-form-inline">

          <el-form-item v-if="get_params.Code==='BCKJ'" label="供应商">
            <el-input
              v-model="customer"
              placeholder="供应商编号"
              @keyup.enter.native="searchBtn"
            />
          </el-form-item>
          <el-form-item label="查询">
            <el-input
              v-model="searchInput"
              placeholder="规格、品名、订单号码"
              prefix-icon="el-icon-search"
              style="width: 300px;"
              @keyup.enter.native="searchBtn"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchBtn">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          v-loading="orderListLoading"
          :data="dataList"
          style="width: 100%"
        >
          <el-table-column
            prop="TC003"
            label="采购日期"
            width="90"
          />
          <el-table-column
            prop="TC002"
            label="订单号码"
            width="100"
          />
          <el-table-column
            prop="MA002"
            label="供应商"
            width="90"
          />
          <el-table-column
            prop="TD005"
            label="品名"
            min-width="180"
          />
          <el-table-column
            prop="TD006"
            label="规格"
            min-width="180"
          />
          <el-table-column
            prop="TD008"
            label="采购数量"
            width="80"
          />
          <el-table-column
            prop="TD012"
            label="预交货日期"
            width="90"
          />
          <el-table-column
            prop="ShippingDate"
            label="送货日期"
            width="110"
          />
          <el-table-column
            fixed="right"
            label="收货/标签数量"
            width="110"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.DeliverNumber>0" type="text" size="small" @click="showQRCodeDialog(scope.row)">{{ scope.row.TD015 }}/{{ scope.row.DeliverNumber }}</el-button>
              <span v-else>{{ scope.row.TD015 }}/{{ scope.row.DeliverNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="未送货数量"
            width="110"
          >
            <template slot-scope="scope">
              {{ scope.row.TD008 - scope.row.TD015 }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showDialogForm(scope.row)">我要送货</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :page-size="get_params.pagerow"
          :current-page="get_params.pageIndex"
          :total="total"
          @size-change="changeSize"
          @current-change="pageChange"
        />
      </div>
    </div>
    <el-dialog title="送货单" :rules="rules" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="50%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="品名" style="margin-bottom: 0px;" :label-width="formLabelWidth">
          <div>{{ dataDetail.TD005 }}</div>
        </el-form-item>
        <el-form-item label="规格" style="margin-bottom: 0px;" :label-width="formLabelWidth">
          <div>{{ dataDetail.TD006 }}</div>
        </el-form-item>
        <el-form-item label="订单号码" style="margin-bottom: 0px;" :label-width="formLabelWidth">
          <div>{{ dataDetail.TC002 }}</div>
        </el-form-item>
        <el-form-item label="采购数量" style="margin-bottom: 0px;" :label-width="formLabelWidth">
          <div>{{ dataDetail.TD008 }}{{ dataDetail.TD009 }}</div>
        </el-form-item>
        <el-form-item label="包装方式" :label-width="formLabelWidth">
          <div>{{ dataDetail.Packing }}</div>
        </el-form-item>
        <el-form-item label="送货日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="送货数量" :label-width="formLabelWidth" prop="number">
          <el-input v-model="ruleForm.number" type="age" style="width:200px" auto-complete="off" />
        </el-form-item>
        <el-form-item label="单箱数量" :label-width="formLabelWidth" prop="onenumber">
          <el-input v-model="ruleForm.onenumber" type="age" style="width:200px" auto-complete="off" />
        </el-form-item>
        <el-form-item label="立即打印标签" :label-width="formLabelWidth">
          <el-checkbox v-model="ruleForm.IsPrint" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-loading="subDisabled" type="primary" :disabled="subDisabled" @click="subBtn">生成标签</el-button>
      </div>
    </el-dialog>
    <el-dialog title="标签列表" :visible.sync="qrCodeListVisible" :close-on-press-escape="false" :close-on-click-modal="false" top="8vh" width="50%">
      <div style="width: 100%;">
        <el-table
          ref="multipleTable"
          v-loading="QRcodeLoading"
          :data="QRCodeList"
          tooltip-effect="dark"
          style="width: 100%"
          height="500"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
          />
          <el-table-column
            prop="Batch"
            label="批次号"
          />
          <el-table-column
            label="数量"
          >
            <template slot-scope="scope">{{ scope.row.Number }}{{ scope.row.Unit }}</template>
          </el-table-column>
          <el-table-column
            prop="ShippingDate"
            label="送货日期"
          />
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.State===1?'已收货':'-' }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 批次号&nbsp;&nbsp;&nbsp;&nbsp;数量
        <div v-loading="QRcodeLoading" style="border: 3px solid #eee;height: 60vh;overflow: scroll;">
          <div v-for="(item, index) in QRCodeList" :key="index" class="rqcode-item">
            <el-checkbox v-model="item.checked" :disabled="item.State===1">{{ item.Batch }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.Number }}&nbsp;{{ item.Unit }}</el-checkbox>
          </div>
        </div> -->
        <div style="display: flex;justify-content: space-between;padding-top: 20px;">
          <div>
            <span>合计：{{ count }}</span>
            <p>标签数：{{ QRCodeList.length }}</p>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="printItem">重新打印</el-button>
            <el-button type="danger" size="mini" @click="delItem">删除</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetPurchaseDetail, GetPurchaseinfo, GetCustomerClient, AddPurchaseinfo, CustomerPrintLabel, DeletePurchaseinfo } from '@/api/order'
import { MessageBox } from 'element-ui'
import { getToken, getCode } from '@/utils/auth'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      customer: '',
      subDisabled: false,
      qrCodeListVisible: false,
      orderListLoading: false,
      QRcodeLoading: false,
      searchInput: '',
      dialogFormVisible: false,
      dataList: [],
      SelectList: [],
      dataDetail: {},
      ruleForm: {
        date: '',
        number: 0,
        onenumber: 0,
        IsPrint: false
      },
      IPList: [],
      QRCodeList: [],
      formLabelWidth: '120px',
      intervalId: null,
      get_params: {
        pageIndex: 1,
        pagerow: 10,
        Code: '',
        Where: ''
      },
      rules: {
        date: [
          { required: true, message: '请选择出货日期', trigger: 'change' }
        ],
        number: [
          { required: true, message: '送货数量必须为数字值', trigger: 'change' }
        ],
        onenumber: [
          { required: true, message: '单箱数量必须为数字值', trigger: 'change' }
        ]
      },
      total: 0
    }
  },
  computed: {
    count() {
      if (this.QRCodeList.length) {
        const tmp = this.QRCodeList.reduce((a, b) => {
          return a + b.Number
        }, 0)
        return tmp + ' ' + this.QRCodeList[0].Unit
      } else {
        return 0
      }
    }
  },
  mounted() {
    console.log('============')
    console.log(getToken())
    this.getData()
    GetCustomerClient().then(res => {
      this.IPList = res.data
    })
    this.get_params.Code = getCode()
    this.ruleForm.date = parseTime(new Date(), '{y}-{m}-{d}')
  },
  methods: {
    handleSelectionChange(val) {
      this.SelectList = val
    },
    changeSize(val) {
      this.get_params.pagerow = val
      this.getData()
    },
    showQRCodeDialog(row) {
      this.dataDetail = row
      this.QRCodeList = []
      this.QRcodeLoading = true
      GetPurchaseinfo({
        PurchaseNo: row.TC001,
        PurchaseOrder: row.TC002,
        SerialNumber: row.TD003
      }).then(res => {
        this.QRcodeLoading = false
        this.QRCodeList = res
      })
      this.qrCodeListVisible = true
    },
    delItem() {
      if (this.SelectList.length) {
        MessageBox.confirm('确定删除选择的二维码吗？', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const doneList = this.SelectList.filter(item => item.State === 1)
          if (doneList.length) {
            MessageBox.confirm('已收货状态的标签不能删除？', '提示', {
              confirmButtonText: '确定删除',
              cancelButtonText: '取消',
              type: 'error'
            }).then(() => {
              this.deleteList()
            })
          } else {
            this.deleteList()
          }
        })
      } else {
        this.$message({
          message: '未选择需要删除的标签！',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    deleteList() {
      this.SelectList.forEach(item => {
        DeletePurchaseinfo({
          id: item.id
        }).then(res => {
          console.log(res)
        })
      })
      setTimeout(() => {
        GetPurchaseinfo({
          PurchaseNo: this.dataDetail.TC001,
          PurchaseOrder: this.dataDetail.TC002,
          SerialNumber: this.dataDetail.TD003
        }).then(res => {
          this.QRcodeLoading = false
          this.QRCodeList = res
        })
        this.getData()
      }, 1000)
    },
    searchBtn() {
      this.get_params.pageIndex = 1
      if (this.searchInput === '' && this.customer === '') {
        this.get_params.Where = ''
      } else {
        if (this.get_params.Code === 'BCKJ') {
          this.get_params.Where = encodeURI(" and TC004 like '%" + this.customer + "%' and ( TD006 like '%" + this.searchInput + "%' or TD005 like '%" + this.searchInput + "%' or TC002 like '%" + this.searchInput + "%')")
        } else {
          this.get_params.Where = encodeURI(" and ( TD006 like '%" + this.searchInput + "%' or TD005 like '%" + this.searchInput + "%' or TC002 like '%" + this.searchInput + "%')")
        }
      }
      this.getData()
    },
    pageChange(num) {
      this.get_params.pageIndex = num
      this.getData()
    },
    getData() {
      this.orderListLoading = true
      GetPurchaseDetail(this.get_params).then(res => {
        console.log(res)
        this.orderListLoading = false
        this.dataList = res.data
        this.total = res.total
      }).catch(e => {
        this.orderListLoading = false
      })
    },
    printItem() {
      if (this.SelectList.length) {
        const queryList = this.SelectList.map(item => {
          return {
            code: item.Batch,
            name: item.ProductName,
            specification: item.Specifications,
            number: item.Number,
            CreateDate: item.CreateTime,
            unit: item.Unit,
            QRcode: this.dataDetail.TD004.trim() + '*' + item.Number + '*' + item.Batch
          }
        })
        CustomerPrintLabel({
          type: '打印',
          Name: getToken(),
          data: JSON.stringify(queryList)
        }).then(res => {
          this.$alert('打印成功！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              //
            }
          });
          console.log(res)
        })
      } else {
        this.$message({
          message: '未选择需要打印的标签！',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    subBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.subDisabled = true
          setTimeout(() => {
            this.subDisabled = false
          }, 3000)
          AddPurchaseinfo({
            PurchaseNo: this.dataDetail.TC001,
            PurchaseOrder: this.dataDetail.TC002,
            ProductCode: this.dataDetail.TD004,
            ProductName: this.dataDetail.TD005,
            Unit: this.dataDetail.TD009,
            Specifications: this.dataDetail.TD006,
            OneNumber: this.ruleForm.onenumber,
            IsPrint: this.ruleForm.IsPrint,
            OrderNumber: this.dataDetail.TD008,
            Number: this.ruleForm.number,
            Remark: '',
            ShippingDate: this.ruleForm.date,
            Type: '0',
            SerialNumber: this.dataDetail.TD003,
            Supplier: this.dataDetail.TC004.trim(),
            PrintName: getToken()
          }).then(res => {
            console.log(res)
            this.dialogFormVisible = false
            this.getData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showDialogForm(row) {
      this.ruleForm = {
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        number: 0,
        onenumber: 0,
        IsPrint: false
      }
      this.dataDetail = row
      console.log(this.dataDetail)
      this.dialogFormVisible = true
    },
    OrderItemClick(item, index) {
      const date1 = new Date()
      let date2 = new Date()
      this.dataDetail = item
      this.QRCodeList = []
      this.ruleForm = {
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        number: 0,
        onenumber: 0,
        IsPrint: false
      }
      this.QRcodeLoading = true
      GetPurchaseinfo({
        PurchaseNo: item.TC001,
        PurchaseOrder: item.TC002,
        SerialNumber: item.TD003
      }).then(res => {
        this.QRcodeLoading = false
        this.QRCodeList = res.map(item => {
          date2 = new Date(item.ShippingDate)
          item.checked = false
          item.disabled = false
          if (date2 - date1 < -86400000) {
            item.disabled = false
          }
          return item
        })
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
  .rqcode-item{
    font-size: 20px;
    font-weight: bold;
    padding: 5px;
  }
  .item-title{
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .item-body{
    font-size: 16px;
    padding-left: 5px;
  }
  .order-card-body-right{
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 15px 20px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .search-input{
    display: flex;
  }
  .order-card-body-main{
    height: 70vh;
    overflow: scroll;
  }
  .box-card1 {
    width: 100%;
    height: 90vh;
  }

</style>
<style>
  .app-container >>> .el-card__body{
    padding: 0px;
  }
  .app-container >>> .el-checkbox__inner::after{
    height: 9px;
    left: 6px;
  }
  .app-container >>> .el-checkbox__inner{
    width: 18px;
    height: 18px;
  }
  .app-container >>> .el-checkbox{
    font-size: 26px;
  }
  .app-container >>> .el-checkbox__label{
    font-size: 20px;
  }
</style>

