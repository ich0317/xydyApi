const userListTable = require("../../models/user");
let jwt = require('jsonwebtoken');

//登录
exports.userLogin = async (req, res, next) => {
  let { username, password } = req.body;
  userListTable.findOne({username,password},(err,data)=>{
    if(data){
      let content = { username: data.username, user_id: data._id };
      let token = jwt.sign(content, "b1234", { expiresIn: 60*600 });  //秒
      res.json({
        code:0,
        msg:'登录成功',
        data:{
          token
        }
      });
    }else{
      res.json({
        code:-1,
        msg:'用户名密码不正确',
        data
      });
    }
    
  });
}
