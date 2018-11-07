<div class="menu-controls ui-state-whiteout">
	<span class="control ui-icon ui-icon-carat-1-w"></span>
	<span class="control"><img src="images/contract.png"/></span>
	<span class="control"><img src="images/expand.png"/></span>
</div>
<% menu.each(function(modelLvl1) {%>
	<% if (modelLvl1.get("isSelected")) { %>
		<% modelLvl1.get("children").each(function(modelLvl2) {%>
			<span id="<%= modelLvl2.get("id") %>_title" class="listtype">
				<img src="images/<%= modelLvl2.get("image") %>"/>
				<% if (trans[modelLvl2.get("name")]){ %>
					<%= trans[modelLvl2.get("name")] %>
				<% } else { %>
					<%= modelLvl2.get("name") %>
				<% } %>
			</span>
			<% if(modelLvl2.get("state") === "open"){ %>
			<ul>
			<%}else{%>
			<ul style="display:none;">
			<%}%>
			<% modelLvl2.get("children").each(function(modelLvl3) {%>
				<% if (modelLvl3.get("isSelected")) {%>
					<li class="current" name="<%= modelLvl3.get("url") %>">
					<% if (trans[modelLvl3.get("name")]){ %>
						<%= trans[modelLvl3.get("name")] %>
					<% } else { %>
						<%= modelLvl3.get("name") %>
					<% } %>
					</li>
				<% } else {%>
					<li name="<%= modelLvl3.get("url") %>">
					<% if (trans[modelLvl3.get("name")]){ %>
						<%= trans[modelLvl3.get("name")] %>
					<% } else { %>
						<%= modelLvl3.get("name") %>
					<% } %>
					</li>
				<% } %>
			<% }) %>
			</ul>
		<% }) %>
	<% } %>
<% }) %>