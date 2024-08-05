var posts=["2024/07/24/Hexo部署教程/","2024/07/25/Oracle调优之看懂Oracle执行计划/","2024/07/25/SpringBoot整合Quartz/","2024/07/25/SpringBoot整合EMQX（MQTT协议）/","2024/07/24/截图工具/","2024/07/24/JVM调优/","2024/07/15/面试总结/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };