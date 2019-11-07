/* eslint-disable */
function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function exportExcel (title, tHeader, tValue, tData) {
  require.ensure([], () => {
    const { export_json_to_excel } = require('../excel/Export2Excel.js')
    const list = tData
    const data = formatJson(tValue, list)
    var curDate = new Date().Format('yyyyMMddHHmmss')
    title = title + '_' + curDate
    export_json_to_excel(tHeader, data, title)
  })
}

Date.prototype.Format = function(fmt)   
{ 
  var o = {   
    "M+" : this.getMonth()+1,                   
    "d+" : this.getDate(),                     
    "H+" : this.getHours(),                     
    "m+" : this.getMinutes(),                
    "s+" : this.getSeconds(),                
    "q+" : Math.floor((this.getMonth()+3)/3),  
    "S"  : this.getMilliseconds()              
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

module.exports = {
    exportExcel
}
