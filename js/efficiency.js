$(function(){
    //扩展菜单
    $('.nav li').eq(3).hover(function(){
        $('.extends').css('height',120);
    },function(){
        $('.extends').css('height',0);
    });

    time=new Date();
    $('.date').html(time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate());

    var arrPro=['产出PNL','总工时','人均公时产出'];
    var arrMon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var monNum=time.getMonth()+1;
    var wkNum=Math.floor(time.getDate()/7)>3?3:Math.floor(time.getDate()/7);


    //生成各站效率表格
    var thtml='<th>Process</th><th>Target</th>';
    var sum=0;
    for(var i=0;i<monNum-1;i++){
        for(var j=0;j<4;j++){
            sum++;
            thtml+='<th>wk'+sum+'</th>';
        }
        thtml+='<th class="month">'+arrMon[i]+'</th>';
        if(i===monNum-2){
            for(var k=0;k<wkNum;k++){
                sum++;
                thtml+='<th>wk'+sum+'</th>';                
            }
        }
    }
    $('.contain thead').html(thtml);

    var bhtml='';
    for(var i=0;i<arrPro.length;i++){
        bhtml+='<tr><td></td><td></td>';
        for(var j=0;j<sum+monNum-1;j++){
            bhtml+='<td>1</td>'
        }
        bhtml+='</tr>'
    }
    $('.contain tbody').html(bhtml);


    $('.duan').change(function(){
        var shtml='<option>---</option>';
        var section=$('.duan').val();
        var arr=getArr(section);
        
        for(var i=0;i<arr.length;i++){
            shtml+='<option>'+arr[i]+'</option>';
        }
        
        $('.zhan').html(shtml);
    });

    //绘制图形
    var item={
        xData:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    };
    item.name='IL';
    item.unit=[16.1,15.9,15.5,15.8];
    item.target=[15.7,15.7,15.7,15.7,15.7,15.7,15.7,15.7,15.7,15.7,15.7,15.7];

    paintImg(item,$('#dayData'),'每月效率');


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
                data:['实际效率','目标效率']
            },
            xAxis: {
                data: xData
            },
            yAxis: {
                min:'dataMin',
                max:'dataMax'
            },
            series: [{
                name: '实际效率',
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
                name: '目标效率',
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

});