gadget-社團志願序
==========================

* 身份「學生」
* 運用 javascript 語法來撰寫
* 運用 less css 語法來撰寫 css
* 運用 gadget 物件呼叫 dsa 服務，依據呼叫不同類型的服務，來操做"修改"、"刪除"、"查詢"等功能
* 運用 twitter bootstrap 做為畫面設計的板型


功能說明
-------

選社
--

**社團列表**

依據社團條件，呈現符合個人可選擇加入的社團清單

若被鎖定社團，則只出現被鎖定的社團。

**社團基本資料**

呈現與社團相關的基本資訊

> 註：為了某些因素，行政人員會增額收社團學生，但是此舉會造成學生的不滿。因此各年級「已招募人數」僅顯示至學校設定的人數上限。

**社團條件**

 - 年級人數上限：一、二年級參加人數上限，亦可不限制。(三年級統一為聯修科目，不在限制條件中)
 - 總人數上限：可不限制
 - 性別：限制參加者性別
 - 科別：科辦社團限制參加的科別

**加入社團**

符合社團條件的情況下：

志願有選擇上限，可依期望排列優先順序

 1. 未開放時 => 我想參加(不能點選)
 2. 開放期間，未勾選 => 我想參加
 3. 開放期間，已勾選 => 取消參加
 4. 開放期間，鎖定不可變更 => 選社已鎖定(不能點選)


※注意：Javascript 為 client 端時間，加入、退出社團應使用伺服器時間。


----------


社團紀錄
--

各學年度學期的選社記錄，未發生的不顯示。包含：

 1. 社團名稱
 2. 指導教師
 3. 擔任幹部 (注意：社長、副社長 與 其他幹部 在資料庫紀錄的 table 不同)
 4. 平時活動(成績計算比例%)
 5. 出缺率(成績計算比例%)
 6. 活動力及服務(成績計算比例%)
 7. 成品成果考驗(成績計算比例%)
 8. 學期成績

