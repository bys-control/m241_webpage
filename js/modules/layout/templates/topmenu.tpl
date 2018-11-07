<% menu.each(function(modelLvl1) {%>
	<% if (modelLvl1.get("id") === "home") {%>
        <% if (modelLvl1.get("isSelected")) { %>
            <div class="section current-section" name="<%= modelLvl1.get('url') %>"><%= trans['home'] %></div>
        <% } else {%>
            <div class="section" name="<%= modelLvl1.get('url') %>"><%= trans['home'] %></div>
        <% } %>
    <% } else {%>
        <% if (modelLvl1.get("isSelected")) { %>
            <div class="section current-section" name="<%= modelLvl1.get('url') %>">
				<% if (trans[modelLvl1.get("name")]){ %>
					<%= trans[modelLvl1.get("name")] %>
				<% } else { %>
					<%= modelLvl1.get("name") %>
				<% } %>
        <% } else {%>
            <div class="section" name="<%= modelLvl1.get('url') %>">
				<% if (trans[modelLvl1.get("name")]){ %>
					<%= trans[modelLvl1.get("name")] %>
				<% } else { %>
					<%= modelLvl1.get("name") %>
				<% } %>
        <% } %>
			</div>	
    <%}%>
<% }) %>

