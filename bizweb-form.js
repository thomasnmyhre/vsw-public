<script>
$(document).ready(function() {
    // On input change in the 'Firmanavn' field
    $("#Firmanavn").on("input", async function() {
        let inputValue = $(this).val();
        
        // If the input value has at least 3 characters
        if (inputValue.length >= 3) {
            try {
                const response = await fetch(`https://flask-api-bizweb.onrender.com/company/search?name=${inputValue}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const companies = await response.json();
                displayResults(companies);
                
            } catch (err) {
                console.error(`Error fetching data: ${err}`);
            }
        }
    });

    function displayResults(companies) {
        // Clear any existing results
        $("#results").empty();
        
        // Display new results
        for (let company of companies) {
            let companyName = company.name;
            let orgnr = company.companynumber;

            let companyDiv = $("<div></div>").text(companyName).css("cursor", "pointer");
            companyDiv.on("click", async function() {
                // Fetch detailed company info using companynumber
                const detailedInfoResponse = await fetch(`https://flask-api-bizweb.onrender.com/company/${orgnr}`);
                const detailedInfo = await detailedInfoResponse.json();

                // Update the input fields with detailed info
                populateFields(detailedInfo);

                // Hide the results
                $("#results").hide();
            });
            $("#results").append(companyDiv);
        }

        // Show the results div if there are companies to display
        if (companies.length > 0) {
            $("#results").show();
        }
    }

    function populateFields(company) {
    $("#Firmanavn").val(company.name);
    $("#Orgnr").val(company.companynumber);

    // Visitor address details
    if (company.visitor_address) {
        $("#Bes-ksadresse").val(company.visitor_address.address || '');
        $("#Bes-ksadressepoststed").val(company.visitor_address.city || '');
        $("#Fylke").val(company.visitor_address.county || '');
        $("#Kommune").val(company.visitor_address.council || '');
        $("#Bes-ksadressepostnr").val(company.visitor_address.postcode || '');
    }

    // Postal address details
    if (company.postal_address) {
        $("#Poststed").val(company.postal_address.city || '');
        $("#Postnr").val(company.postal_address.postcode || '');
    }

    // Other details
    $("#Internett-domene").val(company.web || '');
    $("#Antall-ansatte").val(company.employees || '');

    // Main industry details
    if (company.main_industry_code) {
        $("#Bransjebeskrivelse").val(company.main_industry_code.desc || '');
        $("#Bransjekode").val(company.main_industry_code.nace_code || '');
    }

    // Earnings before taxes
    if (company.latest_account && company.latest_account.earnings_before_taxes) {
        $("#Resultat-f-r-skatt").val(company.latest_account.earnings_before_taxes);
    }
}

});

</script>
