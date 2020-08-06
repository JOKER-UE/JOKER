! function($) {

    //4.排序初始值。
    let array_default = []; //排序前的li数组
    let array = []; //排序中的数组
    let prev = null;
    let next = null;
    const $list = $('.listall');


    //1.渲染列表页的数据-默认渲染第一页
    $.ajax({
        url: 'http://localhost/firstdemo/php/liatpage.php', //获取数据库接口。接口默认发送第一页的数据。
        dataType: 'json'
    }).done(function(data) {
        let $strhtml = '<ul class="listbox">';
        $.each(data, function(index, value) { //渲染
            $strhtml += `
                    <a  href="http://localhost/firstdemo/src/detail.html?id=${value.sid}">
                <li>
                    <img class="lazy" data-original="${value.picadress}"/>
                    <p>${value.name}</p>
                    <span class="price">￥${value.price}</span>
                    <span class="buynum">已有<span style="color:red" class="buynumber" >${value.number}</span>购买</span>
                </li>
                </a>

            `;
        });
        $strhtml += '</ul>';
        $list.html($strhtml);

        //2.添加懒加载
        $(function() {
            $("img.lazy").lazyload({ effect: "fadeIn" });
        });

        //4.对排序进行赋值。
        array_default = []; //排序前的li数组-默认排序的数组
        array = []; //排序中的数组
        prev = null;
        next = null;

        //4.将页面的li元素加载到两个数组中
        $('.listall li').each(function(index, element) {
            array[index] = $(this); //[li,li,li,li......]
            array_default[index] = $(this); //[li,li,li,li......]
        });
    });

    $('.changepage').pagination({
        pageCount: 3, //总的页数
        prevContent: '上一页',
        nextContent: '下一页',
        callback: function(api) {
            $.ajax({
                url: 'http://localhost/firstdemo/php/liatpage.php',
                data: { //将获取的页码给后端
                    page: api.getCurrent()
                },
                dataType: 'json'
            }).done(function(data) { //根据传递的页码，后端返回相应的数据，进行渲染。
                let $strhtml = '<ul class="listbox">';
                $.each(data, function(index, value) {
                    $strhtml += `
                    <a style="display:block" href="http://localhost/firstdemo/src/detail.html?id=${value.sid}">
                    <li>
                    <img src="${value.picadress}"/>
                    <p>${value.name}</p>
                    <span class="price">￥${value.price}</span>
                    <span class="buynum">已有
                    <span style="color:red" class="buynumber">${value.number}</span>购买
                    </span>
                    </li>
                    </a>
                    `;
                });
                $strhtml += '</ul>';
                $list.html($strhtml);
                //分页后进行对应的赋值和排序。
                array_default = []; //排序前的li数组
                array = []; //排序中的数组
                prev = null;
                next = null;

                //将页面的li元素加载到两个数组中
                $('.listall li').each(function(index, element) {
                    array[index] = $(this);
                    array_default[index] = $(this);
                });
            })
        }
    });
    //4.排序
    //默认排序 - 排序的是array_default数组
    $('.paixu li').eq(0).on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                //取出array的价格，price进行排序
                prev = parseFloat(array[j].find('.buynumber').html());
                next = parseFloat(array[j + 1].find('.buynumber').html());
                //通过价格的判断，改变的是li的位置。
                if (prev > next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }

        //换完li位置，进行渲染。
        $.each(array, function(index, value) {
            $('.listall ul').append(value);
        });
    });



    $('.paixu li').eq(2).on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                //取出array的价格，price进行排序
                prev = parseFloat(array[j].find('.price').html().substring(1));
                next = parseFloat(array[j + 1].find('.price').html().substring(1));
                //通过价格的判断，改变的是li的位置。
                if (prev > next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        //换完li位置，进行渲染。
        $.each(array, function(index, value) {
            $('.listall ul').append(value);
        });
    });

    $('.paixu li').eq(1).on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                prev = parseFloat(array[j].find('.buynumber').html());
                next = parseFloat(array[j + 1].find('.buynumber').html());
                console.log(array[j][0].children[3].children[0].innerHTML);
                //通过价格的判断，改变的是li的位置。
                if (prev < next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        //换完li位置，进行渲染。
        $.each(array, function(index, value) {
            $('.listall ul').append(value);
        });
    })

    $('.paixu li').eq(3).on('click', function() {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                prev = parseFloat(array[j].find('.price').html().substring(1));
                next = parseFloat(array[j + 1].find('.price').html().substring(1));
                //通过价格的判断，改变的是li的位置。
                if (prev < next) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
        //换完li位置，进行渲染。
        $.each(array, function(index, value) {
            $('.listall ul').append(value);
        });
    })
}(jQuery);