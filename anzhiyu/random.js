var posts=["2024/07/10/hello-world/","2024/07/15/面试总结/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };