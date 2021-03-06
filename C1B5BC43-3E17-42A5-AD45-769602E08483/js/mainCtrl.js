﻿angular.module('app', ['ui.sortable', 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce', 'monospaced.elastic'])

.controller('MainCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        $.material.init();
        var scope = {
            Init: true,
            InitErr: '',
            Group: [
                {
                    GroupName: '',
                    Questionnaire: []
                }
            ],
            CurrentQuestionnaire: {}
        };

        $scope.SetCurrentQuestionnaire = function (rec) {
            $scope.CurrentQuestionnaire = rec;
        };
        $scope.ClearCurrentQuestionnaire = function () {
            delete $scope.CurrentQuestionnaire;
        };

        $scope.CheckOpt = function (opt, question) {
            if (opt.Checked) {
                if (question.Max == 1) {
                    question.Option.forEach(function (option) {
                        if (opt != option)
                            option.Checked = false;
                    });
                }
                if (question.Max > 1) {
                    var count = 0;
                    question.Option.forEach(function (option) {
                        if (option.Checked)
                            count++;
                    });
                    if (count > question.Max) {
                        opt.Checked = false;
                    }
                }
            }
        };

        $scope.Verify = function (questionnaire) {
            var pass = true;
            questionnaire.FormContent.Section.forEach(function (section) {
                section.Question.forEach(function (question) {
                    if (question.Verify() == false)
                        pass = false;
                });
            });
            return pass;
        };

        $scope.SaveQuestionnaire = function (questionnaire) {
            
            if ($scope.Verify(questionnaire) == false) {
                alert('未填寫完成。');
                return;
            }

            var req = {
                RefFormID: questionnaire.RefFormID,
                RefGroupID: questionnaire.RefGroupID,
                Reply: {

                }
            }
            questionnaire.FormContent.Section.forEach(function (section) {
                if (!req.Reply.Section)
                    req.Reply.Section = [];
                var qList = []
                req.Reply.Section.push({
                    Title: section.Title,
                    Question: qList
                });
                section.Question.forEach(function (question) {
                    var qObj = {
                        Title: question.Title
                    };
                    if (question.Type == "option") {
                        qObj.Chose = [];
                        question.Option.forEach(function (opt) {
                            if (opt.Checked) {
                                var text = "";
                                opt.Template.forEach(function (part, index) {
                                    if (part == '%TEXT%') {
                                        text += opt.Split[index];
                                    }
                                    else if (part == '%RTEXT%') {
                                        text += opt.Split[index];
                                    }
                                    else {
                                        text += part;
                                    }
                                    
                                });
                                qObj.Chose.push({
                                    Option: opt.Key,
                                    Text: text,
                                    Split: opt.Split
                                });
                            }
                        });
                    }
                    if (question.Type == "text") {
                        qObj.Answer = question.Answer;
                    }

                    qList.push(qObj);
                });
            });

            gadget.getContract('1campus.questionnaire.student').send({
                service: "SetReply",
                body: req,
                result: function (response, error, http) {
                    $scope.$apply(function () {
                        $scope.Init = true;
                        if (!response) {
                            alert('儲存發生錯誤。' + JSON.stringify(error));
                        }
                        else {
                            alert('儲存完成。');
                            $scope.Load();
                        }
                    });
                }
            });
        };

        $scope.Load = function () {
            delete $scope.Init;
            delete $scope.InitErr;
            delete $scope.Group;
            delete $scope.CurrentQuestionnaire;
            gadget.getContract('1campus.questionnaire.student').send({
                service: "GetQuestionnaire",
                body: '',
                result: function (response, error, http) {
                    $scope.$apply(function () {
                        $scope.Init = true;
                        if (!response) {
                            $scope.InitErr = '無法取得問卷資訊';
                        }
                        else {
                            $scope.Group = [];
                            var currentGroup = {};
                            [].concat(response.Questionnaire || []).forEach(function (questionnaire) {
                                questionnaire.StartTime = new Date(parseInt(questionnaire.StartTime)).toLocaleString();
                                questionnaire.EndTime = new Date(parseInt(questionnaire.EndTime)).toLocaleString();
                                if (questionnaire.GroupName != currentGroup.GroupName) {
                                    currentGroup = {
                                        GroupName: questionnaire.GroupName,
                                        Questionnaire: []
                                    }
                                    $scope.Group.push(currentGroup);
                                }

                                var replyMapping = {};
                                //正規化Reply
                                questionnaire.Reply = questionnaire.Reply || {};
                                questionnaire.Reply.Section = [].concat(questionnaire.Reply.Section || []);
                                questionnaire.Reply.Section.forEach(function (section) {
                                    section.Question = [].concat(section.Question || []);
                                    section.Question.forEach(function (question) {
                                        replyMapping[section.Title + "&&^^&&" + question.Title] = question;
                                        if (question.Chose) {
                                            question.ChoseIndex = {};
                                            question.Chose = [].concat(question.Chose || []);
                                            question.Chose.forEach(function (chose, index) {
                                                replyMapping[section.Title + "&&^^&&" + question.Title + "&&^^&&" + chose.Option] = chose;
                                                chose.Split = [].concat(chose.Split || []);
                                                question.ChoseIndex[chose.Option] = index;
                                            });
                                        }
                                    });
                                });
                                //正規化及填入現有值
                                questionnaire.FormContent.Section = [].concat(questionnaire.FormContent.Section || []);
                                questionnaire.FormContent.Section.forEach(function (section) {
                                    section.Question = [].concat(section.Question || []);
                                    section.Question.forEach(function (question) {
                                        question.Verify = function () {
                                            return true;
                                        }
                                        if (question.Require)
                                            question.Require = question.Require == "true";
                                        question.ID = section.Title + "&&^^&&" + question.Title;
                                        if (question.Type == "option") {
                                            if (question.Max)
                                                question.Max = parseInt(question.Max);
                                            if (question.Min)
                                                question.Min = parseInt(question.Min);
                                            var options = [].concat(question.Option || []);
                                            question.Option = [];
                                            options.forEach(function (optionString) {
                                                //設定選項
                                                var optionItem = {
                                                    Key: optionString,
                                                    Checked: false,
                                                    Template: [],
                                                    Split: []
                                                };

                                                var keyWord = [];
                                                optionItem.keySize = {
                                                    '%TEXT%': '100px',
                                                    '%TEXT1%': '30px',
                                                    '%TEXT2%': '60px',
                                                    '%TEXT3%': '100px',
                                                    '%TEXT4%': '150px',
                                                    '%TEXT5%': '300px',
                                                    '%RTEXT%': '100px',
                                                    '%RTEXT1%': '30px',
                                                    '%RTEXT2%': '60px',
                                                    '%RTEXT3%': '100px',
                                                    '%RTEXT4%': '150px',
                                                    '%RTEXT5%': '300px'
                                                };
                                                optionItem.keyRequire = {
                                                    '%RTEXT%': true,
                                                    '%RTEXT1%': true,
                                                    '%RTEXT2%': true,
                                                    '%RTEXT3%': true,
                                                    '%RTEXT4%': true,
                                                    '%RTEXT5%': true
                                                }
                                                for(key in optionItem.keySize){
                                                    keyWord.push(key);
                                                }
                                                keyWord.reverse();
                                                
                                                var keySplit = function (query, keyWord) {
                                                    var key = keyWord.pop();
                                                    var list = query.split(key);

                                                    list.forEach(function (item, index) {
                                                        if (keyWord.length > 0) {
                                                            keySplit(item, [].concat(keyWord));
                                                        }
                                                        else {
                                                            optionItem.Template.push(item);
                                                            optionItem.Split.push(item);
                                                        }
                                                        if (index + 1 != list.length) {
                                                            optionItem.Template.push(key);
                                                            optionItem.Split.push("");
                                                        }
                                                    });
                                                }
                                                keySplit(optionString, keyWord);

                                                //var list = optionString.split("%TEXT%");
                                                //list.forEach(function (item, index) {
                                                //    var rlist = item.split("%RTEXT%");
                                                //    if (rlist.length > 1) {
                                                //        rlist.forEach(function (ritem, index) {
                                                //            optionItem.Template.push(ritem);
                                                //            optionItem.Split.push(ritem);
                                                //            if (index + 1 != rlist.length) {
                                                //                optionItem.Template.push("%RTEXT%");
                                                //                optionItem.Split.push("");
                                                //            }
                                                //        });
                                                //    }
                                                //    else {
                                                //        optionItem.Template.push(item);
                                                //        optionItem.Split.push(item);
                                                //    }
                                                //    if (index + 1 != list.length) {
                                                //        optionItem.Template.push("%TEXT%");
                                                //        optionItem.Split.push("");
                                                //    }
                                                //});
                                                question.Option.push(optionItem);
                                                optionItem.Verify = function () {
                                                    var result = true;
                                                    optionItem.Template.forEach(function (item, index) {
                                                        if (optionItem.keyRequire[item] && !optionItem.Split[index]) {
                                                            result = false;
                                                        }
                                                    });
                                                    return result;
                                                }

                                                //有回覆紀錄
                                                var reply = replyMapping[section.Title + "&&^^&&" + question.Title + "&&^^&&" + optionString];
                                                if (reply) {
                                                    optionItem.Checked = true;
                                                    optionItem.Text = reply.Text;
                                                    optionItem.Split = reply.Split;
                                                }
                                            });

                                            question.Verify = function () {
                                                var count = 0;
                                                question.Option.forEach(function (optionItem) {
                                                    if (optionItem.Checked && optionItem.Verify())
                                                        count++;
                                                });
                                                if (
                                                    (question.Require && count == 0)
                                                    || (question.Min && count < question.Min)
                                                ) {
                                                    return false;
                                                }
                                                else
                                                    return true;
                                            }
                                        }
                                        if (question.Type == "text") {
                                            question.Answer = "";
                                            //有回覆紀錄
                                            var reply = replyMapping[section.Title + "&&^^&&" + question.Title];
                                            if (reply) {
                                                question.Answer = reply.Answer;
                                            }
                                            if (question.Require) {
                                                question.Verify = function () {
                                                    return (question.Answer != "");
                                                }
                                            }
                                        }
                                    });
                                });
                                currentGroup.Questionnaire.push(questionnaire);
                            });
                        }
                    });
                }
            });
        };
        $scope.Load();
    }
])
.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});