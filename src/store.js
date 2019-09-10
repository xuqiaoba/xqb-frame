import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
 
}

const state = { 
  tableColumn:[],//表头设置
  scopeRow:{}, //保存编辑行更改前表格的scope.row对象
  TSData:{}, //暂存表单编辑完成更改后的数据对象  
}

const getters = {
  getTableSetting(state) {  
    return state.tableColumn
 },
 getScopeRow(state) {  
  return state.scopeRow
},
getTSData(state) {  
  return state.TSData
},
}

const mutations = {
  set_TableSetting: (state, data) => {
    state.tableColumn = data
  },
  set_ScopeRow:(state,data)=>{
    state.scopeRow=data
  },
  set_TSData:(state,data)=>{
    state.TSData=data
  }
}

const actions = {
  setTableSetting({ commit },data){
    commit('set_TableSetting', data)
  },
  setScopeRow({ commit },data){
    commit('set_ScopeRow', data)
  },
  setTSData({ commit },data){
    commit('set_TSData', data)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
