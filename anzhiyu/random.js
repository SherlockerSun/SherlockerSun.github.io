var posts=["2024/07/25/Oracle调优之看懂Oracle执行计划/","2024/07/24/JVM调优/","2024/07/25/SpringBoot整合Quartz/","2024/07/24/截图工具/","2024/07/25/SpringBoot整合EMQX（MQTT协议）/","2024/07/15/面试总结/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"WeTransfer","link":"https://wetransfer.com/","avatar":"https://wetransfer.com/favicon.ico","descr":"在线发送大文件和共享照片","recommend":true},{"name":"草料二维码","link":"https://cli.im/","avatar":"https://cli.im/favicon.ico","descr":"在线二维码生成、解析","recommend":false},{"name":"IPinfo","link":"https://ipinfo.io/","avatar":"https://ipinfo.io/favicon.ico","descr":"查询IP地址信息数据","recommend":false},{"name":"微截图","link":"https://vjietu.pro/","avatar":"https://vjietu.pro/_next/static/media/logo-180.90f22328.png","descr":"生成真实微信对话聊天记录、转账账单、转账成功等截图","recommend":false},{"name":"Emoji大全","link":"https://www.emojiall.com/zh-hans","avatar":"https://www.emojiall.com/favicon.ico","descr":"Emoji表情符号词典","recommend":false},{"name":"OneDrive直链工具","link":"https://onedrive.gimhoy.com/","avatar":"https://cdn.static.gimhoy.com/frontend/favicon.ico","descr":"OneDrive网盘永久外链地址生成工具","recommend":false},{"name":"JSON","link":"https://www.json.cn/","avatar":"https://www.json.cn/favicon.ico","descr":"JSON在线解析及格式化验证","recommend":false},{"name":"BEJSON","link":"https://www.bejson.com/","avatar":"https://www.bejson.com/favicon.ico","descr":"在线JSON校验格式化工具","recommend":false},{"name":"Cron生成器","link":"https://cron.ciding.cc/","avatar":"https://cron.ciding.cc/images/logo.png","descr":"在线Cron表达式生成、解析","recommend":false},{"name":"随机数生成器","link":"https://www.lddgo.net/string/randomnumber","avatar":"https://staticfile.lddgo.net/img/random-tool.png","descr":"在线生成随机数","recommend":false},{"name":"手机号码生成器","link":"https://www.bmcx.com/phonegenerate","avatar":"https://staticfile.lddgo.net/img/tools/phone-tool.png","descr":"在线随机数生成手机号码","recommend":false},{"name":"身份证号生成器","link":"https://www.lddgo.net/common/idgenerator","avatar":"https://staticfile.lddgo.net/img/tools/idgenerator-tool.png","descr":"在线随机生成身份证号码","recommend":false},{"name":"邮箱地址生成器","link":"https://www.lddgo.net/string/random-email-address","avatar":"https://staticfile.lddgo.net/img/tools/email.png","descr":"在线随机数生成邮箱地址"},{"name":"UUID在线生成器","link":"https://www.lddgo.net/string/uuid","avatar":"https://staticfile.lddgo.net/img/uuid-tool.png","descr":"在线随机数生成UUID","recommend":false},{"name":"AES加密解密","link":"https://www.lddgo.net/encrypt/aes","avatar":"https://staticfile.lddgo.net/img/tools/aes-tool.png","descr":"对字符串进行AES加密解密","recommend":false},{"name":"随机时间生成器","link":"https://www.lddgo.net/string/random-date","avatar":"https://staticfile.lddgo.net/img/time-tool.png","descr":"在线随机数生成自定义格式的时间字符串","recommend":false},{"name":"Haikei","link":"https://app.haikei.app/","avatar":null,"descr":"在线生成几何图形背景图","recommend":true},{"name":"PhotoKit","link":"https://photokit.com/editor/?lang=zh","avatar":"https://photokit.com/images/icon256.png","descr":"免费在线图片编辑器，在线抠图、改图、修图、美图","recommend":true},{"name":"Hello 算法","link":"https://www.hello-algo.com/","avatar":"https://www.hello-algo.com/assets/images/logo.svg","descr":"动画图解、一键运行的数据结构与算法教程","recommend":true}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };