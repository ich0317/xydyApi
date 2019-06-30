const newsListTable = require("../../models/news_list");
let { stampToTime } = require('../../utils/index');

//获取新闻列表
exports.getFindNew = (req, res, next) => {
  newsListTable.find({status:true},'views like title brief img_url release_date').sort({_id:-1}).exec((err,data)=>{
    if(data.length == 0){
      res.json({
        code: 1,
        msg: '暂无数据',
        data
      });
    }else{
      res.json({
        code: 0,
        msg: '获取成功',
        data
      });
    }
  });
}