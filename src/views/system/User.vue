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
          :data="userList"
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
              <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <Pagination :options="options" @getPagingResult="getPagingResult" ref="pagination"></Pagination>
        <!-- <component :is="component" :options="options" @getPagingResult="getPagingResult"></component> -->
      </el-col>
      <el-col :span="6">
        <el-row class="float">
          <el-input
            @keyup.enter.native="roleserach()"
            v-model="roleserachText"
            style="width:200px;"
            placeholder="请输入用户名称"
          >
            <i @click="roleserach()" class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
        </el-row>
        <el-table :data="pagingResult" stripe style="width: 100%;margin-top:30px;" border>
          <el-table-column label="角色名称" width="220">
            <template slot-scope="scope">{{ scope.row.RoleName }}</template>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="用户名" prop="UserName">
          <el-input v-model="ruleForm.UserName" placeholder="用户名称" />
        </el-form-item>
        <el-form-item label="昵称" prop="DisplayName">
          <el-input v-model="ruleForm.DisplayName" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="Password">
          <el-input
            v-model="ruleForm.Password"
            type="password"
            autocomplete="off"
            placeholder="密码"
          />
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
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        callback(new Error("请输入用户名"));
      } else if (value == "admin") {
        callback(new Error("输入的用户名太敏感"));
      } else {
        callback();
      }
    };
    var validateDisplayName = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        callback(new Error("请输入昵称"));
      } else if (value == "管理员") {
        callback(new Error("输入的昵称太敏感"));
      } else {
        callback();
      }
    };
    return {
      component: Object,
      options: {
        param: {
          serachText: ""
        },
        servicePage: false,
        serachField: ["UserName"], //需要搜索的字段数组
        url: `/api/User/GetUserInfoByProjectId?projectId=${localStorage.eleProjectId}`
        // serviceData: []
      },
      tableColumn: this.$store.getters.getTableSetting, //当设置一个固定列时，默认该列在第一列显示，设置多个固定列时，固定列按照sort倒序，没有设置固定列时，也按照sort倒序
      userList: [],
      /**角色列表分页 */
      roleserachText: "",
      total: 0,
      pagesize: 10,
      currpageIndex: 1,
      rolesList: [],
      serviceData: [],
      pagingResult: [],
      /**end */
      dialogVisible: false,
      dialogType: "new",
      ruleForm: {
        ID: "",
        Password: "",
        UserName: "",
        DisplayName: ""
      },
      rules: {
        Password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        UserName: [
          { required: true, validator: validateUserName, trigger: "blur" }
        ],
        DisplayName: [
          { required: true, validator: validateDisplayName, trigger: "blur" }
        ]
      },
      currRow: {} //当前选中行
    };
  },
  components: {
    Pagination
  },
  created() {
    //this.getUsers();
    this.getRoles();
  },
  methods: {
    getPagingResult(result) {
      this.userList = result;
      this.$refs.singleTable.setCurrentRow(this.userList[0]); //默认选中第一行
    },
    handleAddUser() {},
    handleCurrentChange(row) {
      if (!row) {
        return;
      }
      this.currRow = row;
      //获取当前选中用户在当前项目的角色
      this.$axios
        .get(
          `/api/User/GetRoleByProjectIdAndUserId?projectId=${localStorage.eleProjectId}&userId=${row.ID}`
        )
        .then(res => {
          // if (res.length == 0) {
          //   return;
          // }
          let newrole = this.rolesList.map((role, index, data) => {
            let newr = res.filter(r => {
              if (r.ID == role.ID) {
                return r;
              }
            });
            if (newr.length > 0) {
              role.Statu = true;
            } else {
              role.Statu = false;
            }
            return role;
          });
          //这里不能直接将新值赋值给分页结果（pagingResult），这样会导致界面首次加载全部需要分页的数据；
          //需要赋值给rolesList，然后调用分页方法
          this.rolesList = newrole;
          this.pageChange(1);
        });
    },
    setpermission(row) {
      this.$axios
        .post(`/api/User/UserAssignRole`, {
          RoleID: row.ID,
          UserID: this.currRow.ID,
          ProjectID: localStorage.eleProjectId
        })
        .then(res => {
          console.log("操作成功");
        })
        .catch(err => {
          if (row.Statu) {
            row.Statu = false;
          } else {
            row.Statu = true;
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "";
          if (this.dialogType == "edit") {
            this.$store.dispatch("setTSData", this.ruleForm);
            url = `/api/User/UpdateUserInfo`;
          } else {
            url = `/api/User/AddUser?projectId=${localStorage.eleProjectId}`;
          }
          this.$axios.post(url, this.ruleForm).then(res => {
            console.log(res);
            if (this.dialogType == "edit") {
              this.$utils.ObjCloning();
            } else {
              this.userList.push(this.ruleForm);
            }
            this.dialogVisible = false;
          });
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
      this.$confirm("确定删除用户?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(
              `/api/user/DeleteUserByProjectId?userId=${row.ID}&projectId=${localStorage.eleProjectId}`
            )
            .then(res => {
              this.userList.splice($index, 1);
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
    //获取当前项目下的用户列表
    getUsers() {
      this.$axios
        .get(
          `/api/User/GetUserInfoByProjectId?projectId=${localStorage.eleProjectId}`
        )
        .then(res => {
          this.options.serviceData = res;
          this.component = () => import("../../components/Pagination");
        });
    },
    //获取当前项目下角色列表
    getRoles() {
      this.$axios
        .get(
          `/api/User/GetRoleInfoByProjectID?projectId=${localStorage.eleProjectId}`
        )
        .then(res => {
          this.serviceData = res;
          this.rolesList = res;
          this.total = res.length;
          this.pagingResult = this.$utils.jsPagination(
            this.currpageIndex,
            this.pagesize,
            this.rolesList
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
        this.rolesList
      );
    },
    exportExcel() {
      //更改每页显示条数,默认最多导出1000条数据
      this.$refs.pagination.export_pagesize(1000,"#out-table","用户列表");
    },
    //前端搜索
    serach() {
      this.$refs.pagination.serach(1);
    },
    //角色前端搜索
    roleserach() {
      var reg = new RegExp(this.roleserachText);
      this.rolesList = this.serviceData.filter(v => {
        return reg.test(v.RoleName);
      });
      this.total = this.rolesList.length;
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