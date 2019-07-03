const express = require('express');
const app = express();
const router = express.Router();
const film = require('../controller/front/film');
const order = require('../controller/front/order');
const news = require('../controller/front/news');
const user = require('../controller/front/user');

const cinemaManage = require('../controller/back/cinema_manage');
const filmManage = require('../controller/back/film_manage');
const loginManage = require('../controller/back/login');
const planManage = require('../controller/back/plan');
const screenManage = require('../controller/back/screen');
const newsManage = require('../controller/back/news');

/**
 **** 前台api
 */

//获取城市
router.get("/api/getCityList", film.getCityList);
//获取影院列表
router.get("/api/getCinemaList", film.getCinemaList); 
//获取排期
router.get("/api/getIndexFilmList", film.getIndexFilmList); 
//获取定位学校
router.get("/api/getLocationCollege", film.getLocationCollege);
//获取座位图
router.get("/api/getSeat", film.getSeat);
//提交订单
router.post("/api/placeOrder", order.placeOrder);
//获取新闻列表
router.get("/api/getFindNew", news.getFindNew);
//获取新闻详情
router.get("/api/getFindDetail", news.getFindDetail);
//新闻点赞
router.post("/api/like", news.like);
//登录
router.post("/api/userLogin", user.userLogin);

/**
 **** 后台api
 */

//登录
router.post("/api/login", loginManage.login);
//添加学校
router.post("/api/addCollege", cinemaManage.addCollege);
//搜索学校
router.post("/api/searchCollege", cinemaManage.searchCollege);
//获取学校
router.get("/api/getCollege", cinemaManage.getCollege);
//删除学校
router.post("/api/delCollege", cinemaManage.delCollege);
/**
 * 影院管理
 */
//添加影院
router.post("/api/addCinema", cinemaManage.addCinema);
//获取影院列表
router.get("/api/getCinema", cinemaManage.getCinema);
//获取影院详情
router.get("/api/getCinemaDetail", cinemaManage.getCinemaDetail);
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
router.get("/api/getScreen", screenManage.getScreen);
//添加座位
router.post("/api/addSeat", screenManage.addSeat);
//获取座位
router.post("/api/getSeat", screenManage.getSeat);
/**
 * 添加排期栏目
 */
//添加排期
router.post("/api/addSession", planManage.addSession);
//获取影厅和排期
router.get("/api/getScreenSession", planManage.getScreenSession);
//删除排期
router.post("/api/delSession", planManage.delSession);
//审核排期
router.post("/api/agreeSession", planManage.agreeSession);
/**
 * 新闻栏目
 */
//添加新闻图片
router.post("/api/upNewsPhoto", newsManage.upNewsPhoto);
//添加新闻
router.post("/api/addNews", newsManage.addNews);
//获取新闻列表
router.get("/api/getNewsList", newsManage.getNewsList);
//获取新闻详情
router.get("/api/getNewsDetail", newsManage.getNewsDetail);
//删除新闻
router.post("/api/delNews", newsManage.delNews);

module.exports = router;
