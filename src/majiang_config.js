/**
 * Created by Wanjun Jin on 2016/9/14 0014.
 */

/*************************************************
 * card 牌
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
function GetCardFlowerHo(){
    return d_majiang_card_flower_ho;
}

/*************************************************
 * pattern 基本数字组合
 *************************************************/
function GetAllPatternNo(){
    return d_majiang_pattern_key_ho;
}
function GetPatternByNo(patternNo){
    return d_majiang_pattern[patternNo]["pattern"];
}
function GetHigherPatternByNo(patternNo){
    return d_majiang_pattern[patternNo]["higherPattern"];
}

/*************************************************
 * pattern_combo 相关
 * 基本牌型组合，包括数字组合、花色组合
 *************************************************/
function GetAllPatternComboNo(){
    return d_majiang_pattern_combo_key_ho;
}
function GetPatternCombo_num(patternComboNo){
    return d_majiang_pattern_combo[patternComboNo]["number"]
}
function GetPatternCombo_flower(patternComboNo){
    return d_majiang_pattern_combo[patternComboNo]["flower"]
}
function GetPatternCombo_needMatch(patternComboNo){
    return d_majiang_pattern_combo[patternComboNo]["correspond"]
}
function GetPatternCombo_flower_needDifferent(flowerPatternNo){
    return GetCardFlower().indexOf(-flowerPatternNo) != -1
}
function GetPatternCombo_flower_anyDifferent(flowerPatternNo){
    return flowerPatternNo == -999
}