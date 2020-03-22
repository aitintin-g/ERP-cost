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

    //表格相关
    var nowStation;    //当前站点
    var arrCost;       //当前站点的费用
    var arrOutput;      //当前站点产出
    var arrUnit;        //当前站点单位成本
    var arrSeries=['SR','','DM','IDM','','DL','IDL','LB','CB','','OE','DN','EM','US','OO'];
    var arrMon=['Y18 AVE','Y19 AVE','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','-'];
    var arrInit={SR:[],ML:[],DM:[],IDM:[],DL:[],IDL:[],LB:[],CB:[],OE:[],DN:[],EM:[],US:[],OO:[]};

    //生成thead中表示月份的row
    var rowOutput1=createRow('th','月份',arrMon);
    $('.main-cost thead tr').eq(1).replaceWith(rowOutput1);
    
    var rowBlank=createRow('td','Output',[]);
    var rowOutput2=createRow('th','月份',arrMon);
    $('.main-unit thead tr').eq(0).replaceWith(rowBlank);
    $('.main-unit thead tr').eq(1).replaceWith(rowOutput2);
    

    //生成tbody中无内容的表格
    paintTable(arrInit,$('.main-cost tbody'),true);

    paintTable(arrInit,$('.main-unit tbody'),true);
    //移除多余的row
    $('.main-unit tbody tr').eq(0).remove();
    $('.main-unit tbody tr').eq(0).remove();


    //select切换内容
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
        var station=$('.zhan').find('option:selected').text();
        nowStation=station;

        if(station==='---'){
            return;
        }

        //生成费用表格 
        arrCost=getCost(nowStation);
        paintTable(arrCost,$('.main-cost tbody'),true);

        //生成产出row替代初始的产出row
        arrOutput=getOutput(nowStation);
        var rowOutput=createRow('td','Output',arrOutput);
        $('.main-unit thead tr').eq(0).replaceWith(rowOutput);

        //生成单位成本表格
        arrUnit=getUnit(arrCost,arrOutput);
        paintTable(arrUnit,$('.main-unit tbody'),false);


        //生成标题
        $('.art1 h2').html(nowStation+' 制造费用');
        $('.art2 h2').html(nowStation+' 单位成本');

        // 基于准备好的dom，初始化echarts实例
        var sum=[];
        for(var i=0;i<15;i++){
            sum.push(Math.round((arrUnit['DM'][i]+arrUnit['IDM'][i]+arrUnit['DL'][i]+arrUnit['IDL'][i]+arrUnit['EM'][i]+arrUnit['US'][i]+arrUnit['OO'][i])*100)/100);
        }

        paintImg(arrUnit,sum);
  
    });

    //触发.zhan的change事件
    // $('.zhan').trigger('change');



    //获取各站各类成本费用
    function getCost(station){
        var arrCost=[];
        switch(station){
            case 'IL':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[1881422,1679619,1460943,1438755,1368083,1900928],
                    IDM:[1016403,1031521,789246,777260,739081,1026940],
                    DL:[643811,780072,499926,492333,468150,650486],
                    IDL:[437398,529972,339644,334486,318056,441933],
                    LB:[147435,148640,114485,112746,107208,148964],
                    CB:[96961,117483,75291,74148,70505,97966],
                    OE:[259796,314781,201734,198670,188911,262489],
                    DN:[283044,342950,219786,216448,205816,285979],
                    EM:[147480,178693,114519,112780,107240,149009],
                    US:[274943,333134,213496,210253,199926,277794],
                    OO:[174693,211666,135651,133591,127029,176504]
                };
                break;
            case 'Press':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[2454199,1268546,2188096,872576,1894068,2014264],
                    IDM:[1271017,606865,614584,1153932,554859,538744],
                    DL:[827361,591273,694582,782751,469241,433271],
                    IDL:[289593,560936,290662,384535,430433,507638],
                    LB:[68751,143349,100513,86746,85767,120381],
                    CB:[54122,86851,57815,95809,60171,99118],
                    OE:[180137,336395,132767,304606,168913,177811],
                    DN:[309602,294005,151740,359526,191393,150516],
                    EM:[142981,148044,159763,186512,182532,106712],
                    US:[284018,262324,230537,272447,197113,317564],
                    OO:[186024,172611,78621,142085,126785,124836]
                };
                break;
            case 'Drill':
                    arrCost={
                        SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                        DM:[872071,1468853,2118584,2022708,1848648,2113917],
                        IDM:[1113368,512431,745428,569397,1282615,1164711],
                        DL:[757989,437401,284205,550446,616676,488159],
                        IDL:[303550,482370,271747,220779,202486,236207],
                        LB:[146482,70844,131447,171078,134779,88526],
                        CB:[122588,85963,89678,105850,81176,44731],
                        OE:[237973,338113,138643,290490,307166,177264],
                        DN:[318931,187346,234598,260430,337344,225166],
                        EM:[192418,105922,169801,158536,127632,172887],
                        US:[121399,124734,318424,334967,337325,227250],
                        OO:[178206,192042,156779,160877,93978,164241]
                    };
            break;
            case 'PTH':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[2090735,2141060,1720105,1717378,2300104,1180547],
                    IDM:[751578,521059,1025771,1193715,575410,967726],
                    DL:[544456,805888,732084,611077,302655,373626],
                    IDL:[564814,309098,387164,426196,276788,241994],
                    LB:[68892,127096,169318,67091,79653,89271],
                    CB:[63252,62232,88079,109713,105888,45246],
                    OE:[163307,170961,263306,260015,196442,144781],
                    DN:[165278,124625,158358,137622,144092,172163],
                    EM:[131858,147796,180873,163030,182167,129287],
                    US:[322875,314990,242966,262029,228879,289081],
                    OO:[181740,84209,89072,229411,161958,139243]
                };
            break;
            case '2E':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[1842969,1592662,1147811,2386579,1769335,1761200],
                    IDM:[584742,797692,1320695,1327678,888764,1047281],
                    DL:[758449,527154,423820,565994,797570,406904],
                    IDL:[496054,466281,306824,338650,360367,314145],
                    LB:[161300,108950,156213,78391,126324,108164],
                    CB:[76582,97295,67883,44339,63942,52516],
                    OE:[154659,290155,206603,328638,314900,226276],
                    DN:[201943,218089,329689,322468,367698,128639],
                    EM:[109857,176675,129965,143922,68510,149026],
                    US:[153774,322904,325710,341087,179985,359486],
                    OO:[204368,227259,175419,83187,223573,163634]
                };
            break;
            case 'PP':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[869179,1812427,1795809,1109096,1623672,1017040],
                    IDM:[944317,985346,869735,1033545,1086897,942796],
                    DL:[801947,330504,620225,490986,649604,389194],
                    IDL:[508068,199049,478915,212551,459252,432388],
                    LB:[84606,183115,194001,82368,171944,126076],
                    CB:[86216,71204,88352,58048,61829,94987],
                    OE:[249648,129232,152053,332041,236360,287751],
                    DN:[268374,278063,250353,285026,214051,301242],
                    EM:[101059,182608,178469,114841,127123,94883],
                    US:[245305,283286,138254,239642,159716,207176],
                    OO:[117377,154357,79819,214294,176782,216075]
                };
            break;
            case 'SM':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[1140070,1582488,1033530,840353,2164199,1948566],
                    IDM:[1085504,775056,1191440,815218,1051398,1149672],
                    DL:[299128,744373,593223,312225,683717,381449],
                    IDL:[543991,382783,443919,481948,236583,430201],
                    LB:[185109,172253,78766,101601,177700,140854],
                    CB:[79764,91267,93422,113237,117589,123567],
                    OE:[131276,212551,174951,248816,307406,178766],
                    DN:[169490,352217,359205,251814,277623,309259],
                    EM:[157703,142839,153574,187812,126321,110119],
                    US:[293057,164270,225091,273918,298466,203077],
                    OO:[205234,228445,161335,214357,80269,131866]
                };
            break;
            case 'Finish':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[1841326,2003783,1085128,2288002,1490808,2286997],
                    IDM:[1091543,1122356,597227,476822,1015268,1321243],
                    DL:[558019,738779,433791,468855,476063,557841],
                    IDL:[220594,511578,219100,412736,309019,199025],
                    LB:[147966,103563,73109,70154,180809,72918],
                    CB:[103969,93721,69666,121132,83509,91023],
                    OE:[117261,202401,192171,214816,237990,318165],
                    DN:[300679,218320,362109,275684,334489,259600],
                    EM:[169873,71459,83248,80409,101129,89855],
                    US:[340929,167993,227149,330605,239309,175423],
                    OO:[223180,115156,167387,132278,216424,228450]
                };
            break;
            case 'Rout':
                arrCost={
                    SR:[69469655,76665480,63907547,58837193,65434915,71043312],
                    DM:[2298683,2048062,2388593,1746009,1245437,1793533],
                    IDM:[555580,1030621,1196283,1164212,702156,561861],
                    DL:[574545,696942,781070,419760,808984,410770],
                    IDL:[490950,316227,360727,303156,493268,481740],
                    LB:[130692,179332,91446,97442,71077,79335],
                    CB:[93099,43438,53135,87471,87667,117390],
                    OE:[327725,293014,323279,271908,335933,329714],
                    DN:[298131,199314,180623,362307,368517,229575],
                    EM:[94958,145138,93161,150484,76413,114324],
                    US:[289955,307209,141941,195953,232305,360015],
                    OO:[217493,217190,82889,79890,101349,160262]
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
                arrOutput=[1053123,997360,1244309,1262360,1299722,1023489];
                break;
            case 'Press':
                arrOutput=[1353123,1197760,1244409,1202360,1209722,1023089];
                break;
            case 'Drill':
                arrOutput=[1073123,907360,1204309,1202360,1099722,1003489];
                break;
            case 'PTH':
                arrOutput=[1025113,1092360,1243309,1232360,1529722,1145489];
                break;
            case '2E':
                arrOutput=[1253523,1127760,1244409,1205360,1279722,1023089];
                break;
            case 'PP':
                arrOutput=[1013123,1022360,1274309,1202360,1075722,1003489];
                break;
            case 'SM':
                arrOutput=[1023123,1117360,1042309,1067370,1397722,1223489];
                break;
            case 'Finish':
                arrOutput=[1322123,814760,1042409,1072360,1909722,1026789];
                break;
            case 'Rout':
                arrOutput=[1023923,1007360,1276309,1252360,1459722,1053189];
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

    //绘制表格  分为一般tr与特殊tr
    function paintTable(arrData,tbody,isCost){
        //清空tbody之前的内容
        tbody.html('');
        //生成tr并添加到tbody中
        for(var i=0;i<arrSeries.length;i++){
            if(arrSeries[i]===''){
                var tr=createRow('td',arrSeries[i],[]);
                tbody.append(tr);
            }else if(arrSeries[i]!==''){ 
                var tr=createRow('td',arrSeries[i],arrData[arrSeries[i]]);
                tbody.append(tr);
            }
        }
        

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

    //生成特殊tr并插入表格
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

    //生成一般tr，暂时不插入表格
    function createRow(element,seriesName,eleContent){  //tr下要添加的元素 要添加的行名称 元素的内容  
        var tr=document.createElement('tr');
        var shtml='<'+element+'>'+seriesName+'</'+element+'>';
        for(var i=0;i<15;i++){
            if(eleContent[i]===undefined){
                shtml+='<'+element+'></'+element+'>';
            }else{
                shtml+='<'+element+'>'+eleContent[i]+'</'+element+'>';
            }
        }
        $(tr).html(shtml);
        // console.log(eleContent);
        return tr;

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

    function paintImg(arrUnit,sum){
        var myChart = echarts.init($('#costData').get(0));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            title: {
                text: 'Cost Analysis：'
            },
            legend: {
                data: ['Direct Material', 'Indirect Material', 'Direct Labor', 'Indirect Labor', 'Local - Bonus', 'C&B', 'Outsourcing Expenses', 'Depreciation', 'Equipment Maintenance','Utilities','Other Factory Overheads'],
                top:30
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
                    data: ['Y18 AVE','Y19 AVE','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
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
                    stack: '单耗',
                    data: arrUnit['DM'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#9bbb59'
                    }
                },
                {
                    name: 'Indirect Material',
                    type: 'bar',
                    stack: '单耗',
                    data: arrUnit['IDM'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#8064a2'
                    }
                },
                {
                    name: 'Direct Labor',
                    type: 'bar',
                    stack: '单耗',
                    data: arrUnit['DL'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#4f81bd'
                    }
                },
                {
                    name: 'Indirect Labor',
                    type: 'bar',
                    stack: '单耗',
                    data: arrUnit['IDL'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#4bacc6'
                    }
                },
                {
                    name: 'Equipment Maintenance',
                    type: 'bar',
                    stack: '单耗',
                    data: arrUnit['EM'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#c0504d'
                    }
                },
                {
                    name: 'Utilities',
                    type: 'bar',
                    stack: '单耗',
                    data: arrUnit['US'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#fcd5b4'
                    }
                },
                {
                    name: 'Other Factory Overheads',
                    type: 'bar',
                    barWidth:'60%',
                    stack: '单耗',
                    data: arrUnit['OO'],
                    label:{
                        show:true,
                        backgroundColor:'transparent',
                        padding:[1,5,1,5],
                        position:'inside',
                        fontSize:12,
                        color:'#111'
                    },
                    itemStyle: {
                        color: '#c5d9f1'
                    }
                },
                {
                    name: 'sum',
                    type: 'line',
                    data: sum,
                    lineStyle: {
                        color: '#4a7ebb',
                        width:3
                    },
                    itemStyle: {
                        color: '#4a7ebb'
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    
   
});