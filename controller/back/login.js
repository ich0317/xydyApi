const adminUserTable = require("../../models/admin_user");
let jwt = require('jsonwebtoken');
let user_name = null;
//登录
exports.login = (req, res, next) => {
    let { username, password } = req.body;
    adminUserTable.find({ username, password }, (err, data) => {
        if (err) return console.log(err);
        if (data.length == 0) {
            res.json({
                code: -1,
                msg: "用户名不存在或密码不正确",
                data
            });
        } else {
            let content = { username: data[0].username, user_id: data[0]._id };
            let token = jwt.sign(content, "a1234", { expiresIn: 60*600 });  //秒
            res.json({
                code: 0,
                msg: "登录成功",
                data: {
                    token,
                    ...content
                }
            });
            user_name = data[0].username;
        }
    });
};

//登出
