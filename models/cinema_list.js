const mongoose = require("mongoose");
const cinemaList = new mongoose.Schema({
    cinema_name:String,   //影院名称
    screen_amount:Number,   //影厅数量
    worker_name:String,  //管理人姓名
    worker_tel:Number,   //联系方式
    cinema_status:Boolean,   //影院状态
    college_id:String   //所属学校id
});
module.exports = mongoose.model('cinemaList', cinemaList);