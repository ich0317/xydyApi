const express = require('express');
const app = express();
const router = express.Router();
const film = require('../controller/front/film');
const cinemaManage = require('../controller/back/cinema_manage');
const filmManage = require('../controller/back/film_manage');

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
router.post("/api/login", cinemaManage.login);
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

module.exports = router;
