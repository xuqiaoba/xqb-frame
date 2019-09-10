<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" style="float: right;">
      <el-form-item>
        <el-input v-model="serachText" placeholder="房间名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="serach()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="singleTable" :data="rolesList" highlight-current-row border>
      <template v-for="(item,index) in tableColumn">
        <el-table-column :prop="item.FieldName" align="left" :label="item.ColumnName" :key="index" :fixed="item.Fixed" :width="item.ColWidth" sortable></el-table-column>
      </template>
      <el-table-column align="left" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="editRoom(scope.$index, scope.row)"></i>
          <i class="el-icon-view" @click="to3d(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :options="options" @getPagingResult="getPagingResult" ref="pagination"></Pagination>

    <el-dialog :visible.sync="dialogVisible" width="30%" title="编辑">
      <el-form :model="roomobj" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="roomobj.Name" placeholder="房间名称" :disabled='true' />
        </el-form-item>
        <el-form-item label="IoT编号">
          <el-input v-model="roomobj.IoTNo" placeholder="IoT编号" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="roomobj.Type" placeholder="类型" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="roomobj.State" placeholder="状态" />
        </el-form-item>
        <el-form-item label="租赁单位">
          <el-input v-model="roomobj.LeaseUnit" placeholder="租赁单位" />
        </el-form-item>
        <el-form-item label="面积(m2)">
          <el-input v-model="roomobj.Area" placeholder="面积(m2)" />
        </el-form-item>
        <el-form-item label="业主">
          <el-input v-model="roomobj.Owner" placeholder="业主" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click.native="saveRoom()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "../../components/Pagination";
export default {
  data() {
    return {
      dialogVisible: false,
      serachText: "", //查询条件
      options: {
        servicePage: true,
        url: "/api/room/Getroom?serachText="
      },
      tableColumn: this.$store.getters.getTableSetting,
      rolesList: [],
      roomobj: {
        name: ""
      }
    };
  },
  components: {
    Pagination
  },
  created() { },
  methods: {
    getPagingResult(result) {
      this.rolesList = result;
    },
    serach() {
      this.options.url = "/api/room/Getroom?serachText=" + this.serachText;
      this.$refs.pagination.serach(1);
    },
    to3d(index, obj) {
      window.localStorage.setItem("FlyElementID", "Room,"+obj.ModelGuid);
    },
    editRoom(index, obj) {
      this.dialogVisible = true;
      this.roomobj = this.$utils.deepClone(obj); 
      this.$store.dispatch("setScopeRow", obj);
    },
    saveRoom() {
      this.$store.dispatch("setTSData", this.roomobj); 
      this.$axios.post("/api/room/UpdateRoom",this.roomobj).then(res => {
        this.dialogVisible = false;
        this.$message({
          type: 'success',
          message: '修改成功'
        });
        this.$utils.ObjCloning();
      });
    }
  }
};
</script>