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

const themeStyle = [
  {'themeValue': 0, 'themeName': 'Limpid Water', 'mainColor': '#409EFF', 'headerColor': '#2980b9', 'btnColor': '#1e90ff', 'btnColor2': '#1e3799'},
  {'themeValue': 1, 'themeName': 'Resplendent Emerald', 'mainColor': '#44bd32', 'headerColor': '#009432', 'btnColor': '#2ed573', 'btnColor2': '#27ae60'},
  {'themeValue': 2, 'themeName': 'Deep Night', 'mainColor': '#000000', 'headerColor': '#718093', 'btnColor': '#a4b0be', 'btnColor2': '#7f8c8d'},
  {'themeValue': 3, 'themeName': 'Charming Cherry', 'mainColor': '#ff7979', 'headerColor': '#fd79a8', 'btnColor': '#fab1a0', 'btnColor2': '#ff7675'},
  {'themeValue': 4, 'themeName': 'Fresh Juice', 'mainColor': '#ffa502', 'headerColor': '#EE5A24', 'btnColor': '#eccc68', 'btnColor2': '#f39c12'},
  {'themeValue': 5, 'themeName': 'Enthusiastic Fire', 'mainColor': '#EA2027', 'headerColor': '#b71540', 'btnColor': '#ff6348', 'btnColor2': '#c0392b'}
]

const headersArray = [
  {headerName: 'Sprint',   headerIcon: 'el-icon-data-line',       headerPath: 'SptManagement', headerDivider: true },
  // {headerName: 'User',     headerIcon: 'el-icon-user',            headerPath: 'PrjManagement', headerDivider: true },
  // {headerName: 'Customer', headerIcon: 'el-icon-office-building', headerPath: 'CtmManagement', headerDivider: true },
  {headerName: 'Timeline', headerIcon: 'el-icon-time',            headerPath: 'TmlManagement', headerDivider: true },     
  {headerName: 'Report',   headerIcon: 'el-icon-monitor',         headerPath: 'RptManagement', headerDivider: false}
]

module.exports = {
    exportExcel,
    themeStyle,
    headersArray
}
