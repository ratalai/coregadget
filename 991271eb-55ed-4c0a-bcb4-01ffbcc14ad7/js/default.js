// Generated by CoffeeScript 1.3.3
(function() {
  var getAttendance, getDiscipline, getMorality, global, resetData, resetSchoolYearSeme;

  global = {};

  jQuery(function() {
    gadget.autofit(document.getElementById("widget"));
    $("#behavior .btn-group").on("click", ".btn", function(e) {
      if (global.student != null) {
        global.behavior = {
          schoolYear: $(this).attr("school-year"),
          semester: $(this).attr("semester")
        };
        resetData();
        getMorality();
        getAttendance();
        return getDiscipline();
      }
    });
    $("#morality a[my-toggle=collapse]").click(function() {
      $("#morality-container").toggleClass("hide");
      return false;
    });
    $("#attendance a[my-toggle=collapse]").click(function() {
      $("#attendance-container").toggleClass("hide");
      return false;
    });
    $("#discipline a[my-toggle=collapse]").click(function() {
      $("#discipline-container").toggleClass("hide");
      return false;
    });
    return gadget.getContract("ischool.AD.student").send({
      service: "_.GetCurrentSemester",
      body: "",
      result: function(response, error, xhr) {
        if (error != null) {
          return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetCurrentSemester)\n</div>");
        } else {
          global.schoolYear = response.Current.SchoolYear;
          global.semester = response.Current.Semester;
          return gadget.getContract("ischool.AD.student").send({
            service: "_.GetStudentInfo",
            body: "",
            result: function(response, error, xhr) {
              var _ref;
              if (error != null) {
                return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetStudentInfo)\n</div>");
              } else {
                if (((_ref = response.Result) != null ? _ref.Student : void 0) != null) {
                  resetData();
                  global.students = $(response.Result.Student);
                  return global.students.each(function(index, student) {
                    if (index === 0) {
                      global.student = student;
                      global.behavior = {
                        schoolYear: global.schoolYear,
                        semester: global.semester
                      };
                      resetSchoolYearSeme();
                      resetData();
                      getDiscipline();
                      /* 下載上課時間表
                      */

                      gadget.getContract("ischool.AD.student").send({
                        service: "_.GetPeriodMappingTable",
                        body: "",
                        result: function(response, error, xhr) {
                          var _ref1;
                          if (error != null) {
                            return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetPeriodMappingTable)\n</div>");
                          } else {
                            global.periods = [];
                            global.absence = {};
                            if (((_ref1 = response.Response) != null ? _ref1.Period : void 0) != null) {
                              $(response.Response.Period).each(function(index, item) {
                                return global.periods.push(item);
                              });
                              /* 下載缺曠類別表
                              */

                              return gadget.getContract("ischool.AD.student").send({
                                service: "_.GetAbsenceMappingTable",
                                body: "",
                                result: function(response, error, xhr) {
                                  var _ref2;
                                  if (error != null) {
                                    return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetAbsenceMappingTable)\n</div>");
                                  } else {
                                    if (((_ref2 = response.Response) != null ? _ref2.Absence : void 0) != null) {
                                      $(response.Response.Absence).each(function(index, item) {
                                        return global.absence[item.Name] = item.Abbreviation;
                                      });
                                      return getAttendance();
                                    }
                                  }
                                }
                              });
                            }
                          }
                        }
                      });
                      return gadget.getContract("ischool.AD.student").send({
                        service: "_.GetList",
                        body: "<Request><Name>DLBehaviorConfig</Name></Request>",
                        result: function(response, error, xhr) {
                          if (error != null) {
                            return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetList_DLBehaviorConfig)\n</div>");
                          } else {
                            global.morality = response;
                            return getMorality();
                          }
                        }
                      });
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  });

  resetSchoolYearSeme = function() {
    var items, student, _ref;
    student = global.student;
    items = [];
    if (((_ref = student.SemsHistory) != null ? _ref.History : void 0) != null) {
      items.push("<button class='btn btn-large active' school-year='" + global.schoolYear + "' semester='" + global.semester + "'>" + (global.schoolYear + '' + global.semester) + "</button>");
      $(student.SemsHistory.History.sort($.by("desc", "SchoolYear", $.by("desc", "Semester")))).each(function(index, item) {
        if (!(this.SchoolYear === global.schoolYear && this.Semester === global.semester)) {
          return items.push("<button class='btn btn-large' school-year='" + this.SchoolYear + "' semester='" + this.Semester + "'>" + (this.SchoolYear + '' + this.Semester) + "</button>");
        }
      });
      return $("#behavior .btn-group").html(items.join(""));
    }
  };

  resetData = function() {
    $("#morality-container").removeClass("hide").html("");
    $("#morality-view").addClass("hide");
    $("#attendance .my-thumbnails").html("");
    $("#attendance-container").addClass("hide").html("");
    $("#attendance-view").addClass("hide");
    $("#discipline .my-thumbnails").addClass("hide");
    $("#discipline-container").addClass("hide").html("");
    $("#discipline-view").addClass("hide");
    $("#merit-a").html("<span class='badge'>0</span>");
    $("#merit-b").html("<span class='badge'>0</span>");
    $("#merit-c").html("<span class='badge'>0</span>");
    $("#demerit-a").html("<span class='badge'>0</span>");
    $("#demerit-b").html("<span class='badge'>0</span>");
    $("#demerit-c").html("<span class='badge'>0</span>");
    return $("#demerit-d").html("");
  };

  getMorality = function() {
    var _ref;
    if (((_ref = global.morality) != null ? _ref.Response : void 0) != null) {
      gadget.getContract("ischool.AD.student").send({
        service: "_.GetAssociation",
        body: "<Request>\n  <StudentID>" + global.student.StudentID + "</StudentID>\n  <SchoolYear>" + global.behavior.schoolYear + "</SchoolYear>\n  <Semester>" + global.behavior.semester + "</Semester>\n</Request>",
        result: function(response, error, xhr) {
          var _association, _ref1;
          if (error != null) {
            return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetAssociation)\n</div>");
          } else {
            _association = {};
            if ((_ref1 = response.Response) != null ? _ref1.Score : void 0) {
              $(response.Response.Score).each(function(index, item) {
                return _association = item;
              });
            }
            return gadget.getContract("ischool.AD.student").send({
              service: "_.GetMoralScore",
              body: "<Request>\n  <StudentID>" + global.student.StudentID + "</StudentID>\n  <SchoolYear>" + global.behavior.schoolYear + "</SchoolYear>\n  <Semester>" + global.behavior.semester + "</Semester>\n</Request>",
              result: function(response, error, xhr) {
                var items, _ref2;
                if (error != null) {
                  return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetMoralScore)\n</div>");
                } else {
                  items = [];
                  $(global.morality.Response).each(function() {
                    var _ref2;
                    if (this.DailyBehavior != null) {
                      items.push("<div class=\"accordion-group\">\n  <div class=\"accordion-heading\">\n    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#DailyBehavior\">\n      " + (this.DailyBehavior.Name || '日常行為表現') + "\n    </a>\n  </div>\n  <div id=\"DailyBehavior\" class=\"accordion-body collapse\">\n    <div class=\"accordion-inner\">\n      <table class=\"table table-striped\">\n        <tbody>");
                      $(this.DailyBehavior.Item).each(function() {
                        return items.push("<tr>\n  <th><span>" + (this.Name || '') + "</span></th>\n  <td><span>" + (this.Index || '') + "</span></td>\n  <td><span data-type=\"DB_Degree_" + (this.Name || '') + "\"></span></td>\n</tr>");
                      });
                      items.push("          </tbody>\n        </table>\n      </div>\n    </div>\n</div>");
                    }
                    items.push("<div class=\"accordion-group\">\n  <div class=\"accordion-heading\">\n    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#GroupActivity\">\n      " + (((_ref2 = this.GroupActivity) != null ? _ref2.Name : void 0) || '團體活動表現') + "\n    </a>\n  </div>\n  <div id=\"GroupActivity\" class=\"accordion-body collapse\">\n    <div class=\"accordion-inner\">\n      <table class=\"table table-striped\">\n        <tbody>");
                    if (this.GroupActivity != null) {
                      $(this.GroupActivity.Item).each(function() {
                        return items.push("<tr>\n  <th><span>" + (this.Name || '') + "</span></th>\n  <td><span data-type=\"GA_Degree_" + (this.Name || '') + "\"></span></td>\n  <td><span data-type=\"GA_Description_" + (this.Name || '') + "\"></span></td>\n</tr>");
                      });
                    }
                    items.push("            <tr>\n              <th><span>社團活動</span></th>\n              <td><span>" + (_association.Effort || '') + "</span></td>\n              <td><span>" + (_association.Text || '') + "</span></td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n</div>");
                    if (this.PublicService != null) {
                      items.push("<div class=\"accordion-group\">\n  <div class=\"accordion-heading\">\n    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#PublicService\">\n      " + (this.PublicService.Name || '公共服務表現') + "\n    </a>\n  </div>\n  <div id=\"PublicService\" class=\"accordion-body collapse\">\n    <div class=\"accordion-inner\">\n      <table class=\"table table-striped\">\n        <tbody>");
                      $(this.PublicService.Item).each(function() {
                        return items.push("<tr>\n  <th><span>" + (this.Name || '') + "</span></th>\n  <td><span data-type=\"PS_Description_" + (this.Name || '') + "\"></span></td>\n</tr>");
                      });
                      items.push("          </tbody>\n        </table>\n      </div>\n    </div>\n</div>");
                    }
                    if (this.SchoolSpecial != null) {
                      items.push("<div class=\"accordion-group\">\n  <div class=\"accordion-heading\">\n    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#SchoolSpecial\">\n      " + (this.SchoolSpecial.Name || '校內外特殊表現') + "\n    </a>\n  </div>\n  <div id=\"SchoolSpecial\" class=\"accordion-body collapse\">\n    <div class=\"accordion-inner\">\n      <table class=\"table table-striped\">\n        <tbody>");
                      $(this.SchoolSpecial.Item).each(function() {
                        return items.push("<tr>\n  <th><span>" + (this.Name || '') + "</span></th>\n  <td><span data-type=\"SS_Description_" + (this.Name || '') + "\"></span></td>\n</tr>");
                      });
                      items.push("          </tbody>\n        </table>\n      </div>\n    </div>\n</div>");
                    }
                    if (this.DailyLifeRecommend != null) {
                      return items.push("<div class=\"accordion-group\">\n  <div class=\"accordion-heading\">\n    <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#accordion2\" href=\"#DailyLifeRecommend\">\n      " + (this.DailyLifeRecommend.Name || '日常生活表現具體建議') + "\n    </a>\n  </div>\n  <div id=\"DailyLifeRecommend\" class=\"accordion-body collapse\">\n    <div class=\"accordion-inner\">\n    </div>\n  </div>\n</div>");
                    }
                  });
                  $("#behavior #morality #morality-container").html(items.join(""));
                  $('#behavior #morality table').find('tr:first td, tr:first th').css("border-top-color", "transparent");
                  if (((_ref2 = response.Result.DailyLifeScore) != null ? _ref2.TextScore : void 0) != null) {
                    return $(response.Result.DailyLifeScore.TextScore).each(function() {
                      if (this.DailyBehavior != null) {
                        $(this.DailyBehavior.Item).each(function() {
                          return $("#DailyBehavior td span[data-type=DB_Degree_" + (this.Name || '') + "]").html(this.Degree || '');
                        });
                      }
                      if (this.GroupActivity != null) {
                        $(this.GroupActivity.Item).each(function() {
                          $("#GroupActivity td span[data-type=GA_Degree_" + (this.Name || '') + "]").html(this.Degree || '');
                          return $("#GroupActivity td span[data-type=GA_Description_" + (this.Name || '') + "]").html(this.Description || '');
                        });
                      }
                      if (this.PublicService != null) {
                        $(this.PublicService.Item).each(function() {
                          return $("#PublicService td span[data-type=PS_Description_" + (this.Name || '') + "]").html(this.Description || '');
                        });
                      }
                      if (this.SchoolSpecial != null) {
                        $(this.SchoolSpecial.Item).each(function() {
                          return $("#SchoolSpecial td span[data-type=SS_Description_" + (this.Name || '') + "]").html(this.Description || '');
                        });
                      }
                      if (this.DailyLifeRecommend != null) {
                        return $("#DailyLifeRecommend .accordion-inner").html("" + (this.DailyLifeRecommend.Description || ''));
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
      return $("#morality-view").removeClass("hide");
    } else {
      return $("#morality-container").html("目前無資料");
    }
  };

  getAttendance = function() {
    return gadget.getContract("ischool.AD.student").send({
      service: "_.GetAttendanceRecord",
      body: "<Request>\n  <StudentID>" + global.student.StudentID + "</StudentID>\n  <SchoolYear>" + global.behavior.schoolYear + "</SchoolYear>\n  <Semester>" + global.behavior.semester + "</Semester>\n</Request>",
      result: function(response, error, xhr) {
        var absences_d, absences_t, items, name, tbody, thead, _absence, _periods, _ref;
        if (error != null) {
          return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetAttendanceRecord)\n</div>");
        } else {
          absences_t = {};
          absences_d = [];
          if (((_ref = response.Result) != null ? _ref.Attendance : void 0) != null) {
            $(response.Result.Attendance).each(function() {
              var item;
              item = {};
              item['OccurDate'] = this.OccurDate;
              $(this.Detail.Attendance.Period).each(function() {
                if (!(absences_t[this['AbsenceType']] != null)) {
                  absences_t[this['AbsenceType']] = 0;
                }
                absences_t[this['AbsenceType']] += 1;
                return item[this["@text"]] = this.AbsenceType;
              });
              return absences_d.push(item);
            });
          }
          items = [];
          for (name in absences_t) {
            items.push("<li class='span2'>\n  <div class='thumbnail my-thumbnail-white'>\n    <div class='my-subthumbnail-top'>\n      <span class='badge badge-warning'>" + (absences_t[name] || '') + "</span>\n    </div>\n    <div class='caption my-subthumbnail-bottom'>\n      <h5>" + (name || '') + "</h5>\n    </div>\n  </div>\n</li>");
          }
          _periods = global.periods;
          _absence = global.absence;
          thead = "<th>日期</th>";
          $(_periods).each(function() {
            return thead += "<th>" + this.Name + "</th>";
          });
          thead = "<tr>" + thead + "</tr>";
          tbody = "";
          $(absences_d).each(function(i, item) {
            var tr;
            tr = "<td>" + item.OccurDate + "</td>";
            $(_periods).each(function(j, period) {
              return tr += "<td>" + (_absence[item[period.Name]] || '') + "</td>";
            });
            return tbody += "<tr>" + tr + "</tr>";
          });
          if (items.join("") === "") {
            return $("#attendance-container").removeClass("hide").html("目前無資料");
          } else {
            $("#attendance-view").removeClass("hide");
            $("#attendance .my-thumbnails").html("<ul class='thumbnails'>\n  " + (items.join("")) + "\n</ul>");
            return $("#attendance-container").html("<div>\n  <table class=\"table table-striped table-bordered my-table\">\n    <thead>" + thead + "</thead>\n    <tbody>" + tbody + "</tbody>\n  </table>\n</div>");
          }
        }
      }
    });
  };

  getDiscipline = function() {
    return gadget.getContract("ischool.AD.student").send({
      service: "_.GetDisciplineRecord",
      body: "<Request>\n  <StudentID>" + global.student.StudentID + "</StudentID>\n  <SchoolYear>" + global.behavior.schoolYear + "</SchoolYear>\n  <Semester>" + global.behavior.semester + "</Semester>\n</Request>",
      result: function(response, error, xhr) {
        var items, sum_merit, _ref;
        if (error != null) {
          return $("#mainMsg").html("<div class='alert alert-error'>\n  <button class='close' data-dismiss='alert'>×</button>\n  <strong>呼叫服務失敗或網路異常，請稍候重試!</strong>(GetDisciplineRecord)\n</div>");
        } else {
          items = [];
          if (((_ref = response.Result) != null ? _ref.Discipline : void 0) != null) {
            sum_merit = {
              ma: 0,
              mb: 0,
              mc: 0,
              da: 0,
              db: 0,
              dc: 0,
              dd: 0
            };
            $(response.Result.Discipline).each(function() {
              var merit, merit_clear;
              merit = {
                a: 0,
                b: 0,
                c: 0
              };
              if (this.MeritFlag === "1") {
                if (!isNaN(parseInt(this.Detail.Discipline.Merit.A, 10))) {
                  sum_merit.ma += merit.a = parseInt(this.Detail.Discipline.Merit.A, 10);
                }
                if (!isNaN(parseInt(this.Detail.Discipline.Merit.B, 10))) {
                  sum_merit.mb += merit.b = parseInt(this.Detail.Discipline.Merit.B, 10);
                }
                if (!isNaN(parseInt(this.Detail.Discipline.Merit.C, 10))) {
                  sum_merit.mc += merit.c = parseInt(this.Detail.Discipline.Merit.C, 10);
                }
                return items.push("<tr>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.a !== 0 ? "badge-success" : "") + "\">" + merit.a + "</span>\n    <br />大功\n  </td>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.b !== 0 ? "badge-success" : "") + "\">" + merit.b + "</span>\n    <br />小功\n  </td>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.c !== 0 ? "badge-success" : "") + "\">" + merit.c + "</span>\n    <br />嘉獎\n  </td>\n  <td>\n    <span>" + (this.OccurDate.substr(0, 10)) + "</span>\n    <br/>\n    <span>" + (this.Reason || '') + "</span>\n  </td>\n</tr>");
              } else {
                if (!isNaN(parseInt(this.Detail.Discipline.Demerit.A, 10))) {
                  merit.a = parseInt(this.Detail.Discipline.Demerit.A, 10);
                }
                if (!isNaN(parseInt(this.Detail.Discipline.Demerit.B, 10))) {
                  merit.b = parseInt(this.Detail.Discipline.Demerit.B, 10);
                }
                if (!isNaN(parseInt(this.Detail.Discipline.Demerit.C, 10))) {
                  merit.c = parseInt(this.Detail.Discipline.Demerit.C, 10);
                }
                merit_clear = this.Detail.Discipline.Demerit.Cleared;
                if (merit_clear !== '是') {
                  sum_merit.da += merit.a;
                  sum_merit.db += merit.b;
                  sum_merit.dc += merit.c;
                }
                return items.push("<tr>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.a !== 0 && merit_clear === "是" ? "badge-warning" : (merit.a !== 0 ? "badge-important" : "")) + "\">" + merit.a + "</span>\n    <br />大過\n  </td>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.b !== 0 && merit_clear === '是' ? "badge-warning" : (merit.b !== 0 ? "badge-important" : "")) + "\">" + merit.b + "</span>\n    <br />小過\n  </td>\n  <td class=\"my-flags\">\n    <span class=\"badge " + (merit.c !== 0 && merit_clear === '是' ? "badge-warning" : (merit.c !== 0 ? "badge-important" : "")) + "\">" + merit.c + "</span>\n    <br />警告\n  </td>\n  <td>\n    " + (this.Detail.Discipline.Demerit.Cleared === '是' ? "<span class='my-offset'>" + (this.Detail.Discipline.Demerit.ClearDate.substr(0, 10).replace(/\//ig, "-")) + " 已銷過<br/>" + (this.Detail.Discipline.Demerit.ClearReason || '') + "</span><br/>" : "") + "\n    <span>" + (this.OccurDate.substr(0, 10)) + "</span>\n    <br/>\n    <span>" + (this.Reason || '') + "</span>\n  </td>\n</tr>");
              }
            });
            $("#merit-a").html("<span class='badge " + (sum_merit.ma !== 0 ? "badge-success" : "") + "'>" + sum_merit.ma + "</span>");
            $("#merit-b").html("<span class='badge " + (sum_merit.mb !== 0 ? "badge-success" : "") + "'>" + sum_merit.mb + "</span>");
            $("#merit-c").html("<span class='badge " + (sum_merit.mc !== 0 ? "badge-success" : "") + "'>" + sum_merit.mc + "</span>");
            $("#demerit-a").html("<span class='badge " + (sum_merit.da !== 0 ? "badge-important" : "") + "'>" + sum_merit.da + "</span>");
            $("#demerit-b").html("<span class='badge " + (sum_merit.db !== 0 ? "badge-important" : "") + "'>" + sum_merit.db + "</span>");
            $("#demerit-c").html("<span class='badge " + (sum_merit.dc !== 0 ? "badge-important" : "") + "'>" + sum_merit.dc + "</span>");
          }
          if (items.join("") === "") {
            return $("#discipline-container").removeClass("hide").html("目前無資料");
          } else {
            $("#discipline-view").removeClass("hide");
            $("#discipline .my-thumbnails").removeClass("hide");
            return $("#discipline-container").html("<table class=\"table table-striped\">\n  <tbody>\n    " + (items.join("")) + "\n  </tbody>\n</table>");
          }
        }
      }
    });
  };

  (function($) {
    return $.by = function(model, name, minor) {
      return function(o, p) {
        var a, b;
        if (o && p && typeof o === "object" && typeof p === "object") {
          a = o[name];
          b = p[name];
          if (a === b) {
            return (typeof minor === "function" ? minor(o, p) : 0);
          }
          if (typeof a === typeof b) {
            if (parseInt(a, 10) && parseInt(b, 10)) {
              a = parseInt(a, 10);
              b = parseInt(b, 10);
            }
            if (model === "desc") {
              return (a > b ? -1 : 1);
            } else {
              return (a < b ? -1 : 1);
            }
          }
          if (typeof a < typeof b) {
            return -1;
          } else {
            return 1;
          }
        } else {
          throw {
            name: "Error"
          };
          return {
            message: "Expected an object when sorting by " + name
          };
        }
      };
    };
  })(jQuery);

}).call(this);
