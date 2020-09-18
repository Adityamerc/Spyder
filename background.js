
var allLinks = [];
var visibleLinks = [];

// Called when the user clicks extension icon
// This function also triggers a message "clicked_chrome_action"
chrome.browserAction.onClicked.addListener(function(tab) {
  //alert("Action triggered")
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});


// This function gets triggered when the extension is loaded
// This function gathers all the links from the page and sorts it into new variable
chrome.extension.onRequest.addListener(function(links) {
  for (var index in links) {
    allLinks.push(links[index]);
  }
  allLinks.sort();
  visibleLinks = allLinks;
  
  checkLinks();
});

//An optional function that, when enabled runs everytime a new tab is opened
//chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//  if (changeInfo.status == 'complete') {

//    checkLinks();

//  }
//})
// This function checks the URLs in page for phishing content.
// Each URL is sent to phishtank and checked for phishing
// Phishtank is a project under OpenDNS
function checkLinks() {
  for (var link in visibleLinks) {
      mylink = visibleLinks[link];
      //alert(mylink);
      var checkgoogle = mylink.includes("google");
      if (checkgoogle == false) {
      var xhrobj = new XMLHttpRequest();
      xhrobj.open("POST", 'http://checkurl.phishtank.com/checkurl/');
      var formData1 = new FormData();
      formData1.append("url",mylink);
      formData1.append("format",'json');
      formData1.append("app_key",'9162311cf58809e293145ef7dc82eefe49cd8b75f2c8ef3051a8a0b286906b2c');
      //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhrobj.onreadystatechange = function() {
              if(xhrobj.readyState == XMLHttpRequest.DONE && xhrobj.status == 200) {
                        var myresponsejson1 = JSON.parse(this.responseText);
                        
                        //myresponse = xhr.responseText;
                        // Use 'this' keyword everywhere if this doesnt work correctly
                        //alert(this.responseText);
                        myStatus = myresponsejson1.results.in_database
                        //alert(myStatus);
                        if (myStatus == true) {                            
                            alert("Found suspicious url \n"+myresponsejson1.results.url);
                           //var found="Found Suspicious URL";
                             //alert(myStatus);
                        }
                        
              }
      }
      xhrobj.send(formData1); }

  }

}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "activate_phishing_protection" ) {
      //alert("phishing-protection-activated");
        chrome.windows.getCurrent(function (currentWindow) {
          chrome.tabs.query({active: true, windowId: currentWindow.id},
                                function(activeTabs) {
                           chrome.tabs.executeScript(
                            // send_links.js is inserted into all the frames in page to gather links
                                  activeTabs[0].id, {file: 'send_links.js', allFrames: true});
                      });
      });        
    }
  }
);
