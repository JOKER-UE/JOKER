;
! function($) {
    function cartlist(sid, num) {
        $.ajax({
            url: 'http://localhost/firstdemo/php/datalist.php',
            dataType: 'json'
        }).done(function(data) {
            $.each(data, function(index, value) {
                if (sid == value.sid) {
                    let $clonebox = $('.clonelist:hidden').clone(true, true);
                    //给图片地址
                    $clonebox.find('.listpic img').attr('src', value.picadress);
                    //给图片ID
                    $clonebox.find('.listpic img').attr('sid', value.sid);
                    //商品名称
                    $clonebox.find('.listname').html(value.name);
                    //商品价格
                    $clonebox.find('.listprice').html(value.price);
                    //要购买的商品数量
                    $clonebox.find('.listnumber input').val(num);
                    //渲染 让列表出现
                    $clonebox.css('visibility', 'visible');
                    //计算商品总价
                    $clonebox.find('.sumlist').html((value.price * num).toFixed(2));
                    $('.cartlist_con').append($clonebox);
                    calcprice();
                }

            });
        });
    };

    if (jscookie.get('cookiesid') && jscookie.get('cookienum')) {
        let s = jscookie.get('cookiesid').split(','); //获取cookie 同时转换成数组[1,2]
        let n = jscookie.get('cookienum').split(','); //获取cookie 同时转换成数组[10,20]
        $.each(s, function(index, value) {
            cartlist(s[index], n[index]);
        });
    }



    //所有商品总价
    function calcprice() {
        let $sum = 0; //商品的件数
        let $count = 0; //商品的总价
        $('.clonelist:visible').each(function(index, ele) {
            if ($(ele).find('.checklist input').prop('checked')) { //复选框勾选
                $sum += parseInt($(ele).find('.listnumber input').val());
                $count += parseFloat($(ele).find('.sumlist').html());
            }
        });
        $('.bottom_right p').html($sum);
        $('.bottom_right span').html($count.toFixed(2));
    }

    $('.listnumber input').on('change', function() {
        calcprice();
    })

    $('.cartlist_con').on('change', function() {
        calcprice();
    });

    //全选
    $('.allsel').on('change', function() {
        $('.cartlist_con:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
        $('.allsel').prop('checked', $(this).prop('checked'));
        calcprice(); //计算总价
    });
    let $inputs = $('.clonelist:visible').find(':checkbox');
    ($('.checklist:visible').find(':checkbox').on('change', $inputs, function() {
            //$(this):被委托的元素，checkbox
            if ($('.checklist:visible').find(':checkbox').length === $('.cartlist_con:visible').find('.checklist').find(':checked').size()) {
                $('.allsel').prop('checked', true);
            } else {
                $('.allsel').prop('checked', false);
            }
            calcprice(); //计算总价
        });

        //改变数量
        $('.glyphicon-plus').on('click', function() {
            let $num = $(this).parents('.listnumber').find('.inputnum').val();
            $num++;
            // console.log($(this).parents('.listnumber').find('input').val());
            $(this).parents('.listnumber').find('.inputnum').val($num);
            $(this).parents('.listbox').find('.sumlist').html(calcsingleprice($(this)));
            calcprice(); //计算总价
            setcookie($(this));
        });


        $('.glyphicon-minus').on('click', function() {
            let $num = $(this).parents('.listnumber').find('.inputnum').val();
            $num--;
            if ($num < 1) {
                $num = 1;
            }
            $(this).parents('.listnumber').find('.inputnum').val($num);
            $(this).parents('.listbox').find('.sumlist').html(calcsingleprice($(this)));
            calcprice(); //计算总价
            setcookie($(this));
        });

        $('.listnumber input').on('input', function() {
            let $reg = /^\d+$/g; //只能输入数字
            let $value = $(this).val();
            if (!$reg.test($value)) { //不是数字
                $(this).val(1);
            }
            $(this).parents('.cartlist_con').find('.sumlist').html(calcsingleprice($(this)));
            calcprice(); //计算总价
            setcookie($(this));
        });


        //单件商品总价
        function calcsingleprice(obj) { //obj元素对象
            let $dj = (obj.parents('.listbox').find('.listprice').html());
            let $num = parseInt(obj.parents('.listbox').find('.listnumber input').val());
            return ($dj * $num).toFixed(2)
        }



        //将改变后的数量存放到cookie中
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


        function setcookie(obj) {
            cookietoarray();
            let $sid = obj.parents('.cartlist_con').find('img').attr('sid');
            arrnum[$.inArray($sid, arrsid)] = obj.parents('.cartlist_con').find('.listnumber input').val();
            jscookie.add('cookienum', arrnum, 10);
        }

        function delcookie(sid, arrsid) { //sid:当前删除的sid  arrsid:存放sid的数组[3,5,6,7]
            let $index = -1; //删除的索引位置
            $.each(arrsid, function(index, value) {
                if (sid === value) {
                    $index = index;
                }
            });
            arrsid.splice($index, 1);
            arrnum.splice($index, 1);

            jscookie.add('cookiesid', arrsid, 10);
            jscookie.add('cookienum', arrnum, 10);
        }
        $('.dellist a').on('click', function() {
            cookietoarray();
            if (window.confirm('你确定要删除吗?')) {
                $(this).parents('.listbox').remove();
                delcookie($(this).parents('.listbox').find('img').attr('sid'), arrsid);
                calcprice(); //计算总价
            }
        });

        $('.bottom_left a').on('click', function() {
            cookietoarray();
            if (window.confirm('你确定要全部删除吗?')) {
                $('.listbox:visible').each(function() {
                    if ($(this).find('.checklist input').is(':checked')) { //判断复选框是否选中
                        $(this).remove();
                        delcookie($(this).find('img').attr('sid'), arrsid);
                    }
                });
                calcprice(); //计算总价
            }
        });



    }(jQuery);