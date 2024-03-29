const express = require('express');
const app = express();
const router = express.Router();
const film = require('../controller/front/film');
const order = require('../controller/front/order');
const news = require('../controller/front/news');
const user = require('../controller/front/user');
const my = require('../controller/front/my');

const cinemaManage = require('../controller/back/cinema_manage');
const filmManage = require('../controller/back/film_manage');
const loginManage = require('../controller/back/login');
const planManage = require('../controller/back/plan');
const screenManage = require('../controller/back/screen');
const newsManage = require('../controller/back/news');
const userManage = require('../controller/back/users');
const orderManage = require('../controller/back/order');

/**
 **** 前台api
 */

//获取城市
router.get("/getCityList", film.getCityList);
//获取影院列表
router.get("/getCinemaList", film.getCinemaList); 
//获取排期
router.get("/getIndexFilmList", film.getIndexFilmList); 
//获取定位学校
router.get("/getLocationCollege", film.getLocationCollege);
//获取座位图
router.get("/getSeat", film.getSeat);

//提交订单
router.post("/placeOrder", order.placeOrder);
//获取订单详情
router.get("/orderDetail", order.orderDetail);
//取消订单
router.post("/cancelOrder", order.cancelOrder);
//订单支付
router.post("/payOrder", order.payOrder);
//订单列表
router.get("/getOrderList", order.getOrderList);

//获取新闻列表
router.get("/getFindNew", news.getFindNew);
//获取新闻详情
router.get("/getFindDetail", news.getFindDetail);
//新闻点赞
router.post("/like", news.like);

//获取my相关信息
router.get("/myInfo", my.myInfo);


//登录
router.post("/userLogin", user.userLogin);
//注册
router.post("/userReg", user.userReg);

/**
 **** 后台api
 */

//登录
router.post("/login", loginManage.login);
/**
 * 影院管理
 */
//添加影院
router.post("/addCinema", cinemaManage.addCinema);
//获取影院列表
router.get("/getCinema", cinemaManage.getCinema);
//获取影院详情
router.get("/getCinemaDetail", cinemaManage.getCinemaDetail);
//删除影院
router.post("/delCinema", cinemaManage.delCinema);
//排期 搜索影片
router.post("/searchFilm", planManage.searchFilm);
//添加影厅
router.post("/addScreen", screenManage.addScreen);
//获取影厅
router.get("/getScreen", screenManage.getScreen);
//添加座位
router.post("/addSeat", screenManage.addSeat);
//获取座位
router.post("/getSeat", screenManage.getSeat);
//添加排期
router.post("/addSession", planManage.addSession);
//获取影厅和排期
router.get("/getScreenSession", planManage.getScreenSession);
//删除排期
router.post("/delSession", planManage.delSession);
//审核排期
router.post("/agreeSession", planManage.agreeSession);
/**
 * 影片列表
 */
//添加影片
router.post("/addFilm", filmManage.addFilm);
//添加影片海报
router.post("/upFilmPhoto", filmManage.upFilmPhoto);
//获取影片列表
router.post("/getFilmList", filmManage.getFilmList);
//获取影片详情
router.get("/getFilmDetail", filmManage.getFilmDetail);
//删除影片
router.post("/delFilm", filmManage.delFilm);
//抓取电影信息
router.get("/getdbFilm", filmManage.getdbFilm);
/**
 * 订单管理
 */
//获取用户订单
router.get("/getOrder", orderManage.getOrder);
//获取订单详情
router.get("/getOrderDetail", orderManage.getOrderDetail);

/**
 * 新闻栏目
 */
//添加新闻图片
router.post("/upNewsPhoto", newsManage.upNewsPhoto);
//添加新闻
router.post("/addNews", newsManage.addNews);
//获取新闻列表
router.get("/getNewsList", newsManage.getNewsList);
//获取新闻详情
router.get("/getNewsDetail", newsManage.getNewsDetail);
//删除新闻
router.post("/delNews", newsManage.delNews);
/**
 * 用户栏目
 */
//获取用户列表
router.get("/getUserList", userManage.getUserList);

module.exports = router;
