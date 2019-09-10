<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row class="float">
          <!-- <el-input v-model="options.param.serachText" placeholder="请输入菜单名或列名">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input> -->
             <el-input @keyup.enter.native="serach()" v-model="options.param.serachText" style="width:200px;" placeholder="请输入菜单名称">
              <i @click="serach()" class="el-icon-search el-input__icon" slot="suffix"></i>
            </el-input>
        </el-row>
        <el-table
          ref="singleTable"
          stripe
          :data="tableList"
          highlight-current-row
          border
          :span-method="objectSpanMethod"
        >
          <el-table-column label="菜单名称" prop="MenuName"></el-table-column>
          <el-table-column label="列名称" prop="ColumnName"></el-table-column>
          <el-table-column label="排序" prop="Sort"></el-table-column>
          <el-table-column label="固定宽度" prop="ColWidth"></el-table-column>
          <el-table-column label="是否显示">
            <template slot-scope="scope">{{ scope.row.Show?"是":'否' }}</template>
          </el-table-column>
          <el-table-column label="是否固定列">
            <template slot-scope="scope">{{ scope.row.Fixed?"是":'否' }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEdit(scope)"></i>
              <!-- <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button> -->
              <!-- <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination :options="options" @getPagingResult="getPagingResult" ref="pagination"></Pagination>
        <!-- <component :is="component" :options="options" @getPagingResult="getPagingResult" ref="mychild"></component> -->
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="菜单名称" prop="MenuName">
          <el-input v-model="ruleForm.MenuName" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="列名称" prop="ColumnName">
          <el-input v-model="ruleForm.ColumnName" placeholder="列名称" />
        </el-form-item>
        <el-form-item label="排序" prop="Sort">
          <el-input v-model="ruleForm.Sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="固定宽度" prop="ColWidth">
          <el-input v-model="ruleForm.ColWidth" placeholder="固定宽度" />
        </el-form-item>
        <el-form-item label="是否显示" prop="Show">
          <el-switch v-model="ruleForm.Show" active-color="#13ce66" inactive-color="#DCDFE6" />
        </el-form-item>
        <el-form-item label="是否固定列" prop="Fixed">
          <el-switch v-model="ruleForm.Fixed" active-color="#13ce66" inactive-color="#DCDFE6" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      component: Object,
      options: {
        param: {
          serachText: ""
        },
        serachField:['MenuName','ColumnName'],//需要搜索的字段数组
        servicePage: false,
        url: `/api/Manage/GetTableSettings?projectId=${localStorage.eleProjectId}`,
        //serviceData: []
      },
      tableColumn: [
        {
          label: "菜单名称",
          field: "MenuName"
        },
        {
          label: "列名称",
          field: "ColumnName"
        },
        {
          label: "排序",
          field: "Sort"
        },
        {
          label: "是否显示",
          field: "Show"
        },
        {
          label: "固定宽度",
          field: "ColWidth"
        },
        {
          label: "是否固定列",
          field: "Fixed"
        }
      ],
      tableList: [],
      dialogVisible: false,
      dialogType: "new",
      ruleForm: {
        MenuName: "",
        ColumnName: "",
        Sort: "",
        Show: "",
        ColWidth: "",
        Fixed: ""
      },
      rules: {
        UserName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        DisplayName: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Pagination
  },
  created() {
    //this.getTableSettings();
  },
  methods: {
    getPagingResult(result) {
      this.tableList = result;
      this.getSpanArr(result);
    },
    handleCurrentChange() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const isEdit = this.dialogType === "edit";
          if (isEdit) {
            this.ruleForm.ProjectId = localStorage.eleProjectId;
            this.$store.dispatch("setTSData", this.ruleForm); //保存修改时暂存修改后的表单对象到this.TSData，后台修改成功后，将this.TSData对象值赋值给this.scopeRow
            this.$axios
              .post(`/api/Manage/UpdateTableSettings`, this.ruleForm)
              .then(res => {
                this.$utils.ObjCloning();
              });
          } else {
            //添加
          }
          const { ColumnName, Sort, ColWidth, Fixed, Show } = this.ruleForm;
          this.dialogVisible = false;
          this.$notify({
            title: "成功",
            dangerouslyUseHTMLString: true,
            message: `
            <div>列名称: ${ColumnName}</div>
            <div>排序: ${Sort}</div>
            <div>固定宽度: ${ColWidth}</div>
            <div>是否固定列: ${Fixed}</div>
            <div>是否显示: ${Show}</div>
          `,
            type: "success"
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.ruleForm = this.$utils.deepClone(scope.row); //深度克隆，将引用传递变相更改为值传递
      this.$store.dispatch("setScopeRow", scope.row); //将编辑行对象复制给this.scopeRow暂存，此处为引用传值，后面通过修改this.scopeRow，编辑行对象也会跟着修改，从而界面table行内容也会被修改
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除用户?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$axios
            .get(`/api/Manage/DeleteTableSettings?Id=${row.ID}`)
            .then(res => {});
          this.tableList.splice($index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(err => {
          //console.error(err);
        });
    },
    getTableSettings() {
      this.$axios
        .get(
          `/api/Manage/GetTableSettings?projectId=${localStorage.eleProjectId}`
        )
        .then(res => {
          this.options.serviceData = res;
          console.log(res);
          this.component = () => import("../../components/Pagination");
        });
    },
    deleteTableSettings(id) {
      this.$axios.get(`/api/Manage/DeleteTableSettings?Id=${id}`).then(res => {
        this.rolesList = res;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // columnIndex === 0 找到第一列，实现合并随机出现的行数
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getSpanArr(data) {
      //console.log(data); //从后台获取的数据
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          if (data[i].MenuName === data[i - 1].MenuName) {
            // 如果MenuName相等就累加，并且push 0
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 不相等push 1
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    //前端搜索
    serach() {
      this.$refs.pagination.serach(1);
    },
  }
};
</script>


<style scoped>
.float {
  float: right;
  margin-bottom: 20px;
}
.float > button {
  margin-left: 10px;
}
</style>