var _gg = _gg || {};
_gg.connection = gadget.getContract("ischool.CampusLite.staff");

jQuery(function () {
    _gg.GetAllClassList();

    $('#myTab')
        .click(function() {
            $(this).find('li.active').removeClass('active');
        })
        .find('a').click(function(){
            $('#tabName').html($(this).html());
        })
        .first().trigger('click');

    // TODO: 匯入設定
    var field = {
        'StudentName':'姓名',
        'SeatNo':'座號',
        'StudentNumber':'學號',
        'SaLoginName':'帳號',
        'IDNumber':'身分證',
        'Gender':'性別',
        'Birthdate':'生日',
        'PermanentPhone':'戶籍電話',
        'SmsPhone':'行動電話',
        'PermanentZipCode':'戶籍郵遞區號',
        'PermanentCounty':'戶籍縣市',
        'PermanentTown':'戶籍鄉鎮市區',
        'PermanentDetailAddress':'戶籍村里街號',
        'ContactPhone':'通訊電話',
        'MailingZipCode':'通訊郵遞區號',
        'MailingCounty':'通訊縣市',
        'MailingTown':'通訊鄉鎮市區',
        'MailingDetailAddress':'通訊村里街號',
        'ParentCode':'家長代碼',
        'StudentCode':'學生代碼',
        'ClassName':'班級'
    };
    $('#import').importlist({
        columns          : field,
        oncomplete       : _gg.save_import,
        haveTitleControl : '#import input:checkbox[data-action=checktitle]',
        inputControl     : '#import textarea',
        outputControl    : '#import div[data-tab=result]',
        parseControl     : '#import button[data-action=parse]',
        importControl    : '#import button[data-action=done]',
        errorElement     : '#mainMsg'
    });

    // TODO: 匯出全選
    $('#tab_export')
        .find('#checkall').click(function() {
            var that = this;
            $('#tab_export .controls input:checkbox').prop('checked', function() {
                return $(that).prop('checked');
            });
        }).end()
        .find('button[data-action=export]').click(function() {
            if ($('#tab_export .controls input:checkbox:checked').length === 0) {
                $('#tab_export textarea').val('無匯出資料');
            } else {
                _gg.export_data();
            }
        });

    // TODO: scroll bar
    $('.my-scrollbar2, #namelist').alternateScroll();

    // TODO: 點選新增
    $('#addstudent').click(function() {
        _gg.ClearStudentInfo();
        $('#namelist tbody tr.action').removeClass('action');
        _gg.student = { StudentID: '0'};
    });

    // TODO: 點選刪除
    $('#del-data').click(function() {
        $(this).button('loading');
        _gg.delStudent();
    });

    // TODO: 點選班級
    $('#class-list').on('click', 'li', function() {
        _gg.ClearStudentInfo();
        $(this).closest('#class-list').find('.active').removeClass('active').find('i').addClass('icon-white');
        $(this).addClass('active').find('i').removeClass('icon-white');
        var classIndex = $(this).attr('classIndex');
        _gg.class = _gg.classes[classIndex];
        _gg.class.index = classIndex;
        _gg.GetStudentList('class');
    });

    // TODO: 點選學生
    $('#namelist').on('click', 'tbody tr', function() {
        _gg.ClearStudentInfo();
        var studentIndex = $(this).attr('studentIndex');
        _gg.student = _gg.students[studentIndex];
        if (_gg.student) {
            $('.my-widget-header .btn').removeClass('hide').attr('studentIndex', studentIndex);
            $(this).closest('tbody').find('.action').removeClass('action');
            $(this).addClass('action');
            _gg.GetStudentInfo();
            _gg.GetParentInfo();
        }
    });

    // TODO: 搜尋
    $('#filter-keyword').tooltip({'trigger':'hover'});
    $("#filter-student").click(function() {
        if ($('#filter-keyword').val()) {
            _gg.GetStudentList('keyword');
        } else {
            $('#filter-keyword').tooltip('show');
        }
    });

    // TODO: 編輯視窗
    $("#editModal")
        .modal({
            show: false
        })
        .on("hidden", function () {
            $("#editModal #errorMessage").html("");
        })
        .on("show", function () {
            // TODO: 清除樣式
            var validator = $("#editModal form").validate();
            validator.resetForm();
            $(this).find('.error').removeClass("error");

            $("#editModal #save-data").button("reset");
            _gg.SetModal();
        })
        .on('click', '#save-data', function() {
            var err_msg = $('#errorMessage');
            err_msg.html('');
            if ($("#editModal form").valid()) {
                // TODO: 驗證通過
                $(this).button("loading");
                _gg.saveBaseInfo();
            } else {
                _gg.set_error_message('#errorMessage', '', '資料驗證失敗，請重新檢查！');
            }
        });

    $('div[rel=tooltip]').tooltip({'trigger':'hover'});

    // TODO: 刪除照片
    $('.my-del_photo').click(function(){
        var photo_type = $(this).attr('data-type');
        $("#preview-" + photo_type).html('<img id="edit-' + photo_type + '" class="my-photo" src="" photo-base64="">');
        $(this).hide();
    });

    // TODO: 產生代碼
    $('a[action-type=refresh]').click(function() {
        _gg.GetNewCode($(this).attr('data-target'));
    });

    // TODO: 處理上傳圖片
    $('input:file').click(function(evt){
        $(this).val('');
    });
    $('input:file').change(function(evt) {
        if (evt.target == undefined ||
        evt.target.files == undefined ||
        evt.target.files.length == 0) {
            alert("您的瀏覽器並未支援讀取檔案功能，請更新您的瀏覽器，謝謝!\n\n建議瀏覽器：Chrome 10+, IE 10+, Firefox 10+");
            return;
        }

        var photo_type = $(this).attr('data-type');
        var file = evt.target.files[0];

        if (!(file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif"))
            return;

        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var maxWidth = 225, maxHeight = 300, imageHeight = image.height, imageWidth = image.width;

                    if (imageHeight > maxHeight) {
                        imageWidth *= maxHeight / imageHeight;
                        imageHeight = maxHeight;
                    }
                    if (imageWidth > maxWidth) {
                        imageHeight *= maxWidth / imageWidth;
                        imageWidth = maxWidth;
                    }

                    var canvas = document.createElement('canvas');
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

                    var finalFile = canvas.toDataURL("image/png");

                    $("#edit-" + photo_type).attr('src', finalFile);

                    var photo_base64 = finalFile.replace("data:image/png;base64,", "");

                    $("#edit-" + photo_type).attr("photo-base64", photo_base64);

                    $('div[data-type=' + photo_type + ']').show();
                };
            };
        })(file);
        reader.readAsDataURL(file);
    });

    // TODO: 驗證設定
    $.validator.setDefaults({
        debug: false, // 為 true 時不會 submit
        errorElement: "span", //錯誤時使用元素
        errorClass: "help-inline", //錯誤時使用樣式
        highlight: function(element) {
            // 將未通過驗證的表單元素設置高亮度
            $(element).parentsUntil('.control-group').parent().addClass("error");
        },
        unhighlight: function(element) {
            // 與 highlight 相反
            $(element).parentsUntil('.control-group').parent().removeClass("error");
        },
        errorPlacement: function (error, element) {
            // 錯誤標籤的顯示位置
            error.insertAfter(element);
        }
    });

    $.datepicker.setDefaults({
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"]
        ,monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
        ,dateFormat: "yy/mm/dd"
    });

    $('#edit-Birthdate').datepicker();
});

// TODO: 取得全部班級資訊
_gg.GetAllClassList = function() {
    $('#namelist tbody').html('');
    _gg.connection.send({
        service: "student.GetStudentClassList",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                _gg.set_error_message('#mainMsg', 'GetStudentClassList', error);
            } else {
                var _ref, ret = [], ary_class = [], tmp_open_index = '';
                _gg.classes = [];
                if (((_ref = response.Response) != null ? _ref.Class : void 0) != null) {
                    var gradeyear = '', classdata = [], student_count = 0;
                    $(response.Response.Class).each(function(index, item) {
                        _gg.classes[index] = item;
                        _gg.classes[index].index = index;

                        if (_gg.student) {
                            if (_gg.student.ClassID === item.ClassID) {
                                tmp_open_index = index;
                            }
                        }

                        // TODO: 處理外框
                        if (gradeyear !== item.GradeYear && index !== 0) {
                            ret.push(
                                '<div class="accordion-group">' +
                                '    <div class="accordion-heading my-nav-header">' +
                                '        <a class="accordion-toggle" data-toggle="collapse" data-parent="#class-list" href="#collapse' + item.ClassID + '">' +
                                '            <i class="icon-folder-open"></i> ' + (gradeyear || '未分') + '年級 (' + student_count + ')' +
                                '        </a>' +
                                '    </div>' +
                                '    <div id="collapse' + item.ClassID + '" class="accordion-body collapse">' +
                                '        <div class="accordion-inner">' +
                                '            <ul class="nav nav-tabs nav-stacked">' +
                                classdata.join('') +
                                '            </ul>' +
                                '        </div>' +
                                '    </div>' +
                                '</div>'
                            );

                            classdata = [];
                            student_count = 0;
                        }
                        gradeyear = item.GradeYear;
                        student_count += parseInt((item.StudentCount || 0), 10);

                        // TODO: 處理班級內容
                        classdata.push(
                            '<li classIndex="' + index + '">' +
                            '    <a href="#">' + (item.ClassName || '未分班') + '(' + item.StudentCount + ')' +
                            '  <i class="icon-chevron-right pull-right icon-white"></i>' +
                            '</a></li>'
                        );

                        // TODO: 編輯時班級自動選單
                        ary_class.push(item.ClassName);
                    });

                    // TODO: 處理最後一個年級的外框
                    ret.push(
                        '<div class="accordion-group">' +
                        '    <div class="accordion-heading my-nav-header">' +
                        '        <a class="accordion-toggle" data-toggle="collapse" data-parent="#class-list" href="#collapseClass">' +
                        '            <i class="icon-folder-open"></i> ' + (gradeyear ? gradeyear : '未分') + '年級 (' + student_count + ')' +
                        '        </a>' +
                        '    </div>' +
                        '    <div id="collapseClass" class="accordion-body collapse">' +
                        '        <div class="accordion-inner">' +
                        '            <ul class="nav nav-tabs nav-stacked">' +
                        classdata.join('') +
                        '            </ul>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>'
                    );
                }

                var items = ret.join('');
                if (items) {
                    $('#class-list').html(items);
                    $('#edit-ClassName').autocomplete({
                        source: ary_class
                    });
                    if (tmp_open_index) {
                        $('li[classindex=' + tmp_open_index + ']').trigger('click').parents('.accordion-group').find('a.accordion-toggle').trigger('click')
                    }
                } else {
                    $('#class-list').html('目前無資料');
                }
            }
        }
    });
};

// TODO: 取得班級學生清單, 搜尋學生姓名
_gg.GetStudentList = function(search_type) {
    var request = '';
    if (search_type === 'class') {
        myclass = _gg.class;
        request = '<Request><Condition><ClassID>' + myclass.ClassID + '</ClassID></Condition></Request>';
    } else {
        request = '<Request><Field><All/></Field><Condition><StudentName>%' + ($('#filter-keyword').val() || '') + '%</StudentName></Condition></Request>';
    }

    $('#namelist tbody').html('');
    _gg.connection.send({
        service: "student.GetStudentList",
        body: request,
        result: function (response, error, http) {
            if (error !== null) {
                _gg.set_error_message('#mainMsg', 'GetStudentList', error);
            } else {
                var _ref;
                _gg.students = [];
                if (((_ref = response.Response) != null ? _ref.Student : void 0) != null) {

                    $(response.Response.Student).each(function(index, item) {
                        item.index = index;
                        _gg.students[index] = item;
                    });
                }

                _gg.ResetStudentList(search_type);
            }
        }
    });
};

_gg.ResetStudentList = function(search_type) {
    $('#namelist tbody').html('');
    var ret = [], _classname = '';

    $(_gg.students).each(function(index, item) {
        // TODO: 處理姓名
        var tname = '';
        tname = (item.StudentName || '');
        if (item.Nickname) {
            tname += '(' + item.Nickname + ')';
        }

        var tmp_gender = '';
        if (item.Gender === '1') {
            tmp_gender = '男';
        } else if (item.Gender === '0') {
            tmp_gender = '女';
        }

        if (search_type === 'keyword') {
            if (item.ClassName !== _classname) {
                ret.push(
                    '<tr>' +
                    '    <th colspan="3">' + (item.ClassName || '未分班') + '</th>' +
                    '</tr>'
                );
                _classname = item.ClassName;
            }
        }

        ret.push(
            '<tr studentIndex="' + index + '" studentID="' + item.StudentID + '">' +
            '    <td>' + (item.SeatNo || '') + '</td>' +
            '    <td>' + (tname || '') + '</td>' +
            '    <td>' + (tmp_gender || '') + '</td>' +
            '</tr>'
        );
    });

    var items = ret.join('');
    if (items) {
        $('#namelist tbody').html(items);
        if (_gg.student) {
            $('#namelist tbody tr[studentID=' + _gg.student.StudentID + ']').trigger('click');
        }
    } else {
        if ($('#filter-keyword').val()) {
            $('#namelist tbody').html('<tr><td colspan="3">無符合條件的學生</td></tr>');
        } else {
            $('#namelist tbody').html('<tr><td colspan="3">無學生</td></tr>');
        }
    }
};

// TODO: 取得學生資訊
_gg.GetStudentInfo = function() {
    if (_gg.student) {
        _gg.connection.send({
            service: "student.GetStudentInfo",
            body: {
                Request: {
                    Field: {
                        All: ''
                    },
                    Condition: {
                        StudentID: _gg.student.StudentID
                    }
                }
            },
            result: function (response, error, http) {
                if (error !== null) {
                    _gg.set_error_message('#mainMsg', 'GetStudentInfo', error);
                } else {
                    var _ref;
                    if (((_ref = response.Response) != null ? _ref.Student : void 0) != null) {
                        _gg.student = response.Response.Student;
                        _gg.ResetStudentInfo();
                    }
                }
            }
        });
    }
};

// TODO: 設定學生資訊
_gg.ResetStudentInfo = function() {
    var student = _gg.student;
    if (student) {
        $('.my-widget-header .btn').removeClass('hide');
        // TODO: 處理照片
        var freshmanPhoto, graduatePhoto;
        freshmanPhoto = (student.FreshmanPhoto) ? '<img src="data:image/png;base64,' + student.FreshmanPhoto + '" class="my-photo"/>' : '';
        graduatePhoto = (student.GraduatePhoto) ? '<img src="data:image/png;base64,' + student.GraduatePhoto + '" class="my-photo"/>' : '';
        if (freshmanPhoto === "") {
          if (student.Gender === "1") {
            freshmanPhoto = '<img src="img/photo_male.png" class="my-photo"/>';
          } else {
            freshmanPhoto = '<img src="img/photo_female.png" class="my-photo"/>';
          }
        }
        if (graduatePhoto === "") {
          if (student.Gender === "1") {
            graduatePhoto = '<img src="img/photo_male.png" class="my-photo"/>';
          } else {
            graduatePhoto = '<img src="img/photo_female.png" class="my-photo"/>';
          }
        }

        var tmp_gender = '';
        if (student.Gender === '1') {
            tmp_gender = '男';
        } else if (student.Gender === '0') {
            tmp_gender = '女';
        }

        var _ref, _ref1;
        // TODO: 戶籍地址
        var tmp_permanentAddress = '';
        if (((_ref = student.PermanentAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
            var tmp_address= student.PermanentAddress.AddressList.Address;
            tmp_permanentAddress = (tmp_address.ZipCode || '') +
                                    (tmp_address.County || '') +
                                    (tmp_address.Town || '') +
                                    (tmp_address.DetailAddress || '');
        };

        // TODO: 通訊地址
        var tmp_mailingAddress = '';
        if (((_ref = student.MailingAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
            var tmp_address= student.MailingAddress.AddressList.Address;
            tmp_mailingAddress = (tmp_address.ZipCode || '') +
                                    (tmp_address.County || '') +
                                    (tmp_address.Town || '') +
                                    (tmp_address.DetailAddress || '');
        };

        $('#s-FreshmanPhoto').html(freshmanPhoto);
        $('#s-GraduatePhoto').html(graduatePhoto);
        $('#s-StudentName').html(student.StudentName || '');
        $('#s-SeatNo').html(student.SeatNo || '');
        $('#s-StudentNumber').html(student.StudentNumber || '');
        $('#s-SaLoginName').html(student.SaLoginName || '');
        $('#s-IDNumber').html(student.IDNumber || '');
        $('#s-Gender').html(tmp_gender || '');
        $('#s-Birthdate').html(student.Birthdate || '');
        $('#s-PermanentPhone').html(student.PermanentPhone || '');
        $('#s-SmsPhone').html(student.SmsPhone || '');
        $('#s-PermanentAddress').html(tmp_permanentAddress || '');
        $('#s-ContactPhone').html(student.ContactPhone || '');
        $('#s-MailingAddress').html(tmp_mailingAddress || '');
        $('#s-ParentCode').html(student.ParentCode || '');
        $('#s-StudentCode').html(student.StudentCode || '');
        $('#s-ClassName').html(student.ClassName || '');
    }
};

_gg.ClearStudentInfo = function() {
    $('.my-widget-header .btn').addClass('hide');
    $('#s-FreshmanPhoto').html('');
    $('#s-GraduatePhoto').html('');
    $('#s-StudentName').html('');
    $('#s-SeatNo').html('');
    $('#s-StudentNumber').html('');
    $('#s-SaLoginName').html('');
    $('#s-IDNumber').html('');
    $('#s-Gender').html('');
    $('#s-Birthdate').html('');
    $('#s-PermanentPhone').html('');
    $('#s-SmsPhone').html('');
    $('#s-PermanentAddress').html('');
    $('#s-ContactPhone').html('');
    $('#s-MailingAddress').html('');
    $('#s-ParentCode').html('');
    $('#s-StudentCode').html('');
    $('#s-ClassName').html('');
    $('#parentInfo tbody').html('');
};

// TODO: 取得家長資訊
_gg.GetParentInfo = function() {
    var student = _gg.student;
    if (student) {
        _gg.connection.send({
            service: "student.GetParentInfo",
            body: '<Request><Condition><StudentID>' + student.StudentID + '</StudentID></Condition></Request>',
            result: function (response, error, http) {
                if (error !== null) {
                    _gg.set_error_message('#mainMsg', 'GetParentInfo', error);
                } else {
                    var _ref, ret = [];
                    if (((_ref = response.Response) != null ? _ref.StudentParent : void 0) != null) {
                        $(response.Response.StudentParent).each(function(index, item) {
                            ret.push(
                                '<tr>' +
                                '    <td>' + (item.ParentName || '') + '</td>' +
                                '    <td>' + (item.CellPhone || '') + '</td>' +
                                '    <td>' + (item.Email || '') + '</td>' +
                                '</tr>'
                            );
                        });
                    }
                    var items = ret.join('');
                    if (items) {
                        $('#parentInfo tbody').html(items);
                    } else {
                        $('#parentInfo tbody').html('<tr><td colspan="3">目前無資料</td></tr>');
                    }
                }
            }
        });
    }
};

_gg.SetModal = function() {
    var student = _gg.student;
    if (student.StudentID) {
        if (student.StudentID === '0') {
            $('#editModal h3').html('新增');
        } else {
            $('#editModal h3').html('資料修改');
        }

        $('input:file').val('');
        $('#edit-StudentName').val(student.StudentName || '');
        $('#edit-SeatNo').val(student.SeatNo || '');
        $('#edit-StudentNumber').val(student.StudentNumber || '');
        $('#edit-SaLoginName').val(student.SaLoginName || '');
        $('#edit-IDNumber').val(student.IDNumber || '');
        $('#edit-Gender').val(student.Gender || '');
        $('#edit-Birthdate').val(student.Birthdate || '');
        $('#edit-PermanentPhone').val(student.PermanentPhone || '');
        $('#edit-SmsPhone').val(student.SmsPhone || '');
        $('#edit-ContactPhone').val(student.ContactPhone || '');
        $('#edit-ParentCode').val(student.ParentCode || '');
        $('#edit-StudentCode').val(student.StudentCode || '');
        $('#edit-ClassName').val(student.ClassName || '');
        $('#edit-ClassName').attr('ClassID', student.ClassID || '');
        $('#edit-ClassName').attr('ClassName', student.ClassName || '');

        var _ref, _ref1;
        // TODO: 戶籍地址
        var tmp_permanentAddress = '';
        if (((_ref = student.PermanentAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
            var tmp_address= student.PermanentAddress.AddressList.Address;
            $('#edit-PA-ZipCode').val(tmp_address.ZipCode || '');
            $('#edit-PA-County').val(tmp_address.County || '');
            $('#edit-PA-Town').val(tmp_address.Town || '');
            $('#edit-PA-DetailAddress').val(tmp_address.DetailAddress || '');
        } else {
            $('#edit-PA-ZipCode').val('');
            $('#edit-PA-County').val('');
            $('#edit-PA-Town').val('');
            $('#edit-PA-DetailAddress').val('');
        }

        // TODO: 通訊地址
        var tmp_mailingAddress = '';
        if (((_ref = student.MailingAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
            var tmp_address= student.MailingAddress.AddressList.Address;
            $('#edit-MA-ZipCode').val(tmp_address.ZipCode || '');
            $('#edit-MA-County').val(tmp_address.County || '');
            $('#edit-MA-Town').val(tmp_address.Town || '');
            $('#edit-MA-DetailAddress').val(tmp_address.DetailAddress || '');
        } else {
            $('#edit-MA-ZipCode').val('');
            $('#edit-MA-County').val('');
            $('#edit-MA-Town').val('');
            $('#edit-MA-DetailAddress').val('');
        }

        if (student.FreshmanPhoto) {
            $('#edit-FreshmanPhoto').attr('src', 'data:image/png;base64,'+student.FreshmanPhoto).attr('photo-base64', student.FreshmanPhoto);
            $('div[data-type=FreshmanPhoto]').show();
        } else  {
            $('#edit-FreshmanPhoto').attr('src', '').attr('photo-base64', '');
            $('div[data-type=FreshmanPhoto]').hide();
        }

        if (student.GraduatePhoto) {
            $('#edit-GraduatePhoto').attr('src', 'data:image/png;base64,'+student.GraduatePhoto).attr('photo-base64', student.GraduatePhoto);
            $('div[data-type=GraduatePhoto]').show();
        } else  {
            $('#edit-GraduatePhoto').attr('src', '').attr('photo-base64', '');
            $('div[data-type=GraduatePhoto]').hide();
        }
    } else {
        $('#editModal').modal('hide');
    }
};

_gg.saveBaseInfo = function() {
    var student = _gg.student;
    var studentName = $('#edit-StudentName').val() || '';
    var studentid = student.StudentID;

    if (studentName && studentid) {
        var freshmanPhoto = $('#edit-FreshmanPhoto').attr('photo-base64') || '';
        var graduatePhoto = $('#edit-GraduatePhoto').attr('photo-base64') || '';
        var studentName = $('#edit-StudentName').val() || '';
        var seatNo = $('#edit-SeatNo').val() || '';
        var studentNumber = $('#edit-StudentNumber').val() || '';
        var saLoginName = $('#edit-SaLoginName').val() || '';
        var iDNumber = $('#edit-IDNumber').val() || '';
        var gender = $('#edit-Gender').val() || '';
        var birthdate = $('#edit-Birthdate').val() || '';
        var permanentPhone = $('#edit-PermanentPhone').val() || '';
        var smsPhone = $('#edit-SmsPhone').val() || '';
        var contactPhone = $('#edit-ContactPhone').val() || '';
        var parentCode = $('#edit-ParentCode').val() || '';
        var studentCode = $('#edit-StudentCode').val() || '';
        var classID = '';
        if ($('#edit-ClassName').val()) {
            classID = $('#edit-ClassName').attr('ClassID') || '';
        }

        var permanentAddress = {};
        permanentAddress.AddressList = {};
        permanentAddress.AddressList.Address = {
            'ZipCode'       : ($('#edit-PA-ZipCode').val() || ''),
            'County'        : ($('#edit-PA-County').val() || '' ),
            'Town'          : ($('#edit-PA-Town').val() || ''),
            'DetailAddress' : ($('#edit-PA-DetailAddress').val() || '')
        };
        var requestPermanentAddress = '' +
            '<AddressList>' +
                '<Address>' +
                    '<ZipCode>' + permanentAddress.AddressList.Address.ZipCode + '</ZipCode>' +
                    '<County>' + permanentAddress.AddressList.Address.County + '</County>' +
                    '<Town>' + permanentAddress.AddressList.Address.Town + '</Town>' +
                    '<DetailAddress>' + permanentAddress.AddressList.Address.DetailAddress + '</DetailAddress>' +
                '</Address>' +
            '</AddressList>';

        var mailingAddress = {};
        mailingAddress.AddressList = {};
        mailingAddress.AddressList.Address = {
            'ZipCode'       : ($('#edit-MA-ZipCode').val() || ''),
            'County'        : ($('#edit-MA-County').val() || '' ),
            'Town'          : ($('#edit-MA-Town').val() || ''),
            'DetailAddress' : ($('#edit-MA-DetailAddress').val() || '')
        };
        var requestMailingAddress = '' +
            '<AddressList>' +
                '<Address>' +
                    '<ZipCode>' + mailingAddress.AddressList.Address.ZipCode + '</ZipCode>' +
                    '<County>' + mailingAddress.AddressList.Address.County + '</County>' +
                    '<Town>' + mailingAddress.AddressList.Address.Town + '</Town>' +
                    '<DetailAddress>' + mailingAddress.AddressList.Address.DetailAddress + '</DetailAddress>' +
                '</Address>' +
            '</AddressList>';

        var request = [];
        request.push('<StudentName>' + studentName + '</StudentName>');
        request.push('<SeatNo>' + seatNo + '</SeatNo>');
        request.push('<StudentNumber>' + studentNumber + '</StudentNumber>');
        request.push('<SaLoginName>' + saLoginName + '</SaLoginName>');
        request.push('<IDNumber>' + iDNumber + '</IDNumber>');
        request.push('<Gender>' + gender + '</Gender>');
        request.push('<Birthdate>' + birthdate + '</Birthdate>');
        request.push('<PermanentPhone>' + permanentPhone + '</PermanentPhone>');
        request.push('<SmsPhone>' + smsPhone + '</SmsPhone>');
        request.push('<ContactPhone>' + contactPhone + '</ContactPhone>');
        request.push('<ParentCode>' + parentCode + '</ParentCode>');
        request.push('<StudentCode>' + studentCode + '</StudentCode>');
        request.push('<ClassID>' + classID + '</ClassID>');
        request.push('<PermanentAddress>' + requestPermanentAddress + '</PermanentAddress>');
        request.push('<MailingAddress>' + requestMailingAddress + '</MailingAddress>');
        request.push('<Status>1</Status>');
        request.push('<FreshmanPhoto>' + freshmanPhoto + '</FreshmanPhoto>');
        request.push('<GraduatePhoto>' + graduatePhoto + '</GraduatePhoto>');



        var _service, _body, _txt, _type;
        if (studentid === '0') {
            _type = 'add';
            _service = 'student.AddStudent';
            _body ='<Request><Student>' + request.join('') + '</Student></Request>';
            _txt = '新增成功';
        } else {
            _type = 'update';
            _service = 'student.SetStudentInfo';
            _body ='<Request><Student>' + request.join('') + '<Condition><StudentID>' + student.StudentID + '</StudentID></Condition></Student></Request>',
            _txt = '儲存成功';
        }

        _gg.connection.send({
            service: _service,
            body: _body,
            result: function (response, error, http) {
                if (error !== null) {
                    $("#save-data").button("reset");
                    _gg.set_error_message('#errorMessage', _service, error);
                } else {
                    student.ClassID = classID;

                    if (_type === 'add') {
                        if (((_ref = response.Result) != null ? _ref.NewID : void 0) != null) {
                            student.StudentID = response.Result.NewID;
                        }
                        _gg.GetAllClassList();
                        _gg.ClearStudentInfo();
                    } else {
                        _gg.GetAllClassList();
                        _gg.ClearStudentInfo();
                    }

                    $('#editModal').modal('hide');
                    $('#mainMsg').html("<div class='alert alert-success'>\n  " + _txt + "\n</div>");
                    setTimeout("$('#mainMsg').html('')", 1500);
                }
            }
        });
    } else {
        $("#save-data").button("reset");
        var _txt;
        if (studentName) {
            _txt='學生編號不正確，無法儲存！';
        } else {
            _txt='姓名為必填值！';
        }
        _gg.set_error_message('#errorMessage', '', _txt);
    }
};

// TODO: 刪除學生
_gg.delStudent = function() {
    var studentid = _gg.student.StudentID;
    if (studentid) {
        _gg.connection.send({
            service: "student.DelStudent",
            body: '<Request><Student><Condition><StudentID>' + studentid + '</StudentID></Condition></Student></Request>',
            result: function (response, error, http) {
                if (error !== null) {
                    $('#del-data').button('reset');
                    _gg.set_error_message('#errorMessage', 'DelStudent', error);
                } else {
                    _gg.student.StudentID = null;
                    _gg.GetAllClassList();
                    _gg.ClearStudentInfo();

                    $('#del-data').button('reset');
                    $('#delModal').modal('hide');
                    $('#mainMsg').html("<div class='alert alert-success'>\n  刪除成功！\n</div>");
                    setTimeout("$('#mainMsg').html('')", 1500);
                }
            }
        });
    } else {
        _gg.set_error_message('#mainMsg', '', '學生編號不正確，無法刪除！');
    }
};

// TODO: 產生代碼
_gg.GetNewCode = function(selector) {
    _gg.connection.send({
        service: "student.GetNewCode",
        body: '',
        result: function (response, error, http) {
            if (error !== null) {
                _gg.set_error_message('#errorMessage', 'GetNewCode', error);
            } else {
                var _ref;
                if (((_ref = response.Response) != null ? _ref.Code : void 0) != null) {
                    $(selector).val(response.Response.Code || '');
                }
            }
        }
    });
};

// TODO: 儲存批次匯入
_gg.save_import = function(list) {
    $("#tab_import button[data-action=done]").button("loading");

    var _name = [], _sa_login_name = [], _id_number = [], _student_number = [], _parent_code = [], _student_code = [], _class_name = [];
    var error_item = {
        studentname   : true,
        loginname     : [],
        idnumber      : [],
        studentnumber : [],
        parentcode    : [],
        studentcode   : [],
        classname     : [],
        gender        : []
    };

    $(list).each(function(index, item) {
        // 姓名 必填
        // 帳號, 身分證字號, 學號, 家長代碼, 學生代碼  不可重複
        // 性別轉換 1:男 0:女

        if (item.StudentName) {
            _name.push(item.StudentName);
        } else {
            error_item.studentname = false;
        }

        var loginname = (item.SaLoginName || '');
        if (loginname) {
            if ($.inArray(loginname, _sa_login_name) === -1) {
                _sa_login_name.push(loginname);
            } else {
                error_item.loginname.push(loginname);
            }
        }

        var idnumber = (item.IDNumber || '');
        if (idnumber) {
            if ($.inArray(idnumber, _id_number) === -1) {
                _id_number.push(idnumber);
            } else {
                error_item.idnumber.push(idnumber);
            }
        }

        var studentnumber = (item.StudentNumber || '');
        if (studentnumber) {
            if ($.inArray(studentnumber, _student_number) === -1) {
                _student_number.push(studentnumber);
            } else {
                error_item.studentnumber.push(studentnumber);
            }
        }

        var parentcode = (item.ParentCode || '');
        if (parentcode) {
            if ($.inArray(parentcode, _parent_code) === -1) {
                _parent_code.push(parentcode);
            } else {
                error_item.parentcode.push(parentcode);
            }
        }

        var studentcode = (item.StudentCode || '');
        if (studentcode) {
            if ($.inArray(studentcode, _student_code) === -1) {
                _student_code.push(studentcode);
            } else {
                error_item.studentcode.push(studentcode);
            }
        }

        var gender = (item.Gender || '');
        if (gender) {
            if (gender !== '男' && gender !== '女') {
                error_item.gender.push(gender);
            }
        }

        var classname = (item.ClassName || '');
        if (classname) {
            if ($.inArray(classname, _class_name) === -1) {
                _class_name.push(classname);
            }
        }
    });

    _gg.connection.send({
        service: "student.ValidateImport",
        body: {
            Request: {
                Condition : {
                    'SaLoginName' : "'" +  _sa_login_name.join("', '") + "'",
                    'IDNumber' : "'" +  _id_number.join("', '") + "'",
                    'StudentNumber' : "'" +  _student_number.join("', '") + "'",
                    'ParentCode' : "'" +  _parent_code.join("', '") + "'",
                    'StudentCode' : "'" +  _student_code.join("', '") + "'",
                    'ClassName' : "'" +  _class_name.join("', '") + "'"
                }
            }
        },
        result: function (response, error, http) {
            if (error !== null) {
                $("#tab_import button[data-action=done]").button("reset");
                _gg.set_error_message('#mainMsg', 'ValidateImport', error);
            } else {
                var _ref;
                if (((_ref = response.Response) != null ? _ref.Fail : void 0) != null) {
                    $(response.Response.Fail).each(function(index, item) {
                        if (item.Value) {
                            switch (item.Title) {
                                case 'login_name':
                                    error_item.loginname.push(item.Value);
                                    break;
                                case 'id_number':
                                    error_item.idnumber.push(item.Value);
                                    break;
                                case 'student_number':
                                    error_item.studentnumber.push(item.Value);
                                    break;
                                case 'parent_code':
                                    error_item.parentcode.push(item.Value);
                                    break;
                                case 'student_code':
                                    error_item.studentcode.push(item.Value);
                                    break;
                                case 'class_name':
                                    _class_name = $.grep(_class_name, function(value) {
                                        return item.Value !== value;
                                    });
                                    break;
                            }
                        }
                    });

                    var error_txt = [];
                    if (!error_item.studentname) { error_txt.push('姓名為必填值！'); };
                    if (error_item.loginname.length > 0) {
                        error_txt.push('帳號不可重複！(' + _gg.htmlEncode(error_item.loginname.join(', ')) + ')');
                    }
                    if (error_item.idnumber.length > 0) {
                        error_txt.push('身分證號不可重複！(' + _gg.htmlEncode(error_item.idnumber.join(', ')) + ')');
                    }
                    if (error_item.studentnumber.length > 0) {
                        error_txt.push('學號不可重複！(' + _gg.htmlEncode(error_item.studentnumber.join(', ')) + ')');
                    }
                    if (error_item.parentcode.length > 0) {
                        error_txt.push('家長代碼不可重複！(' + _gg.htmlEncode(error_item.parentcode.join(', ')) + ')');
                    }
                    if (error_item.studentcode.length > 0) {
                        error_txt.push('學生代碼不可重複！(' + _gg.htmlEncode(error_item.studentcode.join(', ')) + ')');
                    }
                    if (error_item.gender.length > 0) {
                        error_txt.push('性別請使用「男」、「女」！(' + _gg.htmlEncode(error_item.gender.join(', ')) + ')');
                    }
                    if (_class_name.length > 0) {
                        error_item.classname = _class_name;
                        error_txt.push('指定的班級不存在！(' + _gg.htmlEncode(error_item.classname.join(', ')) + ')');
                    }

                    if (error_txt.length > 0) {
                         $("#tab_import button[data-action=done]").button("reset");
                        _gg.set_error_message('#mainMsg', '', error_txt.join('<br />'));
                    } else {
                        $(list).each(function(index, item) {
                            if (item.SaLoginName) {
                                delete item.ParentCode;
                                delete item.StudentCode;
                            } else {
                                if (!item.ParentCode) {
                                    item.ParentCode = null;
                                }
                                if (!item.StudentCode) {
                                    item.StudentCode = null;
                                }
                            }

                            item.PermanentAddress = {
                                AddressList : {
                                    Address : {
                                        ZipCode : (item.PermanentZipCode || ''),
                                        County : (item.PermanentCounty || ''),
                                        Town: (item.PermanentTown || ''),
                                        DetailAddress: (item.PermanentDetailAddress || '')
                                    }
                                }
                            };

                            item.MailingAddress = {
                                AddressList : {
                                    Address : {
                                        ZipCode : (item.MailingZipCode || ''),
                                        County : (item.MailingCounty || ''),
                                        Town: (item.MailingTown || ''),
                                        DetailAddress: (item.MailingDetailAddress || '')
                                    }
                                }
                            };
                        });

                        _gg.connection.send({
                            service: "student.AddStudent",
                            body: {
                                Request: {
                                    Student: list
                                }
                            },
                            result: function (response, error, http) {
                                if (error !== null) {
                                    $("#tab_import button[data-action=done]").button("reset");
                                    _gg.set_error_message('#mainMsg', 'AddStudent', error);
                                } else {
                                    var success_count = 0;

                                    if (response.Result && response.Result.EffectRows) {
                                        success_count = response.Result.EffectRows;
                                        _gg.GetAllClassList();
                                    }

                                    $("#tab_import button[data-action=done]").button("reset");
                                    $('#mainMsg').html("<div class='alert alert-success'>\n  儲存成功，共匯入" + success_count + "筆！\n</div>");
                                    setTimeout("$('#mainMsg').html('')", 3000);
                                }
                            }
                        });

                    }
                }
            }
        }
    });
};

// TODO: 匯出資料
_gg.export_data = function() {
    $('button[data-action=export]').button('loading');
    $('#tab_export textarea').val('');
    var items = [], titles = [], field_name = {};
    var checkboxs = $('#tab_export .controls input:checkbox:checked');
    var curr_page = 1;
    var page_size = 500;

    checkboxs.each(function() {
        var title_name = $(this).attr('data-title');
        switch (title_name) {
            case '戶籍地址':
                titles.push('戶籍郵遞區號');
                titles.push('戶籍縣市');
                titles.push('戶籍鄉鎮市區');
                titles.push('戶籍村里街號');
                break;
            case '通訊地址':
                titles.push('通訊郵遞區號');
                titles.push('通訊縣市');
                titles.push('通訊鄉鎮市區');
                titles.push('通訊村里街號');
                break;
            default:
                titles.push(title_name);
        }
    });

    items.push(titles.join('\t'));

    // TODO: service 欄位名稱
    checkboxs.each(function() { field_name[$(this).val()] = ''; });
    var get_student_data = function(_start_page, _page_size) {
        var curr_length = 0;
        _gg.connection.send({
            service: "student.GetStudentInfo",
            body: {
                Request: {
                    Field: field_name,
                    Pagination: {
                        StartPage : _start_page,
                        PageSize  : _page_size
                    }
                }
            },
            result: function (response, error, http) {
                $('button[data-action=export]').button('reset');
                if (error !== null) {
                    _gg.set_error_message('#mainMsg', 'GetStudentInfo', error);
                } else {
                    if (response.Response && response.Response.Student) {
                        curr_length = response.Response.Student.length;
                        $(response.Response.Student).each(function(index, student) {
                            var data1 = [];
                            $(checkboxs).each(function() {
                                var tmp_gender = '', _ref, _ref1;
                                var name = $(this).val();
                                switch (name) {
                                    case 'Gender':
                                        if (student.Gender === '1') {
                                            tmp_gender = '男';
                                        } else if (student.Gender === '0') {
                                            tmp_gender = '女';
                                        }
                                        data1.push(tmp_gender);
                                        break;
                                    case 'PermanentAddress':
                                        // TODO: 戶籍地址
                                        if (((_ref = student.PermanentAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
                                            var tmp_address= student.PermanentAddress.AddressList.Address;
                                            data1.push(tmp_address.ZipCode || '');
                                            data1.push(tmp_address.County || '');
                                            data1.push(tmp_address.Town || '');
                                            data1.push(tmp_address.DetailAddress || '');
                                        };

                                        break;
                                    case 'MailingAddress':
                                        // TODO: 通訊地址
                                        if (((_ref = student.MailingAddress) != null ? (_ref1 = _ref.AddressList) != null ? _ref1.Address : void 0 : void 0) != null){
                                            var tmp_address= student.MailingAddress.AddressList.Address;
                                            data1.push(tmp_address.ZipCode || '');
                                            data1.push(tmp_address.County || '');
                                            data1.push(tmp_address.Town || '');
                                            data1.push(tmp_address.DetailAddress || '');
                                        };
                                        break;
                                    default:
                                        data1.push(student[name]);
                                }
                            })
                            items.push(data1.join('\t'));
                        });
                    }
                    if (curr_length < _page_size) {
                        $('#tab_export textarea').val(items.join('\n'));
                    } else {
                        curr_page += 1;
                        get_student_data(curr_page, page_size);
                    }
                }
            }
        });
    };

    get_student_data(curr_page, page_size);
};

// TODO: 錯誤訊息
_gg.set_error_message = function(select_str, serviceName, error) {
    if (serviceName) {
        var tmp_msg = '<i class="icon-white icon-info-sign my-err-info"></i> <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(' + serviceName + ')';
        if (error !== null) {
            if (error.dsaError) {
                if (error.dsaError.status === "504") {
                    switch (error.dsaError.message) {
                        case '901':
                            tmp_msg = '<strong>帳號重複，請改用其他帳號!</strong>';
                            break;
                        case '902':
                            tmp_msg = '<strong>身分證字號重複，請重新輸入!</strong>';
                            break;
                        case '903':
                            tmp_msg = '<strong>學號重複，請重新輸入!</strong>';
                            break;
                        case '904':
                            tmp_msg = '<strong>家長代碼重複，請改用其他代碼!</strong>';
                            break;
                        case '905':
                            tmp_msg = '<strong>學生代碼重複，請改用其他代碼!</strong>';
                            break;
                    }
                }
            }
            $(select_str).html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  " + tmp_msg + "\n</div>");
            $('.my-err-info').click(function(){alert('請拍下此圖，並與客服人員連絡，謝謝您。\n' + JSON.stringify(error, null, 2))});
        }
    } else {
        $(select_str).html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  " + error + "\n</div>");
    }
};

// TODO: 驗證班級
jQuery.validator.addMethod("ClassName", function(value, element) {
    if (value) {
        if (_gg.classes) {
            var tmp_check = false;
            $(_gg.classes).each(function(index, item) {
                if (value === item.ClassName) {
                    $('#edit-ClassName')
                        .attr('ClassID', item.ClassID)
                        .attr('ClassName', item.ClassName)
                    tmp_check = true;
                    return false; // TODO: 跳出迴圈
                }
            });
            return tmp_check;
        } else {
            // TODO: 無班級時，只允許空值
            if (value === '') {
                return true;
            } else {
                return false;
            }
        }
    } else {
        return true;
    }
}, "無此班級");

_gg.htmlEncode = function(value) {
    return $('<div/>').text(value).html();
};