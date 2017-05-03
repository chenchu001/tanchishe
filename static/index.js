/* 
* @Author: Marte
* @Date:   2017-03-29 10:00:02
* @Last Modified by:   Marte
* @Last Modified time: 2017-03-31 14:25:26
*/

$(document).ready(function(){
    var len = 20;//将页面均分成20等分
    var redirect = "right";//定义初始小蛇的移动方向为向右边移动
    var nextRedirect = "right";//定义下一个动作
    var xFood = 0;//定义食物的X坐标
    var yFood =0;//定义食物的y坐标
    var xSnakeBody = 0;//定义蛇头的横坐标
    var ySnakeBody = 0;//定义蛇头的纵坐标
    var newSnakeX,newSnakeY;//定义吃到食物后小蛇新增的坐标
    var score = 0;//定义分数
    var Lvs = 1;
    var sub = 200;
    //小蛇有初始长度，将小蛇的初始长度定义在数组里面
    var snakeBody = [[0,1,"green",null],[1,1,"green",null],[2,1,"green",null],[3,1,"red",null]];
    //绘制标题和分数
    function title(){
        var h3 = document.createElement("h3");
        var p = document.createElement("p");
        var text2 = document.createTextNode("你一共获得了" + score + "分");
        var text = document.createTextNode("贪吃蛇");
        var time = document.createElement("p");
        var leve = document.createElement("span");
        var leveText = document.createTextNode("当前游戏等级:Lv1");
        var text3 = document.createTextNode("00:00");
        h3.appendChild(text);
        p.appendChild(text2);
        leve.appendChild(leveText);
        time.appendChild(text3);
        $('body').append(h3);
        $('h3').after(p);
        $('p').after(time);
        h3.setAttribute("class","biaoti");
        p.setAttribute("class",'score');
        time.setAttribute("class",'gameTime');
        $('.gameTime').after(leve);
        leve.setAttribute("class", "Lv");
        $('.biaoti').css({fontSize:"26px",textAlign:'center',marginTop:'30px'});
        $('.score').css({fontSize:'16px',textAlign:'center',marginTop:'15px'});
        $('.gameTime').css({fontSize:'16px',textAlign:'center',marginTop:'15px'});
        $('.Lv').css({fontSize:'16px',display:'block',textAlign:'center',marginTop:'15px'})
    };
    //绘制定时器
    function time(){
        var nowTime = 0;
        myTime = setInterval(function(){
            nowTime++;
            var minute = Math.floor(nowTime/60);
            var second = Math.floor(nowTime%60);
            if(minute.toString().length < 2){
                minute = "0"+minute;
            }
            if(second.toString().length < 2){
                second = "0" + second;
            }
            $('.gameTime').text(minute+':'+second);
        },1000);
    };
    //绘制地图
    var map = function(){
        var mapWidth = 800;
        var mapHeight = 400;
        var map = document.createElement("div");
        map.setAttribute("class", "mapStyle");
        $('body').append(map);
        // document.body.appendChild(map);
        $('.mapStyle').css({width:mapWidth,height:mapHeight,background:'pink',margin:'20px auto',position:'relative'});
    };
    //绘制食物
    var food = function(){
        //食物的宽度20，盒子的宽度800，把食物的坐标以(20,20来定义)
        //食物的初始坐标(随机的，需要做随机判断)
        xFood = Math.floor(Math.random()*40)*len;
        yFood = Math.floor(Math.random()*20)*len;
        var food =document.createElement("div");
        food.setAttribute("class","foodStyle");
        $('.mapStyle').append(food);
        $('.foodStyle').css({width:'20px',height:'20px',background:'green',position:'absolute',top:yFood,left:xFood});
    };
    //绘制小蛇
    function showSnake(){
        //初始为4个蛇节进行绘制
        for(var i=0;i<snakeBody.length;i++){
            if(snakeBody[i][3] == null){
                snakeBody[i][3] = document.createElement("div");
                $('.mapStyle').append(snakeBody[i][3]);
                snakeBody[i][3].style.position = "absolute";
                snakeBody[i][3].style.background = snakeBody[i][2];
                snakeBody[i][3].style.width = snakeBody[i][3].style.height = len +'px';
            }
            snakeBody[i][3].style.left = snakeBody[i][0]*len +'px';
            snakeBody[i][3].style.top = snakeBody[i][1]*len +'px';   
        };
    };
    //小蛇进行移动(小蛇移动的规律是当前蛇节的新坐标为上一个小蛇的旧坐标)
    function moveSnake(){
        //蛇身体坐标移动
        for(var i=0;i<snakeBody.length-1;i++){
            //小蛇的新X坐标
            snakeBody[i][0] = snakeBody[i+1][0];
            //小蛇的新Y坐标
            snakeBody[i][1] = snakeBody[i+1][1];
        }
        //蛇头也要进行移动
        redirect = nextRedirect;
        if(nextRedirect == "right"){//如果初始向右边移动
            snakeBody[snakeBody.length-1][0] += 1;
        }
        if(nextRedirect == "left"){
            snakeBody[snakeBody.length-1][0] -= 1;
        }
        if(nextRedirect == "up"){
            snakeBody[snakeBody.length-1][1] -= 1; 
        }
        if(nextRedirect == "down"){
            snakeBody[snakeBody.length-1][1] += 1;
        }
        //每一次移动都更新蛇头的坐标
        xSnakeBody = snakeBody[snakeBody.length-1][0] * len;
        ySnakeBody = snakeBody[snakeBody.length-1][1] * len;
        //超出给定的范围边界
        if(xSnakeBody < 0 || xSnakeBody > 780 || ySnakeBody < 0 || ySnakeBody > 380){
            alert('game over!');
            clearInterval(t);
            clearInterval(myTime);
            return false;
        }
        //如果头部撞到身体的任何一个坐标也应该game over
        for(var j=0;j<snakeBody.length-1;j++){//除去头部的坐标
            if(xSnakeBody === snakeBody[j][0]*len && ySnakeBody === snakeBody[j][1]*len){
                alert('你自己与自己相撞了,游戏结束！');
                clearInterval(t);
                clearInterval(myTime);
                return false;
            }
        }
        //每次移动之后都要重新绘制坐标
        showSnake(); 
        //移动过程中检测是否吃到食物
        //找到食物的坐标和蛇头的坐标，如果它们俩坐标完全相等代表碰撞
        if(xSnakeBody === xFood && ySnakeBody === yFood){
            //小蛇的长度应该增加1,定义新增加的小蛇的坐标
            var newSnakeBody = [newSnakeX,newSnakeY,"green",null];
            newSnakeX = snakeBody[0][0];
            newSnakeY = snakeBody[0][1];
            snakeBody.unshift(newSnakeBody);
            //吃到食物之后进行游戏等级判断
            score += 10;
            if(score % 50 ==0){
                sub = sub-20;
                Lvs += 1;
                $('.Lv').text("当前游戏等级:Lv"+Lvs);
                clearInterval(t);
                t =setInterval(moveSnake,sub);
            }
            //重新更正获得的分数
            $('.score').text("你一共获得了" + score + "分");
            //重新执行一次food函数
            food();
        }
    };
    //绑定键盘上下左右移动事件
    function onkeyDown(){
        $('body').keydown(function(event){
            if(event.keyCode == 39 && nextRedirect!="left"){
                nextRedirect = "right";
            }
            if(event.keyCode == 37 && nextRedirect!="right"){
                nextRedirect = "left";
            }
            if(event.keyCode == 38 && nextRedirect!="down"){
                nextRedirect = "up";
            }
            if(event.keyCode == 40 && nextRedirect!="up"){
                nextRedirect = "down";
            }
        });  
    };

    title();
    time();
    map();
    food();
    onkeyDown();
    t = setInterval(moveSnake,200);
});