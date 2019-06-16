const express = require('express');
const app = express();
const bodyParser = require("body-parser"); //交互
const mongoose = require("mongoose"); //数据库
const collegeListTable = require("../../models/college_list"); //数据表
const filmListTable = require("../../models/film_list");
const cinemaListTable = require("../../models/cinema_list");
const screenListTable = require("../../models/screen_list");
const sessionListTable = require("../../models/session_list");
const adminUserTable = require("../../models/admin_user");

//登录
exports.login = (req, res, next) => {
    let { username, password } = req.body;
    adminUserTable.find({ username, password }, (err, data) => {
        if (err) return console.log(err);
        if (data.length == 0) {
            res.json({
                code: 1,
                msg: "用户名不存在或密码不正确",
                data
            });
        } else {
            let content = { username: data[0].username, user_id: data[0]._id };
            let token = jwt.sign(content, "a1234", { expiresIn: 30 });
            res.json({
                code: 0,
                msg: "登录成功",
                data: {
                    token,
                    ...content
                }
            });
        }
    });
};

//添加学校
exports.addCollege = (req, res, next) => {
    let aParams = req.body;
    let aMark = aParams.mark.split(",");
    aParams.province = aParams.area[0];
    aParams.city = aParams.area[1];
    aParams.longitude = aParams.area[1];
    aParams.longitude = aMark[1];
    aParams.latitude = aMark[0];
    delete aParams.area;
    delete aParams.mark;

    if (aParams.college_id) {
        //修改
        collegeListTable.update(
            { _id: aParams.college_id },
            aParams,
            (err, data) => {
                if (err) console.log(err);
                res.json({
                    code: 0,
                    msg: "更新成功",
                    data
                });
            }
        );
    } else {
        //新增
        collegeListTable.create(aParams, (err, data) => {
            if (err) console.log(err);
            res.json({
                code: 0,
                msg: "保存成功",
                data
            });
        });
    }
};
//搜索学校
exports.searchCollege = (req, res, next) => {
    
};
//删除学校
exports.delCollege = (req, res, next) => {
    if (req.body._id) {
        collegeListTable.deleteOne(req.body, (err, data) => {
            if (err) console.log(err);
            res.json({
                code: 0,
                msg: "删除成功",
                data
            });
        })
    }
};

//添加影院
exports.addCinema = (req, res, next) => {
    if (req.body._id) {
        //修改
        cinemaListTable.update(
            { _id: req.body._id },
            req.body,
            (err, data) => {
                if (err) console.log(err);
                res.json({
                    code: 0,
                    msg: "更新成功",
                    data
                });
            }
        );
    } else {
        //新增
        cinemaListTable.create(req.body, (err, data) => {
            if (err) console.log(err);
            res.json({
                code: 0,
                msg: "保存成功",
                data
            });
        });
    }
};

//删除影院
exports.delCinema = (req, res, next) => {
    cinemaListTable.remove({ _id: req.body._id }, (err, data) => {
        if (err) console.log(err);
        res.json({
            code: 0,
            msg: "删除成功",
            data
        });
    });
};
