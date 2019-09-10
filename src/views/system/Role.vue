<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-row class="float">
           <el-input
            @keyup.enter.native="serach()"
            v-model="options.param.serachText"
            style="width:200px;"
            placeholder="请输入用户名称"
          >
            <i @click="serach()" class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
          <el-button type="primary" icon="el-icon-plus" @click="handleEditOrAdd()">添加</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="exportExcel">导出</el-button>
        </el-row>
        <el-table
          id="out-table"
          ref="singleTable"
          stripe
          :data="roleList"
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
              <!-- <el-button type="primary" size="small" @click="handleEditOrAdd(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination :options="options" @getPagingResult="getPagingResult" ref="pagination"></Pagination>
        <!-- <component :is="component" :options="options" @getPagingResult="getPagingResult"></component> -->
      </el-col>
      <el-col :span="6">
        <el-row class="float">
           <el-input
            @keyup.enter.native="permissionserach()"
            v-model="permissionserachText"
            style="width:200px;"
            placeholder="请输入用户名称"
          >
            <i @click="permissionserach()" class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
        </el-row>
        <el-table :data="pagingResult" stripe style="width: 100%;margin-top:30px;" border>
          <el-table-column label="权限名称" width="220">
            <template slot-scope="scope">{{ scope.row.PermissionName }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.Statu"
                active-color="#13ce66"
                inactive-color="#DCDFE6"
                @change="setpermission(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <div class="number">
            <div>
              总共
              <span>{{total}}</span> 条记录，每页显示
              <span>{{pagesize}}</span> 条
            </div>
          </div>
          <div class="pag-wrap">
            <el-pagination
              background
              class="pag"
              @current-change="pageChange"
              layout="prev, pager, next"
              :page-size="pagesize"
              :total="total"
            ></el-pagination>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="角色名" prop="RoleName">
          <el-input v-model="ruleForm.RoleName" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="SystemName">
          <el-input v-model="ruleForm.SystemName" placeholder="描述" />
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
        serachField: ["RoleName"], //需要搜索的字段数组
        servicePage: false,
        url: `/api/User/GetRoleInfoByProjectID?projectId=${localStorage.eleProjectId}`
      },
      tableColumn: this.$store.getters.getTableSetting, //当设置一个固定列时，默认该列在第一列显示，设置多个固定列时，固定列按照sort倒序，没有设置固定列时，也按照sort倒序
      roleList: [],
      /**权限列表分页 */
      permissionserachText: "",
      total: 5,
      pagesize: 10,
      currpageIndex: 1,
      actionList: [],
      serviceData: [],
      pagingResult: [],
      /**end */
      dialogVisible: false,
      dialogType: "new",
      ruleForm: {
        ID: "",
        RoleName: "",
        SystemName: ""
      },
      rules: {
        RoleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" }
        ]
      },
      currRow: {}
    };
  },
  components: {
    Pagination
  },
  created() {
    //this.getRoles();
    this.getPermissions();
  },
  methods: {
    getPagingResult(result) {
      this.roleList = result;
      this.$refs.singleTable.setCurrentRow(this.roleList[0]); //默认选中第一行
    },
    handleCurrentChange(row) {
      if(!row){
        return;
      }
      this.currRow = row;
      this.$axios
        .get(
          `/api/User/GetRoleAssignPermission?roleId=${row.ID}&projectId=${localStorage.eleProjectId}`
        )
        .then(res => {
          // if(res.length==0){
          //   return;
          // }
          let newaction = this.actionList.map(action => {
            let newr = res.filter(r => {
              if (r.PermissionID == action.ID) {
                return r;
              }
            });
            if (newr.length > 0) {
              action.Statu = true;
            } else {
              action.Statu = false;
            }
            return action;
          });
          this.actionList = newaction;
          this.pageChange(1);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "";
          if (this.dialogType == "edit") {
            this.$store.dispatch("setTSData", this.ruleForm);
            url = `/api/User/UpdateRoleInfo`;
          } else {
            url = `/api/User/AddRole?projectId=${localStorage.eleProjectId}`;
          }
          this.$axios.post(url, this.ruleForm).then(res => {
            if (this.dialogType == "edit") {
              this.$utils.ObjCloning();
            } else {
              this.roleList.push(this.ruleForm);
            }
            this.dialogVisible = false;
          });
        }
      });
    },
    setpermission(row) {
      this.$axios
        .post(`/api/User/RoleAssignPermission`, {
          PermissionID: row.ID,
          RoleID: this.currRow.ID,
          ProjectID: localStorage.eleProjectId
        })
        .then(res => {
          console.log("绑定成功");
        })
        .catch(err => {
          if (row.Statu) {
            row.Statu = false;
          } else {
            row.Statu = true;
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
      this.$confirm("确定删除角色?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(
              `/api/user/DeleteRoleByProjectId?roleId=${row.ID}&projectId=${localStorage.eleProjectId}`
            )
            .then(res => {
              this.roleList.splice($index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(err => {
          //console.error(err);
        });
    },
    //获取当前项目下的角色列表
    getRoles() {
      this.$axios
        .get(
          `/api/User/GetRoleInfoByProjectID?projectId=${localStorage.eleProjectId}`
        )
        .then(res => {
          this.options.serviceData = res;
          this.component = () => import("../../components/Pagination");
        });
    },
    //获取系统权限列表
    getPermissions() {
      this.$axios.get(`/api/User/GetPermissionInfos`).then(res => {
        this.serviceData=res;
        this.actionList = res;
        this.total = res.length;
        this.pagingResult = this.$utils.jsPagination(
          this.currpageIndex,
          this.pagesize,
          this.actionList
        );
      });
    },
    pageChange(val) {
      if (val) {
        this.currpageIndex = val;
      }
      this.pagingResult = this.$utils.jsPagination(
        this.currpageIndex,
        this.pagesize,
        this.actionList
      );
    },
    exportExcel() {
      //更改每页显示条数
      this.$refs.pagination.export_pagesize(1000,"#out-table","角色列表");
      //this.$utils.exportExcel("#out-table", "角色列表");
    },
    //前端搜索
    serach() {
      this.$refs.pagination.serach(1);
    },
    //角色前端搜索
    permissionserach() {
      var reg = new RegExp(this.permissionserachText);
      this.actionList = this.serviceData.filter(v => {
        return reg.test(v.PermissionName);
      });
      this.total = this.actionList.length;
      this.pageChange(1); //从第一页查起
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