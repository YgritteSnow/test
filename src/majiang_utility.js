/**
 * Created by Wanjun Jin on 2016/9/6 0006.
 */

/*************************************************
 * card 相关的读配置函数
 *************************************************/
function GetAllCardNo(){
    return d_majiang_card_key_ho;
}
function GetCardNumber(cardNo){
    return d_majiang_card[cardNo]["num"];
}
function GetCardName(cardNo){
    return d_majiang_card[cardNo]["name"];
}
function GetCardIcon(cardNo){
    return d_majiang_card[cardNo]["icon"];
}
function GetCardFlower(cardNo){
    return d_majiang_card[cardNo]["flower"];
}

/*************************************************
 * card 相关的读配置函数
 *************************************************/
function GetAllPatternNo(){
    return d_majiang_pattern_key_ho;
}
function GetPatternByNo(patternNo){
    return d_majiang_pattern[patternNo]["pattern"];
}

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

function FindPatternsByCard( card_list ){
    console.log("Begin FindPatternsByCard" + new Date());
    var flower_buff = [];
    for(var idx in card_list){
        var cardno = card_list[idx];
        var card_flower = GetCardFlower(cardno);
        if( flower_buff[card_flower] == undefined ){
            flower_buff[card_flower] = []
        }
        flower_buff[card_flower].push(cardno);
    }
    console.log("End FindPatternsByCard" + new Date());
};

FindPatternsByCardNums([1,2,3, 3,3, 4,5,6, 7,7,7, 7,8,9]);