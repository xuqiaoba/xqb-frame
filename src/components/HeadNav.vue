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
          <el-submenu v-for="menuchild in menuchilds" :key="menuchild.id" :index="menuchild.index">
            <template slot="title">
              <label class="slot_title">{{menuchild.name}}</label>
            </template>
            <el-menu-item
              v-for="child in menuchild.childs"
              :key="child.id"
              :index="child.index"
            >{{child.name}}</el-menu-item>
          </el-submenu>
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
          index: "home",
          name: "首页"
        },
        {
          id: 2,
          index: "equipment",
          name: "设备管理"
        },
        {
          id: 3,
          index: "shift",
          name: "交接班管理"
        },
        {
          id: 4,
          index: "attendance",
          name: "考勤管理"
        },
        {
          id: 110,
          index: "WorkFlow",
          name: "工作流管理"
        },
        {
          id: 111,
          index: "operation",
          name: "运营管理"
        }
      ],
      menuchilds: [
        {
          id: 51,
          index: "inspection",
          name: "巡检管理",
          childs: [
            {
              id: 61,
              index: "inspectionPlan",
              name: "巡检计划"
            },
            {
              id: 71,
              index: "inspectionWork",
              name: "巡检工单"
            }
          ]
        },
        {
          id: 5,
          index: "maintenance",
          name: "维修管理",
          childs: [
            {
              id: 6,
              index: "maintenanceWork",
              name: "维修工单"
            }
          ]
        },
        {
          id: 8,
          index: "system",
          name: "系统管理",
          childs: [
            {
              id: 9,
              index: "user",
              name: "用户管理"
            },
            {
              id: 10,
              index: "role",
              name: "角色管理"
            },
            {
              id: 111,
              index: "project",
              name: "项目管理"
            },
            {
              id: 112,
              index: "tableSetting",
              name: "表格设置"
            }
          ]
        }
      ]
    };
  },
  created() {
    console.log(12);
    //当界面F5刷新后,还原store
    localStorage.getItem("store") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("store"))
        )
      );
    //赋值还原后清除localStorage的store
    localStorage.removeItem("store");
    /**下面这种方式当界面刷新后，store里面的数据会被清空,其他组件table界面会在store数据重新渲染前加载，所以会导致store里面的数据渲染不到table中 */
    // //当界面F5刷新后，获取当前路由
    // var path = this.$route.path;
    // if (path) {
    //   path=path.replace("/","");
    //   this.getTableSettingByRouter(path);
    // }
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key == "WorkFlow") {
        location.href = "WorkFlow.html";
      } else if (key == "operation") {
        window.open("operation");
      } else {
        //点击不同菜单，查询不同菜单下的table表格设置
        this.getTableSettingByRouter(key);
      }
    },
    getTableSettingByRouter(key) {
      this.$axios
        .get(
          `/api/Manage/GetTableSettingsByRouter?projectId=${localStorage.eleProjectId}&router=${key}`
        )
        .then(res => {
          this.$store.dispatch("setTableSetting", res);
          this.$router.push(key);
        });
    },
    setDialogInfo(cmditem) {
      if (!cmditem) {
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