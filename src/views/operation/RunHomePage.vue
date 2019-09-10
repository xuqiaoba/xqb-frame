<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row class="float">
          <el-autocomplete popper-class="my-autocomplete" placeholder="请输入内容">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-autocomplete>
          <el-button type="primary" icon="el-icon-plus" @click="handleEditOrAdd()">添加</el-button>
        </el-row>
        <el-table
          id="out-table"
          ref="singleTable"
          stripe
          :data="runHomePageList"
          highlight-current-row
          style="width:100%;"
          border
          @current-change="handleCurrentChange"
        >
          <template v-for="(item,index) in tableColumn">
            <el-table-column
              :prop="item.FieldName"
              :label="item.ColumnName"
              :key="index"
              :fixed="item.Fixed"
              :width="item.ColWidth"
              sortable
            ></el-table-column>
          </template>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="handleEditOrAdd(scope)"></i>
              <i class="el-icon-delete" @click="handleDelete(scope)"></i>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :options="options" @getPagingResult="getPagingResult"></Pagination>
        <!-- <component :is="component" :options="options" @getPagingResult="getPagingResult"></component> -->
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑属性':'新增属性'">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        label-position="left"
      >
        <el-form-item label="属性名称" prop="Keys">
          <el-input v-model="ruleForm.Keys" placeholder="属性名称" />
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="ruleForm.value" placeholder="属性值" />
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
        servicePage: false,
        url: `/api/Manage/GetRunHomePage?projectId=${localStorage.eleProjectId}`
      },
      tableColumn: this.$store.getters.getTableSetting, //当设置一个固定列时，默认该列在第一列显示，设置多个固定列时，固定列按照sort倒序，没有设置固定列时，也按照sort倒序
      runHomePageList: [],
      dialogVisible: false,
      dialogType: "new",
      ruleForm: {
        Keys: "",
        value: ""
      },
      rules: {
        Keys: [
          { required: true, message: "属性名称不能为空", trigger: "blur" }
        ],
        value: [{ required: true, message: "属性值不能为空", trigger: "blur" }]
      }
    };
  },
  components: {
    Pagination
  },
  created() {},
  methods: {
    getPagingResult(result) {
      this.runHomePageList = result;
    },
    handleCurrentChange() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.ProjectId = localStorage.eleProjectId;
          const isEdit = this.dialogType === "edit";
          if (isEdit) {
            this.$store.dispatch("setTSData", this.ruleForm); //保存修改时暂存修改后的表单对象到this.TSData，后台修改成功后，将this.TSData对象值赋值给this.scopeRow
          }
          this.$axios
            .post(`/api/Manage/UpdateRunHomePage`, this.ruleForm)
            .then(res => {
              this.$utils.ObjCloning();
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEditOrAdd(scope) {
      this.dialogVisible = true;
      if (scope) {
        this.dialogType = "edit";
        this.ruleForm = this.$utils.deepClone(scope.row);
        this.$store.dispatch("setScopeRow", scope.row);
      } else {
        this.dialogType = "add";
        this.ruleForm = {};
      }
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.$axios
            .get(`/api/Manage/DeleteRunHomePage?Id=${row.ID}`)
            .then(res => {});
          this.runHomePageList.splice($index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(err => {
          //console.error(err);
        });
    }
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