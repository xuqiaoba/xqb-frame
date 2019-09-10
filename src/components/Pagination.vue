<template>
  <el-row>
    <div class="number">
      <div>
        总共
        <span>{{currtotal}}</span> 条记录，每页显示
        <span>{{currpageSize}}</span> 条
      </div>
    </div>
    <div class="pag-wrap">
      <el-pagination
        background
        class="pag"
        @current-change="pageChange"
        layout="prev, pager, next"
        :page-size="currpageSize"
        :total="currtotal"
      ></el-pagination>
    </div>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      currpageIndex: 1,
      currpageSize: this.pagesize,
      currservicePage: this.options.servicePage,
      currtotal: 0,
      pagingResult: [],
      serviceData: [],
      yuansiData: []
    };
  },
  props: {
    pagesize: {
      type: Number,
      default: 10
    },
    options: {
      type: Object
    }
  },
  created() {
    if (!this.currservicePage) {
      this.frontPaging();
    } else {
      this.serach();
    }
  },
  methods: {
    pageChange(val) {
      if (val) {
        this.currpageIndex = val;
      }
      if (!this.currservicePage) {
        this.pagingResult = this.$utils.jsPagination(
          this.currpageIndex,
          this.currpageSize,
          this.serviceData
        );
        this.$emit("getPagingResult", this.pagingResult);
      } else {
        this.serach();
      }
    },
    serach(i) {
      if (i) {
        this.currpageIndex = 1;
      }
      if (this.currservicePage) {
        this.$axios
          .get(
            `${this.options.url}&pageIndex=${this.currpageIndex}&PageSize=${this.currpageSize}&projectId=${localStorage.eleProjectId}`
          )
          .then(res => {
            this.pagingResult = res.data;
            this.currtotal = res.total;
            this.$emit("getPagingResult", this.pagingResult);
          });
      } else {
        //前端查询分页
        this.fuzzySearch();
      }
    },
    frontPaging() {
      this.$axios.get(this.options.url).then(res => {
        this.yuansiData = res;
        this.serviceData = res;
        this.currtotal = this.serviceData.length;
        this.pageChange(1);
      });
    },
    //前端搜索
    fuzzySearch() {
      var reg = new RegExp(this.options.param.serachText);
      var result = [];
      this.options.serachField.forEach(field => {
        var list = this.yuansiData.filter(v => {
          return reg.test(v[field]);
        });
        result = result.concat(list);
      });
      this.serviceData = Array.from(new Set(result)); //数组去重
      this.currtotal = this.serviceData.length;
      this.pageChange(1);
    },
    //前端导出excel时，改变当前每页显示条数
    export_pagesize(val, a, b) {
      //如果总条数小于等于当前每页显示条数，则直接下载
      if (this.currtotal <= this.currpageSize) {
        this.$utils.exportExcel(a, b);
        return;
      }
      console.log('超过')
      this.currpageSize = val;
      this.pageChange(1);
      //模拟异步导出
      setTimeout(() => {
        this.$utils.exportExcel(a, b);
        //还原每页显示条数
        this.currpageSize = 10;
        this.pageChange(1);
      }, 1);
    }
  }
};
</script>