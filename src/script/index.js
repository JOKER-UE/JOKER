;
! function($) {
    //轮播图
    const $piclist = $('.lunbo ul li'); //五张图
    const $btnlist = $('.dots li'); //五个圈
    const $ulist = $('.lunbo ul');
    const $xianshi = $('.header_right .xianshi')
    let index = 0; //存储索引


    //设置ulist的尺寸，横排
    let $liwidth = $piclist.eq(0).width();
    $ulist.width($piclist.length * $liwidth);


    //点击事件
    $btnlist.on('click', function() {
        index = $(this).index() - 1;
        tabswitch();
        console.log(1);

    });

    //自动播放 计时器
    setInterval(function() {
        tabswitch();
    }, 2000)

    function tabswitch() {
        index++; //跳转到下一个

        if (index === $btnlist.length + 1) {
            $ulist.css('left', '0px');
            index = 1;
        }
        if (index === -1) { //当点击最后一个的时候跳转
            $ulist.css('left', -$liwidth * ($btnlist.length));
            index = $btnlist.length - 1;
        }
        //点击圆圈改变圆圈背景
        if (index === $btnlist.length) {
            $btnlist.eq(0).addClass('actives').siblings('ol li').removeClass('actives');
        } else {
            $btnlist.eq(index).addClass('actives').siblings('ol li').removeClass('actives');
        }
        $ulist.stop(true).animate({
            left: -$liwidth * index
        }, 1000);
    }

    //二级菜单
    const $secondli = $('.banner_left ul li'); //每一个li
    const $seconddiv = $('.second'); //对应的每一个div
    $secondli.on('mouseover', function() {
        //鼠标移入的时候字体变红，li变白，且显示对应的内容
        $(this).addClass("actives").siblings('li').removeClass("actives");
        $('.banner_left ul li a').eq($(this).index()).css('color', 'red');
        $seconddiv.eq($(this).index()).show().siblings('div').hide();

    });
    //鼠标移除li的时候，变回原样
    $secondli.on('mouseout', function() {
        $('.banner_left ul li a').eq($(this).index()).css('color', '#faf8f9');
        $(this).removeClass("actives");
        $seconddiv.eq($(this).index()).hide();
    });
    //鼠标移入div的时候，出现盒子
    $seconddiv.on('mouseover', function() {
        $(this).show().siblings('div').hide();
    });
    //鼠标移除div的时候，变回原样
    $seconddiv.on('mouseout', function() {
        $(this).hide();
    });
    //小细节 logo部分
    $xianshi.on('mouseover', function() {
        $(this).find('dl').show();
    });
    $xianshi.on('mouseout', function() {
        $(this).find('dl').hide();
    })

    //首页渲染
    const $list = $('.listall');
    $.ajax({
        url: 'http://localhost/firstdemo/php/datalist.php', //获取数据库接口。接口默认发送第一页的数据。
        dataType: 'json'
    }).done(function(data) {
        let $strhtml = '<ul class="listbox">';
        $.each(data, function(index, value) { //渲染
            $strhtml += `
                <li>
                    <img class="lazy" data-original="${value.picadress}"/>
                    <p>${value.name}</p>
                    <span class="price">￥${value.price}</span>
                    <span class="buynum">已有<span style="color:red" class="buynumber" >${value.number}</span>购买</span>
                    <a>放入购物车</a>
                </li>
            `;
        });
        $strhtml += '</ul>';
        $list.html($strhtml);

        //2.添加懒加载
        $(function() {
            $("img.lazy").lazyload({ effect: "fadeIn" });
        });
    });
}(jQuery);