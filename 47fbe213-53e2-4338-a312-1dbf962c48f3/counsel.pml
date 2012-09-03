<Project Name="counsel"><Property Name="UDT"></Property><Property Name="UDS"><Contract Name="ischool.counsel.student" Enabled="True">
	<Definition>
		<Authentication Extends="auth.student" />
	</Definition>
	<Package Name="_">
		<Service Enabled="true" Name="DelMultipleRecord">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.multiple_record WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>MultipleRecord</RequestRecordElement>
				<Conditions Name="Condition" Required="True" Source="">
					<Condition Comparer="in" EmptyReplacement="" InputConverter="" Quote="True" Required="True" Source="Key" SourceType="Request" Target="key" />
					<Condition Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="DelPriorityData">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.priority_data WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>PriorityData</RequestRecordElement>
				<Conditions Name="Condition" Required="True" Source="">
					<Condition Comparer="in" EmptyReplacement="" InputConverter="" Quote="True" Required="True" Source="Key" SourceType="Request" Target="key" />
					<Condition Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="DelSemesterData">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.semester_data WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>SemesterData</RequestRecordElement>
				<Conditions Name="Condition" Required="True" Source="">
					<Condition Comparer="in" EmptyReplacement="" InputConverter="" Quote="True" Required="True" Source="Key" SourceType="Request" Target="key" />
					<Condition Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="DelSibling">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.sibling WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>Sibling</RequestRecordElement>
				<Conditions Name="Condition" Required="False" Source="">
					<Condition Quote="True" Required="False" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="DelSingleRecord">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.single_record WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>SingleRecord</RequestRecordElement>
				<Conditions Name="Condition" Required="True" Source="">
					<Condition Comparer="in" EmptyReplacement="" InputConverter="" Quote="True" Required="True" Source="Key" SourceType="Request" Target="key" />
					<Condition Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="DelYearlyData">
			<Definition Type="dbhelper">
				<Action>Delete</Action>
				<SQLTemplate>DELETE FROM $ischool.counsel.yearly_data WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>YearlyData</RequestRecordElement>
				<Conditions Name="Condition" Required="True" Source="">
					<Condition Comparer="in" EmptyReplacement="" InputConverter="" Quote="True" Required="True" Source="Key" SourceType="Request" Target="key" />
					<Condition Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetCurrentSemester">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList
FROM list
WHERE name='系統設定'</SQLTemplate>
				<ResponseRecordElement />
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="Result" Mandatory="True" OutputType="Xml" Source="Content" Target="content" />
				</FieldList>
				<Pagination Allow="True" />
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetMultipleRecord">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.multiple_record WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/MultipleRecord</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Key" Mandatory="True" Source="Key" Target="key" />
					<Field Alias="Data" Mandatory="True" Source="Data" Target="data" />
					<Field Alias="Remark" Mandatory="True" Source="Remark" Target="remark" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetMyBaseInfo">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM student
Left join class on class.id = student.ref_class_id
WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/Student</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="StudentID" Mandatory="True" Source="StudentID" Target="student.id" />
					<Field Alias="Name" Mandatory="True" Source="Name" Target="student.name" />
					<Field Alias="GradeYear" Mandatory="True" Source="GradeYear" Target="class.grade_year" />
					<Field Alias="SemsHistory" Mandatory="True" OutputType="xml" Source="SemsHistory" Target="student.sems_history" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="student.id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetOpeningHours">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList
FROM $counsel.system_list
WHERE @@Condition
and name = 'ABCardAccessStartingDate'
@@Order</SQLTemplate>
				<ResponseRecordElement>Response/OpeningHours</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="Content" Mandatory="True" OutputType="xml" Source="Content" Target="content" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition" />
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetPriorityData">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.priority_data WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/PriorityData</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Key" Mandatory="True" Source="Key" Target="key" />
					<Field Alias="P1" Mandatory="True" Source="P1" Target="p1" />
					<Field Alias="P2" Mandatory="True" Source="P2" Target="p2" />
					<Field Alias="P3" Mandatory="True" Source="P3" Target="p3" />
					<Field Alias="P4" Mandatory="True" Source="P4" Target="p4" />
					<Field Alias="P5" Mandatory="True" Source="P5" Target="p5" />
					<Field Alias="P6" Mandatory="True" Source="P6" Target="p6" />
					<Field Alias="P7" Mandatory="True" Source="P7" Target="p7" />
					<Field Alias="P8" Mandatory="True" Source="P8" Target="p8" />
					<Field Alias="P9" Mandatory="True" Source="P9" Target="p9" />
					<Field Alias="P10" Mandatory="True" Source="P10" Target="p10" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetQuestionsData">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.questions_data WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/QuestionsData</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="GroupName" Mandatory="True" Source="GroupName" Target="group_name" />
					<Field Alias="Name" Mandatory="True" Source="Name" Target="name" />
					<Field Alias="QuestionType" Mandatory="True" Source="QuestionType" Target="question_type" />
					<Field Alias="Items" Mandatory="True" OutputType="xml" Source="Items" Target="items" />
					<Field Alias="CanStudentEdit" Mandatory="True" Source="CanStudentEdit" Target="(case can_student_edit when 't' then '是' else '否' end)" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition" />
				<Orders Name="Order" Source="Order">
					<Order Source="GroupName" Target="group_name" />
					<Order Source="GroupName" Target="display_order" />
				</Orders>
				<Pagination Allow="True" />
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetRelative">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.relative WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/Relative</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Title" Mandatory="True" Source="Title" Target="title" />
					<Field Alias="Name" Mandatory="True" Source="Name" Target="name" />
					<Field Alias="IsAlive" Mandatory="True" Source="IsAlive" Target="is_alive" />
					<Field Alias="BirthYear" Mandatory="True" Source="BirthYear" Target="birth_year" />
					<Field Alias="Job" Mandatory="True" Source="Job" Target="job" />
					<Field Alias="Institute" Mandatory="True" Source="Institute" Target="institute" />
					<Field Alias="JobTitle" Mandatory="True" Source="JobTitle" Target="job_title" />
					<Field Alias="EduDegree" Mandatory="True" Source="EduDegree" Target="edu_degree" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetSemesterData">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.semester_data WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/SemesterData</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Key" Mandatory="True" Source="Key" Target="key" />
					<Field Alias="S1a" Mandatory="True" Source="S1a" Target="s1a" />
					<Field Alias="S1b" Mandatory="True" Source="S1b" Target="s1b" />
					<Field Alias="S2a" Mandatory="True" Source="S2a" Target="s2a" />
					<Field Alias="S2b" Mandatory="True" Source="S2b" Target="s2b" />
					<Field Alias="S3a" Mandatory="True" Source="S3a" Target="s3a" />
					<Field Alias="S3b" Mandatory="True" Source="S3b" Target="s3b" />
					<Field Alias="S4a" Mandatory="True" Source="S4a" Target="s4a" />
					<Field Alias="S4b" Mandatory="True" Source="S4b" Target="s4b" />
					<Field Alias="S5a" Mandatory="True" Source="S5a" Target="s5a" />
					<Field Alias="S5b" Mandatory="True" Source="S5b" Target="s5b" />
					<Field Alias="S6a" Mandatory="True" Source="S6a" Target="s6a" />
					<Field Alias="S6b" Mandatory="True" Source="S6b" Target="s6b" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetSibling">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.sibling WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/Sibling</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Title" Mandatory="True" Source="Title" Target="title" />
					<Field Alias="Name" Mandatory="True" Source="Name" Target="name" />
					<Field Alias="SchoolName" Mandatory="True" Source="SchoolName" Target="school_name" />
					<Field Alias="BirthYear" Mandatory="True" Source="BirthYear" Target="birth_year" />
					<Field Alias="Remark" Mandatory="True" Source="Remark" Target="remark" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetSingleRecord">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.single_record WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/SingleRecord</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Key" Mandatory="True" Source="Key" Target="key" />
					<Field Alias="Data" Mandatory="True" Source="Data" Target="data" />
					<Field Alias="Remark" Mandatory="True" Source="Remark" Target="remark" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="GetYearlyData">
			<Definition Type="dbhelper">
				<Action>Select</Action>
				<SQLTemplate>SELECT @@FieldList FROM $ischool.counsel.yearly_data WHERE @@Condition @@Order</SQLTemplate>
				<ResponseRecordElement>Response/YearlyData</ResponseRecordElement>
				<FieldList Name="FieldList" Source="Field">
					<Field Alias="UID" Mandatory="True" Source="UID" Target="uid" />
					<Field Alias="Key" Mandatory="True" Source="Key" Target="key" />
					<Field Alias="G1" Mandatory="True" Source="G1" Target="g1" />
					<Field Alias="G2" Mandatory="True" Source="G2" Target="g2" />
					<Field Alias="G3" Mandatory="True" Source="G3" Target="g3" />
					<Field Alias="G4" Mandatory="True" Source="G4" Target="g4" />
					<Field Alias="G5" Mandatory="True" Source="G5" Target="g5" />
					<Field Alias="G6" Mandatory="True" Source="G6" Target="g6" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<Orders Name="Order" Source="Order" />
				<Pagination Allow="True" />
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertMultipleRecord">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.multiple_record @@FieldList</SQLTemplate>
				<RequestRecordElement>MultipleRecord</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Key" Target="key" />
					<Field InputType="Element" Quote="True" Required="True" Source="Data" Target="data" />
					<Field InputType="Element" Quote="True" Required="False" Source="Remark" Target="remark" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertPriorityData">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.priority_data @@FieldList</SQLTemplate>
				<RequestRecordElement>PriorityData</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Key" Target="key" />
					<Field InputType="Element" Quote="True" Required="False" Source="P1" Target="p1" />
					<Field InputType="Element" Quote="True" Required="False" Source="P2" Target="p2" />
					<Field InputType="Element" Quote="True" Required="False" Source="P3" Target="p3" />
					<Field InputType="Element" Quote="True" Required="False" Source="P4" Target="p4" />
					<Field InputType="Element" Quote="True" Required="False" Source="P5" Target="p5" />
					<Field InputType="Element" Quote="True" Required="False" Source="P6" Target="p6" />
					<Field InputType="Element" Quote="True" Required="False" Source="P7" Target="p7" />
					<Field InputType="Element" Quote="True" Required="False" Source="P8" Target="p8" />
					<Field InputType="Element" Quote="True" Required="False" Source="P9" Target="p9" />
					<Field InputType="Element" Quote="True" Required="False" Source="P10" Target="p10" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertSemesterData">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.semester_data @@FieldList</SQLTemplate>
				<RequestRecordElement>SemesterData</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Key" Target="key" />
					<Field InputType="Element" Quote="True" Required="False" Source="S1a" Target="s1a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S1b" Target="s1b" />
					<Field InputType="Element" Quote="True" Required="False" Source="S2a" Target="s2a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S2b" Target="s2b" />
					<Field InputType="Element" Quote="True" Required="False" Source="S3a" Target="s3a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S3b" Target="s3b" />
					<Field InputType="Element" Quote="True" Required="False" Source="S4a" Target="s4a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S4b" Target="s4b" />
					<Field InputType="Element" Quote="True" Required="False" Source="S5a" Target="s5a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S5b" Target="s5b" />
					<Field InputType="Element" Quote="True" Required="False" Source="S6a" Target="s6a" />
					<Field InputType="Element" Quote="True" Required="False" Source="S6b" Target="s6b" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertSibling">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.sibling @@FieldList</SQLTemplate>
				<RequestRecordElement>Sibling</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Name" Target="name" />
					<Field InputType="Element" Quote="True" Required="False" Source="BirthYear" Target="birth_year" />
					<Field InputType="Element" Quote="True" Required="False" Source="Remark" Target="remark" />
					<Field InputType="Element" Quote="True" Required="False" Source="SchoolName" Target="school_name" />
					<Field InputType="Element" Quote="True" Required="False" Source="Title" Target="title" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertSingleRecord">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.single_record @@FieldList</SQLTemplate>
				<RequestRecordElement>SingleRecord</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Data" Target="data" />
					<Field InputType="Element" Quote="True" Required="True" Source="Key" Target="key" />
					<Field InputType="Element" Quote="True" Required="False" Source="Remark" Target="remark" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="InsertYearlyData">
			<Definition Type="dbhelper">
				<Action>Insert</Action>
				<SQLTemplate>INSERT INTO $ischool.counsel.yearly_data @@FieldList</SQLTemplate>
				<RequestRecordElement>YearlyData</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field AutoNumber="True" InputType="Element" Quote="False" Required="False" Source="Uid" SourceType="Request" Target="uid" />
					<Field InputType="Element" Quote="True" Required="True" Source="Key" Target="key" />
					<Field InputType="Element" Quote="True" Required="False" Source="G1" Target="g1" />
					<Field InputType="Element" Quote="True" Required="False" Source="G2" Target="g2" />
					<Field InputType="Element" Quote="True" Required="False" Source="G3" Target="g3" />
					<Field InputType="Element" Quote="True" Required="False" Source="G4" Target="g4" />
					<Field InputType="Element" Quote="True" Required="False" Source="G5" Target="g5" />
					<Field InputType="Element" Quote="True" Required="False" Source="G6" Target="g6" />
					<Field InputType="Element" Quote="True" Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</FieldList>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
		<Service Enabled="true" Name="UpdateRelative">
			<Definition Type="dbhelper">
				<Action>Update</Action>
				<SQLTemplate>UPDATE $ischool.counsel.relative SET @@FieldList	WHERE @@Condition</SQLTemplate>
				<RequestRecordElement>Relative</RequestRecordElement>
				<FieldList Name="FieldList" Source="">
					<Field Source="Title" Target="title" />
					<Field Source="Name" Target="name" />
					<Field Source="IsAlive" Target="is_alive" />
					<Field Source="Phone" Target="phone" />
					<Field Source="BirthYear" Target="birth_year" />
					<Field Source="Job" Target="job" />
					<Field Source="Institute" Target="institute" />
					<Field Source="JobTitle" Target="job_title" />
					<Field Source="EduDegree" Target="edu_degree" />
					<Field Source="LastUpdate" SourceType="Variable" Target="last_update" />
				</FieldList>
				<Conditions Name="Condition" Required="False" Source="Condition">
					<Condition Required="True" Source="Uid" Target="uid" />
					<Condition Required="True" Source="StudentID" SourceType="Variable" Target="ref_student_id" />
				</Conditions>
				<InternalVariable>
					<Variable Key="StudentID" Name="StudentID" Source="UserInfo" />
					<Variable Name="LastUpdate" Source="Literal">now()</Variable>
				</InternalVariable>
				<Preprocesses>
					<Preprocess InvalidMessage="已過開放填寫時間" Name="validDate" Type="validate"><![CDATA[
					            SELECT count(*)>0
					            FROM xpath_table('uid',
					                    'content',
					                    '$counsel.system_list',
					                    '/Content/Item/@GradeYear|/Content/Item/@StartDateTime|/Content/Item/@EndDateTime',
					                    'name=''ABCardAccessStartingDate''')
					            AS t(uid integer, "GradeYear" integer, "StartDateTime" timestamp, "EndDateTime" timestamp)
					            WHERE "GradeYear"= (
					                select c.grade_year From student s
					                join class c on c.id = s.ref_class_id
					                where s.id='@@StudentID'
					            )
					            and "StartDateTime"<=Now() and "EndDateTime">=Now()
					            ]]></Preprocess>
				</Preprocesses>
			</Definition>
		</Service>
	</Package>
</Contract></Property></Project>