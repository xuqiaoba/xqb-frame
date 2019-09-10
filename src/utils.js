// 导出Excel表格依赖
import FileSaver from "file-saver";
import XLSX from "xlsx";

import store from './store';

//拷贝方法
var deepClone = function (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
//js分页方法
const jsPagination = (pageNo, pageSize, array) => {
  var offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize);
}
//定义导出Excel表格事件
const exportExcel = (tableSelector, name) => {
  if (!name) {
    name = '表格'
  }
  /* 从表生成工作簿对象 */
  var wb = XLSX.utils.table_to_book(document.querySelector(tableSelector));
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array"
  });
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: "application/octet-stream" }),
      //设置导出文件名称
      `${name}.xlsx`
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
}
//两个相同的对象，将一个对象的属性值复制给另一个对象对应的属性（getScopeRow:需要赋值的对象，getTSData:数据源对象）
//对于table编辑，两个对象直接“等于”赋值，table行内容不会对应被修改（需刷新界面），需要对应属性赋值，界面才有效果
const ObjCloning = () => {
  for (let item in store.getters.getTSData) {
    store.getters.getScopeRow[item] = store.getters.getTSData[item];
  }
}

export default { deepClone, jsPagination, exportExcel, ObjCloning }