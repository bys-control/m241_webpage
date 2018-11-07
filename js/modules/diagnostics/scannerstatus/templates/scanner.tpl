<h3 class="page-title"><%= trans['IO Scanner'] %></h3>
<div class="fieldContainer float-left half-width lg-border-radius">
	<div class="float-left">
		<p class="fieldTitle">
			<%= trans['Scanner Status'] %>
		</p>
		<p class="fieldValue">
			<span><img data-img="serviceStatus"/></span>
			<span data-model-binding="serviceStatus"></span>
		</p>
	</div>
</div>

<div class="fieldContainer float-left half-width lg-border-radius">
	<p class="fieldTitle float-left">
		<%= trans['Connection Stats'] %>
	</p>
	<div class="clear-div"></div>
	<div class="float-left">
		<p class="subFieldGroup">
			<span class="subFieldTitle">
				<%= trans['Trans Sent'] %>:
			</span>
			<span class="subFieldValue">
				<span data-model-binding="transmissionsSent"></span>
			</span>
		</p>
		<p class="subFieldGroup">
			<span class="subFieldTitle">
				<%= trans['Num Connections'] %>:
			</span>
			<span class="subFieldValue">
				<span data-model-binding="numConnections"></span>
			</span>
		</p>
    <!-- <p class="subFieldGroup">
      <span class="subFieldTitle">
        <%= trans['Rep RateMin'] %>:
        </span>
      <span class="subFieldValue">
        <span data-model-binding="repRateMin"></span>
      </span>
    </p>
    <p class="subFieldGroup">
      <span class="subFieldTitle">
        <%= trans['Ioscn TaskLoad'] %>:
        </span>
      <span class="subFieldValue">
        <span data-model-binding="taskCpuLoad"></span>
      </span>
    </p> -->
    <p class="subFieldGroup">
      <span class="subFieldTitle">
        <%= trans['Ioscn Tasktime'] %>:
        </span>
      <span class="subFieldValue">
        <span data-model-binding="taskExecTime"></span>
      </span>
    </p>
	</div>
</div><div class="clear-div"></div>
<p class="fieldTitle float-left" style="margin-top: 7px; margin-left: 20px;">
	<%= trans['Scanned Devices'] %>
</p>
<img src="images/upArrow.png" class="up" />
<img src="images/downArrow.png" class="down" />
<div class="fieldContainer lg-border-radius" style="height: 185px; overflow: hidden; width: 90%;">
	<% var maxConnections = scannerDataModel.maxConnections;
	if(maxConnections > 0){ %>
		<table class="devTable">
		<% var rowCount = Math.ceil(maxConnections / 16) %>
		<% var ctr = 1; %>
		<% for(var row=1; row <= rowCount; row++){ %>
			<tr>
				<% for(var col=0; col < 18; col++){ %>
					<% if(col === 0 || col === 17) {%>
						<td class="numCell">
						<% if(col === 0) {%>
							<%= ((row - 1) * 16) %>
						<% } else if (col === 17){ %>
							<%= (row * 16)-1 %>
						<% } %>
					<%} else {%>
						<% if((((row-1) * 16) + col) <= (maxConnections)){ %>
							<td class="devCell">
						<% } else { %>
							<td>
						<% } %>
					<% ctr++; } %>
					</td>
				<% } %>
			</tr>
		<% } %>
		</table>
	<%}else{%>
		<span style="font-size:16px; color: #EB5B25;"><%= trans.NoDevicesReported %></span>
	<%}%>
</div>

<div style="width: 610px; margin: 0 auto;">
	<div class="ss-unconf ss-key sm-border-radius"></div>
	<div class="float-left ss-text multiple-floats"><%= trans['Not Configured'] %></div>
<!--	<div class="ss-unscan ss-key sm-border-radius"></div>
	<div class="float-left ss-text multiple-floats"><%= trans['Unscanned'] %></div> -->
	<div class="ss-scan ss-key sm-border-radius"></div> 
	<div class="float-left ss-text multiple-floats"><%= trans['Scanned'] %></div>
	<div class="ss-fault ss-key sm-border-radius"></div>
	<div class="float-left ss-text"><%= trans['Fault'] %></div>
</div>