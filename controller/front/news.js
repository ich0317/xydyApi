const newsListTable = require("../../models/news_list");
let { stampToTime } = require('../../utils/index');

//获取新闻列表
exports.getFindNew = (req, res, next) => {
  newsListTable.find({ status: true }, 'views like title brief img_url release_date').sort({ _id: -1 }).exec((err, data) => {
    if (data.length == 0) {
      res.json({
        code: 1,
        msg: '暂无数据',
        data
      });
    } else {
      res.json({
        code: 0,
        msg: '获取成功',
        data
      });
    }
  });
}

//获取新闻详情 && 阅读数
exports.getFindDetail = async (req, res, next) => {
  let { _id } = req.query;
  newsListTable.findOne({ _id }).exec((err, data) => {

    res.json({
      code: 0,
      msg: '获取成功',
      data
    });

    let views = data.views+=1;
    newsListTable.updateOne({ _id }, { views }, (err, data) => data);
  });
}

//点赞
exports.like = async (req, res, next) => {
  let { _id, status } = req.body;
  let oData = await newsListTable.findOne({_id},'like',(err,data)=> data.like);
  let likes = oData.like;
  if(status === 1){
    likes+=1
    newsListTable.updateOne({_id},{like:likes},(err,data)=>{
      res.json({
        code: 0,
        msg: '点赞成功',
        data
      });
    })
  }else if(status === -1){
    likes-=1
    newsListTable.updateOne({_id},{like:likes},(err,data)=>{
      res.json({
        code: 0,
        msg: '取消成功',
        data
      });
    })
  }

  
}