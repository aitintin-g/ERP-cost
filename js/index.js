$(function(){
    //扩展菜单
    $('.nav li').eq(3).hover(function(){
        $('.extends').css('height',120);
    },function(){
        $('.extends').css('height',0);
    });

    time=new Date();
    $('.date').html(time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate());
    
    //获取本月天数
    var dayNum=getDayNum();
     
    //根据天数生成data数组，全局
    var dayData=[];
    for(var i=0;i<dayNum;i++){
        dayData.push(i+1);
    }


    //定义全局变量
    var nowItem;  //当前要显示趋势的物料
    var nowIndex=0; //当前物料的索引值
    var nowStation;    //当前站点
    var arrTarget=[]; //当前站点物料的target数组



    $('.duan').change(function(){
        var shtml='<option>---</option>';
        var section=$('.duan').val();
        var arr=getArr(section);
        
        for(var i=0;i<arr.length;i++){
            shtml+='<option>'+arr[i]+'</option>';
        }
        
        $('.zhan').html(shtml);
    });

    $('.zhan').change(function(){
        var station=$(this).find('option:selected').text();
        nowStation=station;
        if(station==='---'){
            return;
        }

        var arr1=[];
        var arrTemp=window.sessionStorage.getItem(station);
        if(arrTemp){
            arr1=arrTemp;
        }else{
            arr1=getArr1(station);

            //由于本地存储的键值都是字符串，存储时json数据要转换成字符串才行，使用时字符串要转成json
            // window.sessionStorage.setItem(section,arr1);
        }
        

        var thtml='';
        for(var i=0;i<arr1.length;i++){
            thtml+='<tr>'
            for(var key in arr1[i]){
                thtml+='<td>'+arr1[i][key]+'</td>';
            }
            thtml+='<td><button>修改</button><button>确定</button></td></tr>';
        }

        $('tbody').html(thtml);

        var mhtml='';
        for(var i=0;i<arr1.length;i++){
            if(i==0){
                mhtml+='<li class="active">'+arr1[i]['name']+'</li>';
            }else{
                mhtml+='<li>'+arr1[i]['name']+'</li>';
            }
        }
        $('.martical ul').html(mhtml);

        nowItem=arr1[0]['name'];   //全局变量赋值

        //每次切换站点时，默认当前物料的索引要重置为0
        nowIndex=0;

        
        //清除上个站点单耗目标，保存当前站点的单耗目标
        arrTarget=[];
        for(var i=0;i<arr1.length;i++){
            arrTarget.push(arr1[i]['target']);
        }
        
        var target=[];
        for(var i=0;i<dayNum;i++){
            target.push(arrTarget[0]);
        }

        //绘制图表
        var item={
            name:nowItem,
            xData:dayData,
            target:target
        };

        item.unit=getUnit(nowStation,nowIndex);

        paintImg(item,$('#dayData'),'每日单耗');

        //关闭之前的每月单耗图表
        $('.monthData').css('display','none');
        

    });

    //点击按钮修改单耗目标
    var set;
    $('tbody').click(function(e){
        e = e||window.event; //兼容IE8
        e.target = e.target||e.srcElement;  //获取触发事件的元素
        if($(e.target).html()==='修改'){
            set=$(e.target).parent().parent().find('td').eq(2);
            // alert ($(target).get(0).tagName);
            setNum=$(set).html();
            $(set).replaceWith('<td><input value='+setNum+'></td>');
            var setNew=$(e.target).parent().parent().find('td').eq(2);
            setNew.find('input').css('width','100%').css('border','none').css('outline','none')
            .css('height','22px').css('margin','0').css('display','block').css('font-size','16px');
            setNew.find('input').trigger('focus');
            $(e.target).html('取消');
        }else if($(e.target).html()==='取消'){
            var setNew=$(e.target).parent().parent().find('td').eq(2);
            setNew.replaceWith(set);
            $(e.target).html('修改');
        }else if($(e.target).html()==='确定'){
            var setNew=$(e.target).parent().parent().find('td').eq(2);
            var val=setNew.find('input').val();
            setNew.replaceWith(set);
            set.html(val);
            $(e.target).siblings().html('修改');
        }
    });


    //物料列表点击,innerHTML无法绑定事件，使用事件委托
    $('.martical ul').click(function(e){
        e = e||window.event; //兼容IE8
        e.target = e.target||e.srcElement;  //获取触发事件的元素

        $(e.target).addClass('active').siblings().removeClass('active');

        nowItem=$(e.target).text();
        if(nowItem==='-'){
            return;
        }

        //生成一个目标值的数组
        nowIndex=$(e.target).index();
        var target=[];
        for(var i=0;i<dayNum;i++){
            target.push(arrTarget[nowIndex]);
        }

        var item={
            xData:dayData
        };
        item.name=nowItem;
        item.unit=getUnit(nowStation,nowIndex);
        item.target=target;

        //绘制图表
        paintImg(item,$('#dayData'),'每日单耗');

        //关闭之前的每月单耗图表
        $('.monthData').css('display','none');

    });

    //展示各月单耗
    $('.toggle').click(function(){
        var target=[];
        for(var i=0;i<dayNum;i++){
            target.push(arrTarget[nowIndex]);
        }

        var item={
            xData:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            name:nowItem,
            target:target
        };

        item.unit=getUnitM(nowStation,nowIndex);

        paintImg(item,$('#monthData'),'每月单耗');
        $('.monthData').css('display','block');
        
    })


    //封装一个全局函数用来生成趋势图
    function paintImg(item,container,title){
        var title=item.name+title;

        //获取每日单耗数据
        var arrUnit=item.unit;

        var xData=item.xData;

        var target=item.target;

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(container.get(0));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['实际单耗','目标单耗']
            },
            xAxis: {
                data: xData
            },
            yAxis: {
                min:'dataMin',
                max:'dataMax'
            },
            series: [{
                name: '实际单耗',
                type: 'line',
                data: arrUnit,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                label:{
                    show:false,
                    backgroundColor:'#ccc',
                    padding:[2,6,2,6],
                    position:'start',
                    fontSize:12,
                    color:'#111'
                },
                lineStyle:{
                    color:'#4a7ebb',
                    width:3
                },
                itemStyle: {
                    color: '#4a7ebb'
                }
            },
            {
                name: '目标单耗',
                type: 'line',
                data: target,
                markPoint: {
                    data: [
                        {type: 'average', name: '最大值'}
                    ]
                },
                lineStyle:{
                    color:'red',
                    type:'dashed'
                }
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    //获取物料每日单耗数据
    function getUnit(station,index){
        var unit;
        switch(station){
            case 'IL':
                unit=[
                    [6.47,6.26,6.38,6.41,6.43,6.37,6.34,6.17,6.26,6.47,6.26,6.38,6.41,6.43,6.37,6.34,6.17,6.26],
                    [3.52,2.75,3.04,3.18,3.25,3.05,2.87,3.43,3.38,3.52,2.75,3.04,3.18,3.25,3.05,2.87,3.43,3.38],
                    [153.14,142.51,146.33,150.03,147.67,156.38,152.47,140.35,159.67,153.14,142.51,146.33,150.03,147.67,156.38,152.47,140.35,159.67],
                    [31.33,33.04,32.58,32.97,36.46,32.98,32.81,36.82,36.34,31.33,33.04,32.58,32.97,36.46,32.98,32.81,36.82,36.34],
                    [6.59,10.98,6.04,9.23,5.58,6.96,8.05,10.79,10.32,6.59,10.98,6.04,9.23,5.58,6.96,8.05,10.79,10.32]
                ];
                break;
            case 'Press':
                unit=[
                    [78.28,83.25,80.64,83.22,80.76,79.62,87.89,78.51,83.81,78.28,83.25,80.64,83.22,80.76,79.62,87.89,78.51,83.81],
                    [16.83,16.27,16.95,17.00,17.80,17.46,16.47,17.07,16.51,16.83,16.27,16.95,17.00,17.80,17.46,16.47,17.07,16.51],
                    [7.92,11.17,7.59,7.29,10.44,8.29,9.88,9.42,12.19,7.92,11.17,7.59,7.29,10.44,8.29,9.88,9.42,12.19],
                    [15.39,16.34,14.73,15.10,14.16,15.37,15.69,15.46,15.53,15.39,16.34,14.73,15.10,14.16,15.37,15.69,15.46,15.53],
                    [4.06,3.96,3.87,3.89,3.68,4.14,4.17,3.84,4.03,4.06,3.96,3.87,3.89,3.68,4.14,4.17,3.84,4.03]
                ];
                break;
            case 'Drill':
                unit=[
                    [11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65,11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65],
                    [11.99,12.02,12.01,13.14,11.77,12.43,11.51,11.94,11.51,11.94,12.02,12.01,12.65,11.77,11.99,12.43,13.14,12.65]
                ];
                break;
            case 'PTH':
                unit=[
                    [11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65,11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65],
                    [34.46,32.56,35.93,37.71,36.58,35.15,35.56,35.83,41.51,34.46,32.56,35.93,37.71,36.58,35.15,35.56,35.83,41.51],
                    [24.84,23.59,23.61,22.75,25.43,14.42,28.43,26.47,26.03,24.84,23.59,23.61,22.75,25.43,14.42,28.43,26.47,26.03],
                    [0.66,0.52,0.54,0.45,0.59,0.41,0.61,0.76,0.56,0.66,0.52,0.54,0.45,0.59,0.41,0.61,0.76,0.56]
                ];
                break;
            case '2E':
                unit=[
                    [1.960,1.960,1.961,1.958,1.960,1.962,1.960,1.962,1.963,1.960,1.960,1.961,1.958,1.960,1.962,1.960,1.962,1.963],
                    [5.65,4.95,5.79,3.59,7.70,4.58,4.95,6.10,5.98,5.65,4.95,5.79,3.59,7.70,4.58,4.95,6.10,5.98]
                ];
                break;
            case 'PP':
                unit=[
                    [215.18,216.20,217.42,229.49,193.20,215.62,214.16,195.27,219.33,215.18,216.20,217.42,229.49,193.20,215.62,214.16,195.27,219.33],
                    [70.93,68.02,74.42,76.42,65.85,65.00,78.74,75.75,67.51,70.93,68.02,74.42,76.42,65.85,65.00,78.74,75.75,67.51]
                ];
                break;
            case 'SM':
                unit=[
                    [10.08,10.74,10.18,9.03,9.17,9.80,10.42,9.34,9.13,10.08,10.74,10.18,9.03,9.17,9.80,10.42,9.34,9.13],
                    [1.03,1.20,1.16,0.87,0.98,1.05,1.20,0.76,0.62,1.03,1.20,1.16,0.87,0.98,1.05,1.20,0.76,0.62]
                ];
                break;
            case 'Finish':
                unit=[
                    [0.18,0.19,0.19,0.22,0.20,0.19,0.19,0.18,0.23,0.18,0.19,0.19,0.22,0.20,0.19,0.19,0.18,0.23],
                    [3.31,3.15,3.96,2.62,5.96,3.96,3.31,3.56,3.93,3.31,3.15,3.96,2.62,5.96,3.96,3.31,3.56,3.93],
                    [7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08,7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08]
                ];
                break;
            case 'Rout':
                unit=[
                    [7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08,7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08]
                ];
                break;
            default:
                break;
        }
        // console.log(unit);
        return unit[index];
    }

    //获取物料每月单耗数据
    function getUnitM(station,index){
        var unit;
        switch(station){
            case 'IL':
                unit=[
                    [6.47,6.26,6.38,6.41,6.43,6.37,6.34,6.17,6.26],
                    [3.52,2.75,3.04,3.18,3.25,3.05,2.87,3.43,3.38],
                    [153.14,142.51,146.33,150.03,147.67,156.38,152.47,140.35,159.67],
                    [31.33,33.04,32.58,32.97,36.46,32.98,32.81,36.82,36.34],
                    [6.59,10.98,6.04,9.23,5.58,6.96,8.05,10.79,10.32]
                ];
                break;
            case 'Press':
                unit=[
                    [78.28,83.25,80.64,83.22,80.76,79.62,87.89,78.51,83.81],
                    [16.83,16.27,16.95,17.00,17.80,17.46,16.47,17.07,16.51],
                    [7.92,11.17,7.59,7.29,10.44,8.29,9.88,9.42,12.19],
                    [15.39,16.34,14.73,15.10,14.16,15.37,15.69,15.46,15.53],
                    [4.06,3.96,3.87,3.89,3.68,4.14,4.17,3.84,4.03]
                ];
                break;
            case 'Drill':
                unit=[
                    [11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65],
                    [11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65]
                ];
                break;
            case 'PTH':
                unit=[
                    [11.77,11.99,12.43,11.51,11.94,12.02,12.01,13.14,12.65],
                    [34.46,32.56,35.93,37.71,36.58,35.15,35.56,35.83,41.51],
                    [24.84,23.59,23.61,22.75,25.43,14.42,28.43,26.47,26.03],
                    [0.66,0.52,0.54,0.45,0.59,0.41,0.61,0.76,0.56]
                ];
                break;
            case '2E':
                unit=[
                    [1.960,1.960,1.961,1.958,1.960,1.962,1.960,1.962,1.963],
                    [5.65,4.95,5.79,3.59,7.70,4.58,4.95,6.10,5.98]
                ];
                break;
            case 'PP':
                unit=[
                    [215.18,216.20,217.42,229.49,193.20,215.62,214.16,195.27,219.33],
                    [70.93,68.02,74.42,76.42,65.85,65.00,78.74,75.75,67.51]
                ];
                break;
            case 'SM':
                unit=[
                    [10.08,10.74,10.18,9.03,9.17,9.80,10.42,9.34,9.13 ],
                    [1.03,1.20,1.16,0.87,0.98,1.05,1.20,0.76,0.62]
                ];
                break;
            case 'Finish':
                unit=[
                    [0.18,0.19,0.19,0.22,0.20,0.19,0.19,0.18,0.23],
                    [3.31,3.15,3.96,2.62,5.96,3.96,3.31,3.56,3.93],
                    [7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08]
                ];
                break;
            case 'Rout':
                unit=[
                    [7.95,8.93,12.96,5.23,16.50,12.97,9.94,11.11,7.08]
                ];
                break;
            default:
                break;
        }
        // console.log(unit);
        return unit[index];
    }

    //获取物料各项信息
    function getArr1(station){
        var arr1=[];
        
        switch(station){
            case 'IL':
                arr1=[
                    {
                        name:'内层油墨',
                        code:'30-0099L-CZ',
                        target:'6.37',
                        num:'7640',
                        output:'1221177',
                        unit:'6.47',
                        un:'g/SF'
                    },
                    {
                        name:'双氧水',
                        code:'72-0055L-00',
                        target:'3.44',
                        num:'4375',
                        output:'1293396',
                        unit:'3.52',
                        un:'g/SF'
                    },
                    {
                        name:'盐酸',
                        code:'72-0180L-00',
                        target:'148.50',
                        num:'206520',
                        output:'1293396',
                        unit:'153.14',
                        un:'g/SF'
                    },
                    {
                        name:'酸性蚀刻液',
                        code:'72-0557L-00',
                        target:'35.7',
                        num:'47000',
                        output:'1293396',
                        unit:'31.33',
                        un:'g/SF'
                    },
                    {
                        name:'氢氧化钾',
                        code:'72-0045L-00',
                        target:'8.71',
                        num:'13350',
                        output:'1293396',
                        unit:'6.59',
                        un:'g/SF'
                    }
                ];
                break;
            case 'Press':
                arr1=[
                    {
                        name:'铜箔',
                        code:'10-0119L-SY',
                        target:'82.38%',
                        num:'1567704',
                        output:'1313892',
                        unit:'83.81%',
                        un:'利用率'
                    },
                    {
                        name:'牛皮纸',
                        code:'62-0041L-00',
                        target:'17.90',
                        num:'32500',
                        output:'196864',
                        unit:'16.51',
                        un:'PC/100Pnl'
                    },
                    {
                        name:'铣刀',
                        code:'C1-0140L-SH',
                        target:'8.74',
                        num:'2400',
                        output:'196864',
                        unit:'12.19',
                        un:'PC/1000Pnl'
                    },
                    {
                        name:'硫酸',
                        code:'72-0169L-00',
                        target:'15.54',
                        num:'1965',
                        output:'1265121',
                        unit:'15.53',
                        un:'g/SF'
                    },
                    {
                        name:'双氧水',
                        code:'72-0055L-00',
                        target:'3.87',
                        num:'5100',
                        output:'1265121',
                        unit:'4.03',
                        un:'g/SF'
                    }
                ];
                break;
            case 'Drill':
                arr1=[
                    {
                        name:'钻针',
                        code:'A0-0013L-DM',
                        target:'12.27',
                        num:'9525',
                        output:'753189',
                        unit:'12.65',
                        un:'ge/SF'
                    },
                    {
                        name:'覆胺板',
                        code:'56-0330L-MP',
                        target:'12.27',
                        num:'9525',
                        output:'753189',
                        unit:'12.65',
                        un:'ge/SF'
                    }
                ];
                break;
            case 'PTH':
                arr1=[
                    {
                        name:'过硫酸钠',
                        code:'72-0066L-00',
                        target:'12.27',
                        num:'9525',
                        output:'753189',
                        unit:'12.65',
                        un:'g/SF'
                    },
                    {
                        name:'磷铜球',
                        code:'52-0025L-JN',
                        target:'29.83',
                        num:'11825',
                        output:'284848',
                        unit:'41.51',
                        un:'g/SF'
                    },
                    {
                        name:'无氧铜块',
                        code:'52-0105L-JN',
                        target:'28.03',
                        num:'5200',
                        output:'199745',
                        unit:'26.03',
                        un:'g/SF'
                    },
                    {
                        name:'活化剂',
                        code:'A7-0414L-AT',
                        target:'0.55',
                        num:'150',
                        output:'267973',
                        unit:'0.56',
                        un:'g/SF'
                    }
                ];
                break;
            case '2E':
                    arr1=[
                        {
                            name:'干膜',
                            code:'A5-1012L-HI',
                            target:'1.96',
                            num:'1476356',
                            output:'752135',
                            unit:'1.96',
                            un:'SF/SF'
                        },
                        {
                            name:'碳酸钠',
                            code:'72-0080L-00',
                            target:'6.08',
                            num:'4500',
                            output:'752690',
                            unit:'5.98',
                            un:'g/SF'
                        } 
                    ];
                    break;
            case 'PP':
                arr1=[
                    {
                        name:'碱性蚀刻液',
                        code:'72-0010L-00',
                        target:'206.25',
                        num:'161400',
                        output:'735878',
                        unit:'219.33',
                        un:'g/SF'
                    },
                    {
                        name:'剥锡液',
                        code:'72-0322L-00',
                        target:'70.72',
                        num:'49680',
                        output:'735878',
                        unit:'67.51',
                        un:'g/SF'
                    }
                ];
                break;
            case 'AOI':
                arr1=[
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    }
                ];
                break;
            case 'SM':
                arr1=[
                    {
                        name:'显影添加剂',
                        code:'72-0520L-00',
                        target:'9.56',
                        num:'7380',
                        output:'808246',
                        unit:'9.13',
                        un:'g/SF'
                    },
                    {
                        name:'过硫酸钠 ',
                        code:'72-0066L-00',
                        target:'1.18',
                        num:'500',
                        output:'808246',
                        unit:'0.62',
                        un:'g/SF'
                    }
                ];
                break;
            case 'Finish':
                    arr1=[
                        {
                            name:'金盐 ',
                            code:'40-0005L-SD',
                            target:'0.20',
                            num:'2300',
                            output:'9868',
                            unit:'0.23',
                            un:'g/SF'
                        },
                        {
                            name:'过硫酸钠 ',
                            code:'72-0066L-00',
                            target:'4.26',
                            num:'250',
                            output:'63562',
                            unit:'3.93',
                            un:'g/SF'
                        },
                        {
                            name:'氢氧化钠',
                            code:'72-0140L-00',
                            target:'6.58',
                            num:'450',
                            output:'63562',
                            unit:'7.08',
                            un:'g/SF'
                        }
                    ];
                    break;
            case 'Rout':
                arr1=[
                    {
                        name:'氢氧化钠',
                        code:'72-0140L-00',
                        target:'6.58',
                        num:'450',
                        output:'63562',
                        unit:'7.08',
                        un:'g/SF'
                    }
                ];
                break;
            case 'ET':
                arr1=[
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    }
                ];
                break;
            case 'FV':
                arr1=[
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    }
                ];
                break;
            case 'Packing':
                arr1=[
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    },
                    {
                        name:'',
                        code:'',
                        target:'',
                        num:'',
                        output:'',
                        unit:'',
                        un:''
                    }
                ];
                break;
            default:
                break;
        }
        
        // console.log(arr1.length);
        return arr1;
    }

    //获取站点信息
    function getArr(section){
        //select控件内容
        var W1=['IL','Press','Drill'];
        var W2=['PTH','2E','PP'];
        var W3=['SM','Finish'];
        var W4=['Rout'];

        switch(section){
            case 'W1':
                arr=W1;
                break;
            case 'W2':
                arr=W2;
                break;
            case 'W3':
                arr=W3;
                break;
            case 'W4':
                arr=W4;
                break;
            default:
                break;
        }
        return arr;
    }

    //获取本月的天数
    function getDayNum(){
        var month=time.getMonth()+1;
        var year=time.getFullYear();
        var monS=[4,6,9,11];
        var monB=[1,3,5,7,8,10,12];
        // console.log(typeof dayNum);
        var dayNum=28;
        // console.log(monB.indexOf(month),month);
        if(monS.indexOf(month)>-1){
            dayNum=30;
        }else if(monB.indexOf(month)>-1){
            dayNum=31;
        }else{
            if(month===2){
                
                // if(year%4===0){
                //     if(year%100===0){
                //         if(year%400){
                //             dayNum=29;
                //         }else{
                //             dayNum=28;
                //         }
                //     }else{
                //         dayNum=29;
                //     }
                // }else{
                //     dayNum=28;
                // }
                
                //默认设置为28，当判断为闰年才设为29，省略了赋值28的代码
                if(year%100===0){
                    if(year%400){
                        dayNum=29;
                    }
                }else{
                    if(year%4===0){
                        dayNum=29;
                    }
                }

            }
        }

        return dayNum;
    }
    
});