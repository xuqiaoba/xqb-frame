<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="4" class="logo-container">
        <img src="../assets/logo.png" class="logo" alt />
        <!-- <span class='title'>达海项目管理系统</span> -->
      </el-col>
      <el-col :span="14">
        <el-menu
          :default-active="activeIndex2"
          mode="horizontal"
          @select="handleSelect"
          background-color="#303542"
          text-color="#fff"
        >
          <el-menu-item v-for="menu in menus" :key="menu.id" :index="menu.index">{{menu.name}}</el-menu-item>
          <!-- <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="equipment">设备管理</el-menu-item>
          <el-menu-item index="shift">交接班管理</el-menu-item>
          <el-submenu index="maintenance">
            <template slot="title">
              <label class="slot_title">维修管理</label>
            </template>
            <el-menu-item index="workorder">工单管理</el-menu-item>
            <el-menu-item index="inspection">巡检管理</el-menu-item>
          </el-submenu>
          <el-menu-item index="attendance">考勤管理</el-menu-item>
          <el-submenu index="system">
            <template slot="title">
              <label class="slot_title">系统管理</label>
            </template>
            <el-menu-item index="user">用户管理</el-menu-item>
            <el-menu-item index="role">角色管理</el-menu-item>
            <el-menu-item index="project">项目管理</el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-col>
      <el-col :span="6" class="user">
        <div class="userinfo">
          <img src="../assets/user.png" class="avatar" alt />
          <div class="welcome">
            <p class="name avatarname">LT</p>
          </div>
          <span class="username">
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>
<script>
export default {
  name: "head-nav",
  data() {
    return {
      activeIndex2: "1",
      menus: [
        {
          id: 1,
          index: "operation",
          name: "首页"
        },
        {
          id: 2,
          index: "tenant",
          name: "租户管理"
        },
        {
          id: 3,
          index: "space",
          name: "空间管理"
        },
        {
          id: 4,
          index: "repairs",
          name: "报修管理"
        },
        {
          id: 5,
          index: "runhomepage",
          name: "运营首页管理"
        }
      ]
    };
  },
  created() {
    localStorage.getItem("store") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("store"))
        )
      );
    localStorage.removeItem("store");
  },
  methods: {
    handleSelect(key, keyPath) {
      this.getTableSettingByRouter(key);
    },
    getTableSettingByRouter(key) {
      this.$axios
        .get(
          `/api/Manage/GetTableSettingsByRouter?projectId=${localStorage.eleProjectId}&router=${key}`
        )
        .then(res => {
          console.log(res);
          this.$store.dispatch("setTableSetting", res);
          this.$router.push(key);
        });
    },
    setDialogInfo(cmditem) {
      if (!cmditem) {
        console.log("test");
        this.$message("菜单选项缺少command属性");
        return;
      }
      switch (cmditem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    showInfoList() {
      // 个人信息
      this.$router.push("/");
    },
    logout() {
      // 清除token
      localStorage.removeItem("eleToken");
      // 清除projectId
      localStorage.removeItem("eleProjectId");
      // 页面跳转
      this.$router.push("/login");
    }
  }
};
</script>