$(function(){
    
    //扩展菜单
    $('.nav li').eq(3).hover(function(){
        $('.extends').css('height',120);
    },function(){
        $('.extends').css('height',0);
    });



    //利用遮罩实现Excel冻结窗口效果
    $('.cost').scroll(function(){
        // console.log($('.cost').scrollLeft());
        leftIncrement=$('.cost').scrollLeft();
        $('.m1').css('left',leftIncrement);
        $('.rm1').css('right',-leftIncrement)
        
    });


    var nowStation;    //当前站点
    var arrCost;       //当前站点的费用
    var arrOutput;      //当前站点产出
    var arrUnit;        //当前站点单位成本
    var arrSeries=['SR','','DM','IDM','','DL','IDL','LB','CB','','OE','DN','EM','US','OO'];
    var arrMon=['月份','Y18 AVE','Y19 AVE','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','-'];

    //生成表格thead下的tr
    var monhtml='';
    for(var i=0;i<arrMon.length;i++){
        monhtml+='<th>'+arrMon[i]+'</th>';
    }
    $('.main-cost thead tr').eq(1).html(monhtml);
    $('.main-unit thead tr').eq(1).html(monhtml);

    //生成无内容的表格
    var arrInit={SR:[],ML:[],DM:[],IDM:[],DL:[],IDL:[],LB:[],CB:[],OE:[],DN:[],EM:[],US:[],OO:[]};
    paintTable(arrInit,$('.main-cost tbody'),true);


    //select切换内容
    $('.zhan').change(function(){
        var station=$('.zhan').find('option:selected').text();
        nowStation=station;
        if(station==='---'){
            return;
        }

    //生成费用表格
    // var thtml='';
    // var arrTemp=[];
    // arrCost=getCost(nowStation);
    // for(var i=0;i<arrSeries.length;i++){
    //     thtml+='<tr><td></td>';
    //     if(arrSeries[i]!==''){
    //         arrTemp=arrCost[arrSeries[i]];
    //         for(var j=0;j<15;j++){
    //             if(arrTemp[j]===undefined){
    //                 thtml+='<td></td>';
    //             }else{
    //                 thtml+='<td>'+arrTemp[j]+'</td>';
    //             }
    //         }
    //     }else if(arrSeries[i]===''){
    //         for(var j=0;j<15;j++){
    //             thtml+='<td></td>';
    //         }
    //     }
    //     thtml+='</tr>';
    // }
    // // console.log(thtml);
    // $('.main-cost tbody').html(thtml);  
    

    arrCost=getCost(nowStation);
    paintTable(arrCost,$('.main-cost tbody'),true);



    //生成单位成本表格
    arrOutput=getOutput(nowStation);
    // console.log(arrOutput);
    var uhtml='<td></td>';
    for(var i=0;i<15;i++){
        if(arrOutput[i]===undefined){
            uhtml+='<td></td>';
        }else{
            uhtml+='<td>'+arrOutput[i]+'</td>';
        }
    }
    $('.main-unit thead tr').eq(0).html(uhtml);
    
    // console.log(getUnit(arrCost,arrOutput));
    // var UNhtml='';
    // var arrTemp2=[];
    // arrUnit=getUnit(arrCost,arrOutput);
    // for(var i=0;i<arrSeries.length;i++){
    //     UNhtml+='<tr><td></td>';
    //     if(arrSeries[i]!==''){
    //         arrTemp2=arrUnit[arrSeries[i]];
    //         for(var j=0;j<15;j++){
    //             if(arrTemp2[j]===undefined){
    //                 UNhtml+='<td></td>';
    //             }else{
    //                 UNhtml+='<td>'+arrTemp2[j]+'</td>';
    //             }
    //         }
    //     }else if(arrSeries[i]===''){
    //         for(var j=0;j<15;j++){
    //             UNhtml+='<td></td>';
    //         }
    //     }
    //     UNhtml+='</tr>';
    // }
    // // console.log(UNhtml);
    // $('.main-unit tbody').html(UNhtml);

    arrUnit=getUnit(arrCost,arrOutput);
    paintTable(arrUnit,$('.main-unit tbody'),false);


    //生成标题
    $('.art1 h2').html(nowStation+' 制造费用');
    $('.art2 h2').html(nowStation+' 单位成本');

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init($('#costData').get(0));
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['Direct Material', 'Indirect Material', 'Direct Labor', 'Indirect Labor', 'Local - Bonus', 'C&B', 'Outsourcing Expenses', 'Depreciation', 'Equipment Maintenance','Utilities','Other Factory Overheads']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Y18 AVE', 'Y19 AVE', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Direct Material',
                type: 'bar',
                stack: '广告',
                data: [320, 332, 301, 334, 390, 330, 320],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Indirect Material',
                type: 'bar',
                stack: '广告',
                data: [120, 132, 101, 134, 90, 230, 210],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Direct Labor',
                type: 'bar',
                stack: '广告',
                data: [220, 182, 191, 234, 290, 330, 310],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Indirect Labor',
                type: 'bar',
                stack: '广告',
                data: [150, 232, 201, 154, 190, 330, 410],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Equipment Maintenance',
                type: 'bar',
                stack: '广告',
                data: [60, 72, 71, 74, 190, 130, 110],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Utilities',
                type: 'bar',
                stack: '广告',
                data: [62, 82, 91, 84, 109, 110, 120],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'Other Factory Overheads',
                type: 'bar',
                barWidth:'60%',
                stack: '广告',
                data: [62, 82, 91, 84, 109, 110, 120],
                label:{
                    show:true,
                    backgroundColor:'transparent',
                    padding:[1,5,1,5],
                    position:'inside',
                    fontSize:12,
                    color:'#111'
                }
            },
            {
                name: 'sum',
                type: 'line',
                data: [62, 82, 91, 84, 109, 110, 120],
                // label:{
                //     show:true,
                //     backgroundColor:'transparent',
                //     padding:[1,5,1,5],
                //     position:'inside',
                //     fontSize:12,
                //     color:'#111'
                // }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    

    });

    //触发.zhan的change事件
    // $('.zhan').trigger('change');



    //获取各站各类成本费用
    function getCost(station){
        var arrCost=[];
        switch(station){
            case 'IL':
                arrCost={
                    SR:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    IDM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DL:[2528646,2528646,2528646,2528646,2528646,2528646],
                    IDL:[18202025,18202025,18202025,18202025,18202025,18202025],
                    LB:[2528646,2528646,2528646,2528646,2528646,2528646],
                    CB:[18202025,18202025,18202025,18202025,18202025,18202025],
                    OE:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DN:[2528646,2528646,2528646,2528646,2528646,2528646],
                    EM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    US:[2528646,2528646,2528646,2528646,2528646,2528646],
                    OO:[18202025,18202025,18202025,18202025,18202025,18202025]
                };
                break;
            case 'Press':
                arrCost={
                    SR:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    IDM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DL:[2528646,2528646,2528646,2528646,2528646,2528646],
                    IDL:[18202025,18202025,18202025,18202025,18202025,18202025],
                    LB:[2528646,2528646,2528646,2528646,2528646,2528646],
                    CB:[18202025,18202025,18202025,18202025,18202025,18202025],
                    OE:[18202025,18202025,18202025,18202025,18202025,18202025],
                    DN:[2528646,2528646,2528646,2528646,2528646,2528646],
                    EM:[18202025,18202025,18202025,18202025,18202025,18202025],
                    US:[2528646,2528646,2528646,2528646,2528646,2528646],
                    OO:[18202025,18202025,18202025,18202025,18202025,18202025]
                };
                break;
            case 'Drill':
                    arrCost={
                        SR:[],
                        ML:[],
                        DM:[],
                        IDM:[],
                        MR:[18202025,18202025,18202025,18202025,18202025,18202025],
                        DL:[2528646,2528646,2528646,2528646,2528646,2528646],
                        IDL:[18202025,18202025,18202025,18202025,18202025,18202025],
                        LB:[2528646,2528646,2528646,2528646,2528646,2528646],
                        CB:[18202025,18202025,18202025,18202025,18202025,18202025],
                        OS:[2528646,2528646,2528646,2528646,2528646,2528646],
                        OE:[18202025,18202025,18202025,18202025,18202025,18202025],
                        DN:[2528646,2528646,2528646,2528646,2528646,2528646],
                        EM:[18202025,18202025,18202025,18202025,18202025,18202025],
                        US:[2528646,2528646,2528646,2528646,2528646,2528646],
                        OO:[18202025,18202025,18202025,18202025,18202025,18202025]
                    };
                    break;
            default:
                break;
        }
        return arrCost;
    }

    //获取各站的产出面积
    function getOutput(station){
        var arrOutput=[];
        switch(station){
            case 'IL':
                arrOutput=[1093173,587360,1218409,1262870,1299556,1055389,914393,1058675,1271238];
                break;
            case 'Press':
                arrOutput=[1093173,587360,1218409,1262870,1299556,1055389,914393,1058675,1271238];
                break;
            case 'Drill':
                arrOutput=[1093173,587360,1218409,1262870,1299556,1055389,914393,1058675,1271238];
                    break;
            default:
                break;
        }
        return arrOutput;
    }

    //获取各站的单位成本
    function getUnit(cost,output){
        for(var key in cost){
            var i=0;
            cost[key]=cost[key].map(function(x){
                
                return Math.round(x/output[i++]*100)/100;
            });
        }
        // console.log(cost);
        return cost;
    }

    //绘制表格
    function paintTable(arrData,tbody,isCost){
        var thtml='';
        var arrTemp=[];
        for(var i=0;i<arrSeries.length;i++){
            thtml+='<tr><td></td>';
            if(arrSeries[i]!==''){
                arrTemp=arrData[arrSeries[i]];
                for(var j=0;j<15;j++){
                    if(arrTemp[j]===undefined){
                        thtml+='<td></td>';
                    }else{
                        thtml+='<td>'+arrTemp[j]+'</td>';
                    }
                }
            }else if(arrSeries[i]===''){
                for(var j=0;j<15;j++){
                    thtml+='<td></td>';
                }
            }
            thtml+='</tr>';
        }
        // console.log(thtml);
        tbody.html(thtml);
    
        //添加几个特定的子元素
        //addTr无法访问到arrData,因为它定义在全局环境中，全局和它自身都没有arrData,所以访问不到
        // var arrData=arrData;
        // console.log(arrData);
        addTr(['DM','IDM'],arrData,tbody,1,true);
        addTr(['DL','IDL'],arrData,tbody,5,true);
        addTr(['OE','DN','EM','US'],arrData,tbody,11,true);
        addTr(['DM','IDM','DL','IDL','OE','DN','EM','US'],arrData,tbody,17,true);
        if(isCost){
            addTr(['DM','IDM','DL','IDL','LB','CB','OE','DN','EM','US'],arrData,tbody,18,false);
        }else{
            tbody.find('tr').eq(0).remove();
        }
    }

    //生成并插入表格的tr
    function addTr(addArr,arrData,tbody,index,isAdd){
        var sum;
        var MT=document.createElement('tr');
        var MThtml='<td></td>';
        for(var i=0;i<15;i++){
            if(arrData['SR'][i]===undefined){
                MThtml+='<td></td>';
            }else{
                sum=0;
                for(var j=0;j<addArr.length;j++){
                    sum+=arrData[addArr[j]][i];
                }
                if(!isAdd){
                    sum=Math.round(sum/arrData['SR'][i]*1000)/10+'%';
                }else{
                    sum=Math.round(sum*100)/100;
                }
                // console.log(sum);
                // console.log(arrData['DL'][i],arrData['IDL'][i]);
                MThtml+='<td>'+sum+'</td>';
            }
        }
        $(MT).html(MThtml);
        $(MT).insertAfter(tbody.find('tr').eq(index));
    }

    

    
   
});