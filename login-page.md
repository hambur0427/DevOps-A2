# Login Page

<form id="search-form">
  <label for="keyword">Search keyword</label>
  <input id="keyword" name="keyword" type="text" />
  <button type="submit">Search</button>
</form>

<p id="search-message" role="status" aria-live="polite"></p>

<script>
  document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const keyword = document.getElementById("keyword").value.trim();
    const messageElement = document.getElementById("search-message");

    if (!keyword) {
      messageElement.textContent = "請先輸入搜尋關鍵字。";
      return;
    }

    messageElement.textContent = "";
    window.location.href = "/search?q=" + encodeURIComponent(keyword);
  });
</script>
