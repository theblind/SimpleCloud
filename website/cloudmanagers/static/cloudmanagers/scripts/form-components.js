var FormComponents = function () {

    var handleSelect2 = function () {

        function format(state) {
            var behavior =  state.element;

            //console.log(state);
            if (!state.id) return state.text; // optgroup

            return '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-icon-role-small x-icon-role-small-' + $(behavior).data('behav') + '">&nbsp;&nbsp;' + state.text; 
        }

        $("#select2_role").select2({
            placeholder: "Select a Role",
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });
        $("#select2_role").on("select2-selecting", function(e){
            os = $("#select2_role > option[value="+ e.val +"]").data("os");
            //console.log(os);
            $('#role_os').val(os);
            
        })

        $("#select2_instancetype").select2({
            placeholder: "Select a Instance Type",
            allowClear: true,
            escapeMarkup: function (m) {
                return m;
            }
        });
        $("#select2_instancetype").on("select2-selecting", function(e){
            resource = $("#select2_instancetype > option[value="+ e.val +"]").data("resource");
            $('#instance_resource').text(resource);
            
        })

        function formatCountry(state){
            if(!state.id) return state.text;
            return "<img class='flag' src='/static/cloudmanagers/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }


        $("#select2_country").select2({
            placeholder: "Select a Country",
            allowClear: true,
            formatResult: formatCountry,
            formatSelection: formatCountry,
            escapeMarkup: function(m) { return m; }
        });

        var user_country = $("#select2_country").data('country');
        if(user_country){
            $("#select2_country").val(user_country).trigger("change");
        }

        
    }


    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };

}();
