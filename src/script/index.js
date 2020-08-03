;
! function($) {
    const $lunbo = $('.lunbo'); //大盒子
    const $piclist = $('.lunbo ul li'); //五张图
    const $btnlist = $('.dots li'); //五个圈
    const $ulist = $('.lunbo ul');
    let index = 0; //存储索引。



    //设置ulist的尺寸，横排
    let $liwidth = $piclist.eq(0).width();
    $ulist.width($piclist.length * $liwidth);


    //点击事件
    $btnlist.on('click', function() {
        index = $(this).index() - 1;
        tabswitch();
        console.log(1);

    });

    function tabswitch() {
        index++;

        if (index === $btnlist.length + 1) {
            $ulist.css('left', '0px'); //重新从第一张开始位置开始  正常
            index = 1; //因为当前最后一张,内容和第一张一样，索引就是0,取代第一张。   不正常
        }
        if (index === -1) {
            $ulist.css('left', -$liwidth * ($btnlist.length)); //不正常
            index = $btnlist.length - 1; //第一张，倒着播放，切换到第五张，所有索引为4   正常
        }
        //添加小圆圈的激活状态。
        if (index === $btnlist.length) {
            $btnlist.eq(0).addClass('actives').siblings('ol li').removeClass('actives');
        } else {
            $btnlist.eq(index).addClass('actives').siblings('ol li').removeClass('actives');
        }
        $ulist.stop(true).animate({
            left: -$liwidth * index
        }, 1000);
    }
}(jQuery);