const express = require('express');
const app = express();
const router = express.Router();
const film = require('../controller/front/film');
const cinemaManage = require('../controller/back/cinema_manage');
const filmManage = require('../controller/back/film_manage');
const loginManage = require('../controller/back/login');
const planManage = require('../controller/back/plan');
const screenManage = require('../controller/back/screen');

/**
 **** 前台api
 */

//获取学校列表
router.get("/api/getCollegeList", film.getCollegeList);
//获取影院列表
router.get("/api/getCinemaList", film.getCinemaList); 
//获取排期
//router.get("/api/getFilmList", film.getFilmList); 
//获取定位学校
router.get("/api/getLocationCollege", film.getLocationCollege);

/**
 **** 后台api
 */

//登录
router.post("/api/login", loginManage.login);
//添加学校
router.post("/api/addCollege", cinemaManage.addCollege);
//搜索学校
router.post("/api/searchCollege", cinemaManage.searchCollege);
//删除学校
router.post("/api/delCollege", cinemaManage.delCollege);
//添加影院
router.post("/api/addCinema", cinemaManage.addCinema);
//删除影院
router.post("/api/delCinema", cinemaManage.delCinema);
//添加影片
router.post("/api/addFilm", filmManage.addFilm);
//添加影片海报
router.post("/api/upFilmPhoto", filmManage.upFilmPhoto);
//获取影片列表
router.post("/api/getFilmList", filmManage.getFilmList);
//获取影片详情
router.get("/api/getFilmDetail", filmManage.getFilmDetail);
//删除影片
router.post("/api/delFilm", filmManage.delFilm);
//排期 搜索影片
router.post("/api/searchFilm", planManage.searchFilm);
//添加影厅
router.post("/api/addScreen", screenManage.addScreen);
//获取影厅
router.post("/api/getScreen", screenManage.getScreen);
//添加座位
router.post("/api/addSeat", screenManage.addSeat);
//获取座位
router.post("/api/getSeat", screenManage.getSeat);
//添加排期
router.post("/api/addSession", planManage.addSession);
//获取排期
router.post("/api/getSession", planManage.getSession);

module.exports = router;
