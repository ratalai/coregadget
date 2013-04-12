// Generated by CoffeeScript 1.3.3
(function() {
  var query_absence;

  $(function() {
    $("#absence a[target='query']").click(function(e) {
      e.preventDefault();
      return query_absence();
    });
    $("#absence ul[target='semester-options'] a").click(function(e) {
      e.preventDefault();
      $("#absence span[target='semester']").html($(this).html());
      return $("#absence span[target='semester']").attr("value", $(this).attr("value"));
    });
    return gadget.getContract("emba.student").send({
      service: "default.GetSemester",
      body: "",
      result: function(response, error, http) {
        var semester;
        $("#absence input[target='schoolYear']").val(response.Result.SystemConfig.DefaultSchoolYear);
        semester = response.Result.SystemConfig.DefaultSemester;
        $("#absence span[target='semester']").attr("value", semester);
        if (semester === "0") {
          semester = "暑期";
        }
        if (semester === "1") {
          semester = "第 1 學期";
        }
        if (semester === "2") {
          semester = "第 2 學期";
        }
        return $("#absence span[target='semester']").html(semester);
      }
    });
  });

  query_absence = function() {
    return gadget.getContract("emba.student").send({
      service: "default.GetAbsence",
      body: {
        Request: {
          SchoolYear: $("#absence input[target='schoolYear']").val(),
          Semester: $("#absence span[target='semester']").attr("value")
        }
      },
      result: function(response, error, http) {
        var items;
        items = [];
        if (response.Result != null) {
          $(response.Result.Absence).each(function(index, item) {
            return items.push("<tr>\n	<td>" + item.SchoolYear + "</td>\n	<td>" + item.Semester + "</td>\n	<td>" + item.CourseName + "</td>\n	<td>" + item.SubjectCode + "</td>\n	<td>" + (item.StartTime.substr(0, 10)) + "</td>\n	<td>" + (item.StartTime.substr(11, 5)) + "</td>\n	<td>" + item.MakeUpDescription + "</td>\n</tr>");
          });
        }
        return $("#absence #absence-detail tbody").html(items.join(""));
      }
    });
  };

}).call(this);
