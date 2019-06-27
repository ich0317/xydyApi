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

//添加学校
exports.addCollege = async (req, res, next) => {
    let aParams = req.body;
    let aMark = aParams.mark.split(",");
    aParams.province = aParams.area[0];
    aParams.city = aParams.area[1];
    aParams.longitude = aParams.area[1];
    aParams.longitude = aMark[1];
    aParams.latitude = aMark[0];
    delete aParams.area;
    delete aParams.mark;

    const r = await collegeListTable.find({ college_name: aParams.college_name }, (err, data) => {
        return data;
    });

    if (r.length == 0) {
        aParams.college_id ? updateData(aParams) : createData(aParams);
    } else {
        res.json({
            code: -1,
            msg: "学校已存在"
        });
    }

    //创建
    function createData(aParams) {
        collegeListTable.create(aParams, (err, data) => {
            if (err) console.log(err);
            res.json({
                code: 0,
                msg: "保存成功",
                data
            });
        });
    }
    //更新
    function updateData(aParams) {
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

//获取学校列表
exports.getCollege = async (req, res, next) => {
    let { college_name, page = 1, page_size = 10 } = req.query;
    let queryCond = college_name ? { 'college_name': { '$regex': college_name } } : {};

    let n = (Number(page)-1)*page_size;
    let numAdventures = await collegeListTable.estimatedDocumentCount({},(err,length)=>{
        return length;
    });
    
    collegeListTable.find(queryCond).skip(n).limit(Number(page_size)).sort({ _id: -1 }).exec((err, college) => {
        if (err) return console.log(err);
        if(college_name){
            numAdventures = college.length;
        }
        res.json({
            code: 0,
            msg: "获取成功",
            data: {
                college,
                total: numAdventures
            }
        });
    });
}

//添加影院
exports.addCinema = (req, res, next) => {
    let aParams = req.body;
    console.log(req.body);
    aParams.province = aParams.area[0];
    aParams.city = aParams.area[1];
    delete aParams.area;
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
