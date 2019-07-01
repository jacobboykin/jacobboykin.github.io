$(function() {
    // Get the form.
    var form = $('#mailchimp-signup-form');

    // Get the messages div.
    var formMessages = $('#mailchimp-signup-form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();

        // Disable submit button
        $("#mailchimp-signup-form-submit").disabled = true;
        $("#mailchimp-signup-form-submit").addClass("disabled");

        // Serialize the form data.
        var formData = $(form).serialize();
        $(formMessages).text("⌛ Signing you up...");

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })
        .done(function(response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');
        
            // Set the message text.
            $(formMessages).text(response);
        
            // Clear the form.
            $('#firstName').val('');
            $('#lastName').val('');
            $('#email').val('');

            $(formMessages).text("🔥 You're on the list. Thank you!");
        })
        .fail(function(data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');
        
            // Set the message text.
            if (data.responseText !== '') {
                $(formMessages).text(data.responseText);
            } else {
                $(formMessages).text('Oops! An error occured and we could not send your request.');
            }
        });

        // Enable submit button
        $("#mailchimp-signup-form-submit").disabled = false;
        $("#mailchimp-signup-form-submit").removeClass("disabled");
    });
});