;
! function($) {
    //1.获取列表页传来的sid
    let $sid = location.search.substring(1).split('=')[1];
    const $bigpic = $(".bigpic");
    const $bigpicimg = $(".bigpic img");
    const $name = $(".detail_mid h1");
    const $price = $(".price");
    const $buynumber = $(".buynumber")




    if (!$sid) {
        $sid = 1;
    }
    $.ajax({
        url: 'http://localhost/firstdemo/php/getsid.php',
        data: {
            sid: $sid
        },
        dataType: 'json'
    }).done(function(data) {
        $bigpicimg.attr('src', data.picadress);
        $bigpic.attr('sid', data.sid); //给图片添加唯一的sid
        $name.html(data.name);
        $price.html("￥" + data.price);
        $buynumber.html(data.number + "件");

        //渲染小图
        let picarr = data.smallpic.split(',');
        let $strhtml = '';
        $.each(picarr, function(index, value) {
            $strhtml += '<li><img src="' + value + '"/></li>';
        });
        $('.allsmpic ul').html($strhtml);

    });


    const $sf = $('.smallfang'); //小放
    const $bf = $('.bigfang'); //大放
    const $bigbigpic = $('.bigfang img')
    const $left = $('.left'); //左箭头
    const $right = $('.right'); //右箭头
    $bf.width($bigbigpic.width() * $sf.width / $bigpicimg.width());
    $bf.height($bigbigpic.height() * $sf.height / $bigpicimg.height());
    let $bili = $bigbigpic.width() / $bigpicimg.width();
    $bigpic.hover(function() {
        $sf.css('visibility', 'visible');
        $bf.css('visibility', 'visible');
        $(this).on('mousemove', function(ev) {
            let $leftvalue = ev.pageX - $sf.width() / 2 - $('.detail_con').offset().left;
            let $topvalue = ev.pageY - $sf.height() / 2 - $('.detail_con').offset().top;
            if ($leftvalue < 0) {
                $leftvalue = 0;
            } else if ($leftvalue >= $bigpicimg.width() - $sf.width()) {
                $leftvalue = $bigpicimg.width() - $sf.width()
            }
            if ($topvalue < 0) {
                $topvalue = 0;
            } else if ($topvalue >= $bigpicimg.height() - $sf.height()) {
                $topvalue = $bigpicimg.height() - $sf.height()
            }
            $sf.css({
                left: $leftvalue,
                top: $topvalue
            });

            $bigbigpic.css({
                left: -$leftvalue * $bili,
                top: -$topvalue * $bili
            });
        });
    }, function() {
        $sf.css('visibility', 'hidden');
        $bf.css('visibility', 'hidden');
    });

    $('.smallpic ul').on('click', 'li', function() {
        //$(this):当前操作的li
        let $imgurl = $(this).find('img').attr('src');
        $bigpicimg.attr('src', $imgurl);
        $bigbigpic.attr('src', $imgurl);
    });
    let $num = 4; //列表显示的图片个数
    $right.on('click', function() {
        let $allsmpic = $(".allsmpic ul li");
        if ($allsmpic.size() > $num) { //限制点击的条件

            $num++;
            $left.css('color', '#333');
            if ($allsmpic.size() == $num) {
                $right.css('color', '#fff');
            }
            $('.allsmpic ul').animate({
                left: -($num - 4) * $allsmpic.eq(0).outerWidth(true)
            });
        }
    });

    $left.on('click', function() {
        let $allsmpic = $(".allsmpic ul li");
        if ($num > 4) { //限制点击的条件
            $num--;
            $right.css('color', '#333');
            if ($num <= 4) {
                $left.css('color', '#fff');
            }
            $('.allsmpic ul').animate({
                left: -($num - 4) * $allsmpic.eq(0).outerWidth(true)
            });
        }
    });


    //改变数量
    $('.glyphicon-plus').on('click', function() {
        let $number = $(this).parents('.numbers').find('.numberinput').val();
        $number++;
        // console.log($(this).parents('.listnumber').find('input').val());
        $(this).parents('.numbers').find('.numberinput').val($number);
    });


    $('.glyphicon-minus').on('click', function() {
        let $number = $(this).parents('.numbers').find('.numberinput').val();
        $number--;
        if ($number < 1) {
            $number = 1;
        }
        $(this).parents('.numbers').find('.numberinput').val($number);
    });

    let arrsid = []; //存储商品的编号。
    let arrnum = []; //存储商品的数量。


    function cookietoarray() {
        if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
            arrsid = jscookie.get('cookiesid').split(','); //获取cookie 同时转换成数组。[1,2,3,4]
            arrnum = jscookie.get('cookienum').split(','); //获取cookie 同时转换成数组。[12,13,14,15]
        } else {
            arrsid = [];
            arrnum = [];
        }
    }

    //点击加入购物车
    const $cartbtn = $('.mid_m_bottom button');
    $cartbtn.on('click', function() {
        let $sid = $(this).parents('.detail_con').find('.bigpic').attr('sid');
        cookietoarray();
        //判断一下是不是第一次点击 如果是第一次点击则新增sid如果不是则在数量上增加即可

        if ($.inArray($sid, arrsid) != -1) { //$sid存在，商品列表存在，数量累加
            //先取出cookie中存在的数量+当前添加的数量，一起添加到cookie中。
            let $num = parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($('.numberinput').val()); //取值
            arrnum[$.inArray($sid, arrsid)] = $num; //赋值
            jscookie.add('cookienum', arrnum, 10);
        } else {
            //第一次点击加入购物车按钮,将商品的sid和商品的数量放到提前准备的数组里面，然后将数组传入cookie.
            arrsid.push($sid); //将编号$sid push到arrsid数组中
            jscookie.add('cookiesid', arrsid, 10);
            arrnum.push($('.numberinput').val()); //将数量push到arrnum数组中
            jscookie.add('cookienum', arrnum, 10);
        }
        alert('添加购物车成功');
        //跳转到购物车界面
        $(location).attr("href", "http://localhost/firstdemo/src/cart.html")
    });


}(jQuery);