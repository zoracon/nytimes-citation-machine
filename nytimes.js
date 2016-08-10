$(function() {

	'use strict';

	var nyTimes = {};

	$( 'form' ).submit(function( event ) {

		nyTimes.searchTerm = $('input[name="search"]').val();

		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += '?' + $.param({
		  'q': nyTimes.searchTerm,
		  'api-key': "30eb270dbc8954549a8f43b3c444585e:17:68821162"
		});

		$.ajax({
			url: url,
			method: 'GET',
		}).done(function(result) {

			var results = result.response.docs;

			$.each(results, function(index, val) {

				// Grab Data
				var title      = val.headline.main +' ';
				var pubDate    = ' ( ' + val.pub_date + ' ) .';
				var webUrl     = val.web_url;
				var source     = val.source;

				var firstName  = '';
				var middleName = '';
				var lastName   = '';

				if( val.byline ) {
					if( val.byline.original ) {

						if( val.byline.person[0].firstname ) {
							firstName = val.byline.person[0].firstname + '. ';
						}

						if( val.byline.person[0].middlename ) {
							middleName =  val.byline.person[0].middlename;
						}

						if ( val.byline.person[0].lastname ) {
							lastName =  val.byline.person[0].lastname+', ';
						}
					}
				}

				// Create Elements

				//console.log(lastName + firstName + middleName + pubDate + title + webUrl);

				var $citationBlock = $('<div>')
					.addClass('citation-container')
					.append( $('<p>')
						.text(lastName)
					)
					.append( $('<p>')
						.text(firstName)
					)
					.append( $('<p>')
						.text(middleName)
					)
					.append( $('<p>')
						.text(pubDate)
					)
					.append( $('<p>')
						.text(title)
					)
					.append( $('<a>')
						.attr('target', '_blank')
						.attr('href', webUrl)
						.text( ' ' + webUrl)
					);

				console.log( $citationBlock );

				$('body').append( $citationBlock );

			});
		}).fail(function(err) {
			throw err;
		});

		event.preventDefault();

	});
});