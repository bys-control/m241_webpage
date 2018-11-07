<h3 class="page-title">
<% if (trans[pageTitle]){ %>
	<%= trans[pageTitle] %>
<% } else { %>
	<%= pageTitle %>
<% } %>
</h3>
<iframe src="/html/<%=pageUrl%>" class="customFrame" frameborder="0"></iframe>