$.fn.contextMenu = function (settings) {

    return this.each(function () {

        // Open context menu
        $(this).on("contextmenu", function (e) {
            //open menu
            var server_status = $(this).parent().data('status');

            if(server_status == 'terminated'){
                return false;
            }

            $(settings.menuSelector)
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getLeftLocation(e),
                    top: getTopLocation(e)
                });
            
            //add click listener on menu
            ContextMenuClickHandler();
            
            return false;
        });

        // click handler for context menu
        function ContextMenuClickHandler() {
            $(settings.menuSelector)
                .off('click')
                .on( 'click', function (e) {
                    $(this).hide();
            
                    var $invokedOn = $(this).data("invokedOn");
                    var $selectedMenu = $(e.target);
                    
                    settings.menuSelected.call($(this), $invokedOn, $selectedMenu);
            });
            
        }

        //make sure menu closes on any click
        $(document).click(function () {
            $(settings.menuSelector).hide();
        });
    });

    function getLeftLocation(e) {
        var mouseWidth = e.pageX;
        var pageWidth = $(window).width();
        var menuWidth = $(settings.menuSelector).width();
        
        // opening menu would pass the side of the page
        if (mouseWidth + menuWidth > pageWidth &&
            menuWidth < mouseWidth) {
            return mouseWidth - menuWidth;
        } 
        return mouseWidth;
    }        
    
    function getTopLocation(e) {
        var mouseHeight = e.pageY;
        var pageHeight = $(window).height();
        var menuHeight = $(settings.menuSelector).height();

        // opening menu would pass the bottom of the page
        if (mouseHeight + menuHeight > pageHeight &&
            menuHeight < mouseHeight) {
            return mouseHeight - menuHeight;
        } 
        return mouseHeight;
    }

};

var TableAdvanced = function () {

    //server table
    var initTable2 = function() {
        var oTable = $('#sample_2').dataTable( {           
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }
            ],
             "aLengthMenu": [
                [10, 20, -1],
                [10, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 10,
        });

        jQuery('#sample_2_wrapper .dataTables_filter input').addClass("form-control input-small"); // modify table search input
        jQuery('#sample_2_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
        jQuery('#sample_2_wrapper .dataTables_length select').select2(); // initialize select2 dropdown

        $('#sample_2_column_toggler input[type="checkbox"]').change(function(){
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });
    }

    var initKeyTable = function() {
        var oTable = $('#key_table').dataTable( {           
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [ 0 ] }
            ],
             "aLengthMenu": [
                [10, 20, -1],
                [10, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 10,
        });

        jQuery('#key_table_wrapper .dataTables_filter input').addClass("form-control input-small"); // modify table search input
        jQuery('#key_table_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown
        jQuery('#key_table_wrapper .dataTables_length select').select2(); // initialize select2 dropdown

        $('#key_table_column_toggler input[type="checkbox"]').change(function(){
            /* Get the DataTables object again - this is not a recreation, just a get of the object */
            var iCol = parseInt($(this).attr("data-column"));
            var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
            oTable.fnSetColumnVis(iCol, (bVis ? false : true));
        });
    }

    var _redirect = function (timeout, url) {
        window.setTimeout(function(){
                window.location.href = url;
            }, timeout
        );
    }

    var handleStopServerAjax = function (server_id) {
        var el = jQuery('.page-content');
        App.blockUI(el);
        //handle Stop Server Ajax request
        var project_id = $('input[name=newserver_projectid]').val();

        $.ajax({
            type : "POST",
            cache : false,
            url : '/cloudmanagers/ajax/stop_server',
            dataType : "json",
            data : {"server_id" : server_id},
            success : function(res){
                App.unblockUI($(el));
                var $toast = toastr["success"]("Server Successfully Stopped.<br/>The page will refresh in 2 seconds.");
                var newUrl = '/cloudmanagers/project/' +  project_id;
                _redirect(2000, newUrl);  
                console.log(res);
            },
            error : function(xhr, ajaxOptions, thrownError){
                App.unblockUI($(el));
                var $toast = toastr["error"]("Server Stop Failed");
            }
        });
    }

    var handleStartServerAjax = function (server_id) {
        
        var el = jQuery('.page-content');
        App.blockUI(el);
        //handle Stop Server Ajax request
        var project_id = $('input[name=newserver_projectid]').val();
        $.ajax({
            type : "POST",
            cache : false,
            url : '/cloudmanagers/ajax/start_server',
            dataType : "json",
            data : {"server_id" : server_id},
            success : function(res){
                App.unblockUI($(el));
                var $toast = toastr["success"]("Server Successfully Started.<br/>The page will refresh in 2 seconds.");
                var newUrl = '/cloudmanagers/project/' +  project_id;
                _redirect(2000, newUrl);  
                console.log(res);
            },
            error : function(xhr, ajaxOptions, thrownError){
                App.unblockUI($(el));
                var $toast = toastr["error"]("Server Start Failed");
            }
        });
    }

    var handleTerminateServerAjax = function (server_id) {
        var el = jQuery('.page-content');
        App.blockUI(el);
        //handle Stop Server Ajax request
        var project_id = $('input[name=newserver_projectid]').val();
        $.ajax({
            type : "POST",
            cache : false,
            url : '/cloudmanagers/ajax/terminate_server',
            dataType : "json",
            data : {"server_id" : server_id},
            success : function(res){
                App.unblockUI($(el));
                var $toast = toastr["success"]("Server Successfully Terminated.<br/>The page will refresh in 2 seconds.");
                var newUrl = '/cloudmanagers/project/' +  project_id;
                _redirect(2000, newUrl);  
                console.log(res);
            },
            error : function(xhr, ajaxOptions, thrownError){
                App.unblockUI($(el));
                var $toast = toastr["error"]("Server Terminate Failed");
            }
        });
    }

    var handleExtendedInfo = function(server_info) {
        $('#exinfo-id').text(server_info.replaceid);
        $('#exinfo-status').addClass('label-'+server_info.status).text(server_info.status);
        $('#exinfo-pubdns').text(server_info.publicDNS);
        $('#exinfo-pubip').text(server_info.publicIP);
        $('#exinfo-innerip').text(server_info.privateIP);
        $('#exinfo-secretg').text(server_info.secretGroup);
        $('#exinfo-platform').addClass('x-icon-platform-e'+server_info.manufacture).attr('title', server_info.manufacture);
        $('#exinfo-location > .location').each(function(){
            if($(this).data('location') == server_info.location){
                $(this).addClass('selected');
            }
        });
    }

    var handleDownloadSSHKey = function( key_id ){
        var $toast = toastr["success"]("Your SSHKey will be Downloaded soon.");
        window.location = '/cloudmanagers/ajax/download_sshkey/'+key_id;
    }

    var initContextMenu = function() {
        $('#sample_2 td').contextMenu({
            menuSelector: "#serverMenu",
            menuSelected: function (invokedOn, selectedMenu){
                var element_selected = invokedOn.parent();
                var server_id = element_selected.data("server");
                if(selectedMenu.text() == "Stop"){
                    handleStopServerAjax(server_id);
                }
                else if(selectedMenu.text() == "Start"){
                    handleStartServerAjax(server_id);
                }
                else if (selectedMenu.text() == "Terminate"){
                    handleTerminateServerAjax(server_id);
                }
                else if(selectedMenu.text() == "Extended Info"){
                    var server_info = {
                        status: element_selected.data('status'),
                        publicDNS: element_selected.data('publicdns'),
                        publicIP: element_selected.data('publicip'),
                        privateIP: element_selected.data('privateip'),
                        location: element_selected.data('location'),
                        secretGroup: element_selected.data('secretgroup'),
                        manufacture: element_selected.data('manufacture'),
                        replaceid: element_selected.data('replaceid')
                    };
                    console.log(server_info);
                    handleExtendedInfo(server_info);
                }
            }
        });

        $('#key_table td').contextMenu({
            menuSelector: "#keyMenu",
            menuSelected: function (invokedOn, selectedMenu){
                var element_selected = invokedOn.parent();
                var key_id = element_selected.data("key");
                if(selectedMenu.text() == "Download Private Key"){
                    handleDownloadSSHKey(key_id);
                }
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {
            
            if (!jQuery().dataTable) {
                return;
            }

            initKeyTable();
            initTable2();
            initContextMenu();
        }

    };

}();