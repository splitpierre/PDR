

//EDIT THESE LINES
//Title of the blog
var TITLE = "Elogios por Dia";
//RSS url
var RSS = "http://pontodereferencia.com.br/blogs/elogiospordia/?feed=rss2";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
	selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" data-transition="slide" class="contentLink" data-entryid="'+i+'">' + v.title + '<p>' + v.contentSnippet + '</p></a></li>';
    });
    $("#listview").html(s);
    $("#listview").listview("refresh");
}

//Listen for Google's library to load
function initialize() {
	console.log('ready to use google');
	var feed = new google.feeds.Feed(RSS);
	feed.setNumEntries(10);
	$.mobile.showPageLoadingMsg();
	feed.load(function(result) {
		$.mobile.hidePageLoadingMsg();
		if(!result.error) {
			entries = result.feed.entries;
			localStorage["entries"] = JSON.stringify(entries);
			renderEntries(entries);
		} else {
			console.log("Error - "+result.error.message);
			if(localStorage["entries"]) {
				$("#status").html("Usando versão em cache...");
				entries = JSON.parse(localStorage["entries"]);
				renderEntries(entries);
			} else {
				$("#status").html("Ops! nós não conseguimos capturar os blogs ou não há cache.");
			}
		}
	});
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
	//Set the title
	$("h1", this).text(TITLE);
	
	google.load("feeds", "1",{callback:initialize});
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
	if(data.prevPage.length) {
		$("h1", data.prevPage).text("");
		$("#entryText", data.prevPage).html("");
	};
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
	//Set the title
	$("h1", this).text(entries[selectedEntry].title);
	var contentHTML = "";
	contentHTML += entries[selectedEntry].content;
	contentHTML += '<p/><a href="'+entries[selectedEntry].link + '" target="_blank" class="fullLink" data-role="button">Ver no site</a>';
	$("#entryText",this).html(contentHTML);
	$("#entryText .fullLink",this).button();

});
	
$(window).on("touchstart", ".fullLink", function(e) {
	e.preventDefault();
	window.plugins.childBrowser.showWebPage($(this).attr("href"));
});

