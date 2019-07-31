if (process.env.npm_lifecycle_event == 'dev'){
    process.env.NODE_ENV = 'development';
    process.env.PORT = 8084;
    process.env.BASE_URL = 'localhost';
  }else{
    process.env.NODE_ENV = 'production';
    process.env.PORT = 3000;
    process.env.BASE_URL = 'https://www.ichang.xyz';
}
