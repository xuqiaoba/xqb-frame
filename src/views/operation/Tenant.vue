<template>
  <div class="app-container">
    <!-- <el-button type="primary" @click="addRole">添加角色</el-button> -->
    <el-row :gutter="20">
      <el-col :span="24">
          <el-row class="float">
            <el-autocomplete
              popper-class="my-autocomplete"
              placeholder="请输入内容"
            >
              <i
                  class="el-icon-search el-input__icon"
                  slot="suffix">
              </i>
            </el-autocomplete>    
            <el-button
              type="primary"
                icon="el-icon-plus"
                @click="addRole">
                添加
            </el-button>   
          </el-row>
        <el-table
          ref="singleTable"
          stripe
          :data="rolesList"
          highlight-current-row
          style="width: 100%;margin-top:30px;"
          border
          @current-change="handleCurrentChange"
        >
         <el-table-column align="center" label="使用区域">
            <template slot-scope="scope">{{ scope.row.HandOverUser }}</template>
          </el-table-column>
          <el-table-column align="center" label="使用单位">
            <template slot-scope="scope">{{ scope.row.Recipient }}</template>
          </el-table-column>
              <el-table-column align="center" label="入驻时间">
            <template slot-scope="scope">{{ scope.row.ShiftTime }}</template>
          </el-table-column>
              <el-table-column align="center" label="地址">
            <template slot-scope="scope">{{ scope.row.ShiftContent }}</template>
          </el-table-column>
              <el-table-column align="center" label="邮箱">
            <template slot-scope="scope">{{ scope.row.Approver }}</template>
          </el-table-column>
              <el-table-column align="center" label="电话">
            <template slot-scope="scope">{{ scope.row.ApprovalResult }}</template>
          </el-table-column>
           <el-table-column align="center" label="备注">
            <template slot-scope="scope">{{ scope.row.Remark }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <div class="number">
            <div>总共 <span>3</span> 条记录，每页显示 <span>14</span> 条</div>
        </div>
        <div class="pag-wrap">
            <el-pagination
            background
            class="pag"
            layout="prev, pager, next"
            :total="1">
            </el-pagination>
        </div>
      </el-col>     
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="role.RoleName" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.SystemName"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const defaultRole = {
  ID: "",
  RoleName: "",
  SystemName: ""
  // routes: []
};
export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      rolesList: [
        {
          HandOverUser: "1F-1311",
          Recipient: '中国建设银行',
          ShiftContent:'2018/09/01',
          ShiftTime:'上海市杨浦区',
          Approver:'xyq@qq.com',
          ApprovalResult:'021-4563217',
          Remark:'暂无'
        },
        {
          HandOverUser: "1F-1312",
          Recipient: '中国建设银行',
          ShiftContent:'2018/09/01',
          ShiftTime:'上海市杨浦区',
          Approver:'xyq@qq.com',
          ApprovalResult:'021-4563217',
          Remark:'暂无'
        },
        {
          HandOverUser: "1F-1313",
          Recipient: '中国建设银行',
          ShiftContent:'2018/09/01',
          ShiftTime:'上海市杨浦区',
          Approver:'xyq@qq.com',
          ApprovalResult:'021-4563217',
          Remark:'暂无'
        },
      ],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false
    };
  },
  created(){
    // this.getRoles();
    // this.getMenus();
  },
  methods: {
    handleCurrentChange() {},
    confirmRole() {},
    setpermission() {},
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.role = this.$utils.deepClone(scope.row);
    },
    handleDelete({ $index, row }) {
      this.$confirm("确定删除?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //await deleteUser(row.key)
          this.rolesList.splice($index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(err => {
          //console.error(err);
        });
    },
      //获取当前项目下的角色列表
    getRoles(){
        this.$axios.get("/api/User/GetRoleInfoByProjectID?projectId=1").then(res => {
            // 登录成功
            const {success,message } = res.data;
            console.log(success)
            console.log(message)
            if(success){
              this.rolesList=message;
            }else{
                this.$message.error(message);
            }
          });
    },
      //获取系统权限列表
    getMenus(){
        this.$axios.get("/api/User/GetPermissionInfos").then(res => {           
            const {success,message } = res.data;
            if(success){
              this.menuList=message;
            }else{
                this.$message.error(message);
            }
          });
    },
     //增加当前项目下的角色 
    addRole(){
        this.$axios.post(`/api/User/AddRole?projectId=1`,this.role).then(res=>{
           const {success,message } = res.data;
            if(success){
            this.$message({
                type: "success",
                message: "添加成功!"
            });
            }else{
                this.$message.error(message);
            }
        })
    }
  }
};
</script>


<style scoped>
.float{
    float: right;
    margin-bottom: 20px;
}
.float > button{
  margin-left: 10px;
}
</style>