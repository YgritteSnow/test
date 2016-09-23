/**
 * Created by Wanjun Jin on 2016/9/6 0006.
 */

/*************************************************
 * 对外函数
 *************************************************/
const E_SATISFY_SUCCEED = 1;
const E_SATISFY_FAILED_MAXGAP = 2;
const E_SATISFY_FAILED_NOTMATCH = 3;
const E_SATISFY_FAILED_ALREADYFULL = 4;

/**
 * Pattern 模式类（单个模式）
 * @param iPatternNo 目标pattern
 * @param aCardArray 初始化的数据
 * @return 生成的Pattern对象
 * @constructor
 */
function PatternConstructor(iPatternNo, aCardArray) {
    return {
        // 模式类型
        m_iPatternNo:iPatternNo,

        // 已经加入的牌
        m_aCards:(function(){
            if(aCardArray == undefined) {
                return new Array();
            }else{
                return aCardArray; //直接赋值为输入的临时变量
            }
        })(),

        // 还需要的牌的数量
        GetInNeedCardCount: function(){
            return GetPatternByNo(this.m_iPatternNo).length - this.m_aCards.length;
        },

        // 尝试添加牌，如果成功将会改变自己
        TrySatisfy:function(iCardNo){
            var pattern = GetPatternByNo(this.m_iPatternNo);
            var idx = this.m_aCards.length;
            if(idx >= pattern.length){
                return E_SATISFY_FAILED_ALREADYFULL;
            }else if( idx == 0 ){
                this.m_aCards.push(iCardNo);
                return E_SATISFY_SUCCEED;
            }else{
                var last_card = this.m_aCards[idx-1];
                var need_card = last_card + pattern[idx] - pattern[idx-1];
                if( need_card < iCardNo )
                {
                    return E_SATISFY_FAILED_MAXGAP;
                }else if( need_card > iCardNo )
                {
                    return E_SATISFY_FAILED_NOTMATCH;
                }else{
                    this.m_aCards.push(iCardNo)
                    return E_SATISFY_SUCCEED;
                }
            }
        },

        // 深拷贝自己
        CopySelf:function(){
            return PatternConstructor(this.m_iPatternNo, this.m_aCards.slice(0)); // 浅拷贝已经足够
        },

        // 显示字符串
        toString:function(){
            var t_str = "(";
            for(var t_idx in this.m_aCards){
                t_str += (this.m_aCards[t_idx] + ', ');
            }
            t_str += ")";
            return t_str;
        },

        // 是否与另一个模式相等
        IsEqual:function(otherPattern){
            if( this.m_iPatternNo != otherPattern.m_iPatternNo){
                return false;
            }
            if( this.m_aCards.length != otherPattern.m_aCards.length){
                return false;
            }
            for( var idx in this.m_aCards ){
                if( this.m_aCards[idx] != otherPattern.m_aCards[idx] ){
                    return false;
                }
            }
            return true;
        },

        // 比较大小优先级：模式类型>模式完成度
        Compare:function(otherPattern){
            if( this.m_iPatternNo != otherPattern.m_iPatternNo ){
                return this.m_iPatternNo > otherPattern.m_iPatternNo;
            }
            if( this.m_aCards[0] != otherPattern.m_aCards[0] ){
                return this.m_aCards[0] > otherPattern.m_aCards[0];
            }
            return this.m_aCards.length >= otherPattern.m_aCards.length;
        }
    };
}

/**
 * PatternTreeNode 解决树的结点类（多个模式组成的列表）
 * @param defaultList
 * @returns {{m_aPatterns: Array, GenerateForNewCard: GenerateForNewCard}}
 * @constructor
 */
function PatternTreeNodeConstructor(defaultList) {
    return {
        m_aPatterns:(function() {
            if(defaultList == undefined)
                return new Array();
            else {
                return defaultList; // 使用临时变量直接赋值
            }
        })(),

        GenerateChildren:function (iCardNo, iCardRemainCount){ // 对于一个新加入的节点，返回它所有可能的下一级节点
            // 结果
            var aResultNodes = new Array();

            // 使新卡作为新pattern总是合法的
            var t_selfCopy = this.CopySelf();
            var t_selfCopyPatterns = t_selfCopy.m_aPatterns;
            for (var t_iPatternNoIdx in GetAllPatternNo())
            {
                var t_iPatternNo = GetAllPatternNo()[t_iPatternNoIdx];
                t_selfCopyPatterns.push(PatternConstructor(t_iPatternNo, [iCardNo, ]));
                if( t_selfCopy.CheckIfCardRemainSufficient(iCardRemainCount-1) )
                {
                    aResultNodes.push(t_selfCopy);
                    // console.log(t_selfCopy.toString());
                    var t_selfCopy = this.CopySelf();
                    var t_selfCopyPatterns = t_selfCopy.m_aPatterns;
                }
            }

            // 遍历自己每一个Pattern，尝试把新卡加进去
            t_selfCopy = this.CopySelf();
            t_selfCopyPatterns = t_selfCopy.m_aPatterns;
            for (var idx = 0; idx < this.m_aPatterns.length; idx++ ) {
                var result = t_selfCopyPatterns[idx].TrySatisfy(iCardNo);
                switch(result) {
                    case E_SATISFY_SUCCEED: // 如果成功，将顺便修改临时副本的值，所以将此项直接加入结果
                    {
                        if( t_selfCopy.CheckIfCardRemainSufficient(iCardRemainCount-1) ) {
                            aResultNodes.push(t_selfCopy);
                            t_selfCopy = this.CopySelf();
                            t_selfCopyPatterns = t_selfCopy.m_aPatterns;
                        }
                    }
                        break;

                    case E_SATISFY_FAILED_MAXGAP: // 已经达到最大间隔，证明这整个结点已经没希望了，所以直接返回空
                        return null;
                    case E_SATISFY_FAILED_NOTMATCH: // 没有匹配，但还有希望
                        break;
                    case E_SATISFY_FAILED_ALREADYFULL: // 节点已满，只能把新卡作为新pattern了，但是这个已经加入过了
                        break;
                }
            }

            for( var idx in aResultNodes){
                aResultNodes[idx].SortSelf();
            }

            return aResultNodes;
        },

        CheckIfCardRemainSufficient:function(iCardRemainCount) {
            var t_iNeedCount = 0;
            for( var t_patIdx in this.m_aPatterns){
                var t_pat = this.m_aPatterns[t_patIdx];
                t_iNeedCount += t_pat.GetInNeedCardCount();
            }
            if( t_iNeedCount <= iCardRemainCount )
            {
                return true;
            }else{
                return false;
            }
        },

        CopySelf:function(){
            var tempList = new Array();
            for (var t_iPat in this.m_aPatterns){
                tempList.push(this.m_aPatterns[t_iPat].CopySelf());
            }
            return PatternTreeNodeConstructor(tempList);
        },

        toString:function(){
            var t_str = "";
            t_str += "=--------------\n";
            for (var t_idx in this.m_aPatterns){
                var t_pat = this.m_aPatterns[t_idx];
                t_str += ("|| " + t_pat.m_iPatternNo + ' | ' + t_pat.toString()+"\n");
            }
            t_str += "---------------\n";
            return t_str;
        },

        // 两个结点是否一样
        IsEqual:function( otherPatternNode ){
            if( this.m_aPatterns.length != otherPatternNode.m_aPatterns.length ){
                return false;
            }

            for(var idx in this.m_aPatterns){
                if( ! this.m_aPatterns[idx].IsEqual(otherPatternNode.m_aPatterns[idx]) ){
                    return false;
                }
            }

            return true;
        },

        // 排序自己
        SortSelf:function(){
            this.m_aPatterns.sort(function(a, b){
                return a.Compare(b);
            })
        }
    };
};

/**
 * PattenTreeNode 的列表的去重
 * @param srcNodeList
 * @returns {Array}
 * @constructor
 */
function EraseRepeat( srcNodeList ){
    var dstNodeList = [];
    for( var idx_src in srcNodeList ){
        var already_have = false;
        for( var idx_dst in dstNodeList ){
            if( dstNodeList[idx_dst].IsEqual( srcNodeList[idx_src] ) ){
                already_have = true;
                break;
            }
        }

        if( !already_have ){
            dstNodeList.push( srcNodeList[idx_src] );
        }
    }
    return dstNodeList;
}

/**
 * 输入一列数字，输出该列数字的所有可能的 PatternTreeNode
 * @param {Array[int]} cardnum_list 输入的麻将牌序列
 * @return {Array[int]} pattern_list 输出该麻将序列的所有可能的组合方法
 * @constructor
 */
function FindPatternsByCardNums( cardnum_list ){
    console.log("Begin FindPatternsByCardNums " + new Date());

    var result = new Array();
    result.push(PatternTreeNodeConstructor());

    var iRemainCardCount = cardnum_list.length;
    for (var t_iCardNoIdx in cardnum_list){
        var t_iCardNo = cardnum_list[t_iCardNoIdx];

        var new_result = new Array();
        for(var t_patNodeIdx in result){
            var t_patNode = result[t_patNodeIdx];
            var t_aNextNodes = t_patNode.GenerateChildren(t_iCardNo, iRemainCardCount);
            if( Boolean(t_aNextNodes) )
            {
                new_result = new_result.concat(t_aNextNodes);
            }
        }
        result = EraseRepeat(new_result);
        iRemainCardCount --;
    }

    console.log("***************result****************");
    for(var idx in result){
        console.log(result[idx].toString());
    }
    console.log("*************************************");

    console.log("End FindPatternsByCardNums" + new Date());

    return result;
};

FindPatternsByCardNums([1,2,3, 3,3, 4,5,6, 7,7,7, 7,8,9]);

/**
 * 工具函数，使用排序函数来同时排序多个等长列表
 * 如果不符合“全部登场”和“至少一个”，将会报错
 * @param lists
 * @return 排序后的lists
 * @constructor
 */
function SortLists( lists, sortFuncList ){
    var result = [];
    for(var idx_small in lists[0]){
        var item = [];
        for(var idx_big in lists){
            item.push(lists[idx_big][idx_small])
        }
        result.push(item);
    }
    result.sort(function(key_list_1, key_list_2){
        for(var idx in sortFuncList){
            var sortFunc = sortFuncList[idx];
            if( !sortFunc(key_list_1[idx], key_list_2) ){
                return false;
            }
        }
        return true;
    });

    lists = [];
    for(var idx_big in result){
        var item = [];
        for(var idx_small in result[0]){
            item.push(result[idx_small][idx_big])
        }
        lists.push(item);
    }
    return lists;
}

function InList(list, item){
    for(var idx in list){
        if(item == list[idx]){
            return true;
        }
    }
    return false;
}
function AllSame_one(list, item){
    for( var idx in list ){
        if( item != list[idx] ){
            return false;
        }
    }
    return true;
}
function AllSame_list(listDest, listSrc){
    for( var idx_src in listSrc){
        if(!AllSame_one(listDest, listSrc[idx_src])){
            return false;
        }
    }
    return true;
}
function SetDefault(map, key, defaultvalue){
    if( map[key] == undefined ){
        map[key] = defaultvalue;
    }
    return map;
}
function PushListLikeSet(list, item){
    if(InList(list, item)){
        return;
    }
    list.push(item);
}

/**
 * 按顺序匹配实际花色，和花色的匹配模式。
 * 匹配模式中的数据分为两种：
 * 1. A类 相同 (1,2,3,4) ：必须等于该channel值
 * 2. B类 严格不相同 (-1,-2,-3,-4) ：不可以与其他A类或B类通道内的花色相同
 * 4. C类 任意 (-999) ：完全任意
 * @param originFlowerList
 * @param matchChannelList
 * @param channel2flower 已有的channel到flower的映射
 * @param flower2channel 已有的flower到channel的映射
 * @returns {boolean}
 * @constructor
 */
function RecurseFlowerMatch_order_x(originFlowerList, matchChannelList, channel2flower, flower2channel){
    if( originFlowerList.length != matchFlowerList.length ){
        return false;
    }

    // 递归终点
    if( originFlowerList.length == 1 ){
        return RecurseFlowerMatch_order_y(originFlowerList, matchChannelList, channel2flower, flower2channel);
    }

    // 对originFlowerList的第一个结点，遍历其匹配matchChannelList的每一种可能
    for( var idx in matchChannelList ) {
        if (RecurseFlowerMatch_order_y(originFlowerList.slice(0, 1), matchChannelList.slice(idx, idx+1), channel2flower, flower2channel)) {
            return RecurseFlowerMatch_order_x(originFlowerList.slice(1), matchChannelList.slice(1), channel2flower, flower2channel);
        }
    }
}

/**
 * 按顺序匹配实际花色，和花色的匹配模式。
 * 匹配模式中的数据分为两种：
 * 1. A类 相同 (1,2,3,4) ：必须等于该channel值
 * 2. B类 严格不相同 (-1,-2,-3,-4) ：不可以与其他A类或B类通道内的花色相同
 * 4. C类 任意 (-999) ：完全任意
 * @param originFlowerList
 * @param matchChannelList
 * @param channel2flower 已有的channel到flower的映射
 * @param flower2channel 已有的flower到channel的映射
 * @returns {boolean}
 * @constructor
 */
function RecurseFlowerMatch_order_y(originFlowerList, matchChannelList, channel2flower, flower2channel){
    if( originFlowerList.length != matchChannelList.length ){
        return false;
    }

    if(channel2flower == undefined)channel2flower = {};
    if(flower2channel == undefined)flower2channel = {};

    for(var idx in originFlowerList){
        var channel = matchChannelList[idx];
        var flower = originFlowerList[idx];

        SetDefault(channel2flower, channel, [] );
        SetDefault(flower2channel, flower, channel );

        if( GetPatternCombo_flower_A(channel) ) { // A类 相同 (1,2,3,4) ：必须等于该channel值
            if( channel != flower ){
                return false;
            }
        }
        else if( GetPatternCombo_flower_B(channel) ){ // B类 严格不相同 (-1,-2,-3,-4) ：不可以与其他A类或B类通道内的花色相同
            if( !AllSame_one(channel2flower[channel]) ) {// 需要和已经进入该channel的所有花色一致
                return false;
            }
            if( !GetPatternCombo_flower_C(flower2channel[flower]) && flower2channel[flower] != channel ){// 该flower已经在的channel只能与此channel相同
                return false;
            }

            flower2channel[flower] = channel; // 覆盖为更高级的channel
        }
        else if( GetPatternCombo_flower_C(channel) ){ // 如果不是需要互不相同的channel:(-999)
            // 该flower已经在的channel只能是任意
            if( !GetPatternCombo_flower_C(flower2channel[flower]) ){
                return false;
            }
        }

        channel2flower[channel].push(flower);
    }

    return true;
}

/**
 * 给定一个 matchFlowerList 作为要匹配的花色，以及要测试的花色的列表，来计算是否匹配
 * @param originFlowerList 要检测的花色列表
 * @param matchFlowerList 要匹配的目标花色
 * @param needMatch 需要匹配顺序
 * @returns {boolean}
 * @constructor
 */
function CalIfFlowerMatch(originFlowerList, matchFlowerList, needMatch){
    if (needMatch) { // 需要花色数字匹配，那么一个一个按顺序计算花色是否匹配
        return RecurseFlowerMatch_order_y(originFlowerList, matchFlowerList);
    }
    else { // 不需要花色数字匹配，那么递归计算
        return RecurseFlowerMatch_order_x
    }

    return true;
}

/**
 * 根据数字pattern列表和其对应的花色的列表，计算它满足的所有patternCombo
 * @param numPatternList
 * @param flowerList
 * @returns {Array}
 * @constructor
 */
function GetAllPatternCombo(numPatternList, flowerList) {
    var res = [];
    var higherPatternList = [];
    for(var idx in numPatternList){
        higherPatternList.push( GetHigherPatternByNo(numPatternList[idx].m_iPatternNo) )
    }

    // 整理一下要匹配的 pattern 和 flower 的列表
    var t_d = SortLists([higherPatternList, flowerList], (
            function(a,b){
                return a.m_iPatternNo > b.m_iPatternNo;
            },
            function(a, b) {
                return a > b;
            })
    );

    higherPatternList = t_d[0];
    flowerList = t_d[1];

    // 遍历检查每一个patternCombo
    for (var idx in GetAllPatternComboNo()) {
        var comboNo = GetAllPatternComboNo()[idx];
        var comboNum = GetPatternCombo_num(comboNo);

        // 临时变量，记录需要continue的标志
        var t_continue_flag = false;

        // 长度不符合，continue
        if( comboNum != higherPatternList.length ){
            t_continue_flag = true;
        }
        if(t_continue_flag)continue;

        // 数字的模式不符合，continue
        for( var idx in comboNum ){
            if( higherPatternList[idx].m_iPatternNo != comboNum[idx] ){
                t_continue_flag = true;
                break;
            }
        }
        if(t_continue_flag)continue;

        var comboFlower = GetPatternCombo_flower(comboNo);
        var comboNeedMatch = GetPatternCombo_needMatch(comboNo);

        if( CalIfFlowerMatch(flowerList, comboFlower, comboNeedMatch) ){
            res.push(comboNo);
        }
    }
    return res;
};

/**
 * 根据牌型来寻找所有满足的patternCombo
 * @param card_list
 * @returns {Array}
 * @constructor
 */
function FindPatternsByCard( card_list ) {
    console.log("Begin FindPatternsByCard" + new Date());
    var flower_buff = [];
    for (var idx in card_list) {
        var cardno = card_list[idx];
        var card_flower = GetCardFlower(cardno);
        if (flower_buff[card_flower] == undefined) {
            flower_buff[card_flower] = []
        }
        flower_buff[card_flower].push(cardno);
    }

    // 记录所有花色通道的解决方案的列表，如果没有那么置为空列表
    var flower_solve = [];
    for (var idx in GetCardFlowerHo) {
        var flower = GetCardFlowerHo()[idx];
        if (flower_buff[flower] != undefined) {
            var card_list = flower_solve[flower];
            flower_solve[flower] = FindPatternsByCardNums(card_list);
        }
        else {
            flower_solve[flower] = [];
        }
    }

    // 遍历花色的索引，用于辅助遍历每个花色的解决方案列表
    var t_traverseIdx = [];
    for (var idx in GetCardFlowerHo()) {
        t_traverseIdx[GetCardFlowerHo()[idx]] = 0
    }

    // 所有的胡牌牌型
    var final_result = [];

    // 遍历合并不同花色的解决方案列表
    var t_traverse_solve = [];
    var t_traverse_flower = [];
    // 开始遍历
    var t_traverseEnd = false; // 标志着遍历了所有可能的组合
    while (t_traverseEnd) {
        // 获取当前的遍历的
        t_traverse_solve = [];
        t_traverse_flower = [];
        for (var idx in GetCardFlowerHo()) {
            var flower = GetCardFlowerHo()[flower]
            var tri_idx = t_traverseIdx[flower];
            if (tri_idx < flower_solve[flower].length) {
                t_traverse_solve += flower_solve[flower][tri_idx];
                for (var t_idx in flower_solve[flower][tri_idx]) {
                    t_traverse_flower.push(flower);
                }
            }
        }

        final_result += GetAllPatternCombo(t_traverse_solve, t_traverse_flower);

        // 判断是否遍历结束
        t_traverseEnd = true;
        for (var idx in GetCardFlowerHo()) {
            var flower = GetCardFlowerHo()[idx];
            if (t_traverseIdx[flower] < flower_solve[flower].length - 1) { // 还可继续遍历的话
                t_traverseIdx[flower] += 1;
                t_traverseEnd = false;
            }
        }
    }

    return final_result;
    console.log("End FindPatternsByCard" + new Date());
}

FindPatternsByCard([1,2,3,11,12,13,]);