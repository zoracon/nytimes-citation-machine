$(function() {

	'use strict';

	var nyTimes = {};

	// Default data format
	$('body').attr('data-format', 'apa');
	$('#apa').focus();

	// Format citation change
	$('.citation-choice').on('click', function(event) {
		event.preventDefault();
		var formatID = $( this ).attr('id');
		$( 'body' ).attr('data-format', formatID);
	});

	// Form Submission
	$( 'form' ).submit(function( event ) {

		nyTimes.searchTerm = $('input[name="search"]').val();

		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += '?' + $.param({
		  'q': nyTimes.searchTerm,
		  'api-key': "3167c94b938a48a3aa68b24828262a34"
		});


		// Indicate to user that results are being retrieved
		$( document ).ajaxStart(function() {
			$( '.submission' ).val('Getting Results');
		});

		// Call NY Times Article
		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(result) {

			nyTimes.dataFormat = $('body').attr('data-format');

			$( '.submission' ).val('Submit');

			$( '.citation-container' ).remove();

			var results = result.response.docs;

			$.each(results, function(index, val) {

				// Grab Data
				var title       = '"' + val.headline.main +'", ';

				var pubDate     = val.pub_date;
				var n           = pubDate.indexOf('T');
				pubDate         = pubDate.substring(0, n != -1 ? n : pubDate.length);

				var pubDate     = ' (' + pubDate + ') .';
				var webUrl      = '<a href="'+ val.web_url + '" target="_blank">' + val.web_url + '</a>';
				var source      = val.source;
				var publication = ' The New York Times, ';

				var firstName   = '';
				var middleName  = '';
				var lastName    = '';

				function toTitleCase(str) {
				    return str.replace(/(?:^|\s)\w/g, function(match) {
				        return match.toUpperCase();
				    });
				}

				if( val.byline ) {
					if( val.byline.original ) {

						if( val.byline.person[0].firstname ) {
							firstName = val.byline.person[0].firstname + '. ';
						}

						if( val.byline.person[0].middlename ) {
							middleName =  val.byline.person[0].middlename;
						}

						if ( val.byline.person[0].lastname ) {
							lastName =  toTitleCase( val.byline.person[0].lastname.toLowerCase() ) +', ';
						}
					}
				}

				// Create Elements
				var copyButton = $('<button>')
					.addClass('btn')
					.addClass('btn-primary')
					.addClass('copy-action')
					.text('Copy!');

				var $citationBlock = $('<div>')
					.addClass( 'citation-container' )
					.append( $('<div>')
						.attr('id', 'citation')
						.html( lastName + firstName + middleName + pubDate + title + publication.italics() + webUrl )
					)
					.append(copyButton);

				$('body').append( $citationBlock );

				// Citation switch (data and focus for user experience)
				if( nyTimes.dataFormat === 'apa' ) {
					$('#apa').focus();
				}

				if( nyTimes.dataFormat === 'mla' ) {
					$('#mla').focus();
					$( $citationBlock.children('#citation') ).html( lastName + firstName + middleName + title + publication.italics() + webUrl + pubDate);
				}

				if( nyTimes.dataFormat === 'chicago' ) {
					$('#chicago').focus();
					$( $citationBlock.children('#citation') ).html( lastName + firstName + middleName + title + publication.italics() + pubDate + webUrl);
				}

				$('.copy-action').off().on('click', function(event) {
					event.preventDefault();

					var currentButton = $( this );

					// Dynamic Class
					function makeid() {
					    var text = "";
					    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

					    for( var i=0; i < 5; i++ )
					        text += possible.charAt(Math.floor(Math.random() * possible.length));

					    return text;
					}

					var rand = makeid();
					var citationElement = $( currentButton ).prev('#citation');
					$( citationElement ).addClass( rand );

					// Set Up clipboard
					var elementSelector = $( citationElement )[0].classList[0];
					var elementSelectorFormatted = '.' + elementSelector;

					$( currentButton ).attr('data-clipboard-target', elementSelectorFormatted);

					var clipboard = new Clipboard( '.btn' );

					// User feedback for when button is copied
					clipboard.on('success', function(e) {
						$( currentButton ).text('Copied!').removeClass('btn-primary').addClass('btn-success');
						$('.copy-action').not( currentButton ).text('Copy!').removeClass('btn-success').addClass('btn-primary');

					    e.clearSelection();
					    $( citationElement ).removeClass( rand );
					});

				});
			});
		}).fail(function(err) {
			$( '.submission' ).val('Submit');
			throw err;
		});

		event.preventDefault();
	});

	// Also submit on user change
	$('.citation-choice').on('click', function(event) {
		event.preventDefault();
		$('form').submit();
	});
});