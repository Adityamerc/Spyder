// Listener for "clicked_browser_action" message event
// This function triggers messages to activate phishing protection
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");
      
      alert("Phishing Protection activated");
      chrome.runtime.sendMessage({"message": "activate_phishing_protection", "url": firstHref});
    }
  }
);
