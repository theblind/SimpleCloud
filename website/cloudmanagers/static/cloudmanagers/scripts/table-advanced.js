$.fn.contextMenu = function (settings) {

    return this.each(function () {

        // Open context menu
        $(this).on("contextmenu", function (e) {
            //open menu
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


    var initContextMenu = function() {
        $('#sample_2 td').contextMenu({
            menuSelector: "#serverMenu",
            menuSelected: function (invokedOn, selectedMenu){
                var msg = "You selected the menu item '" + selectedMenu.text() +
                    "' on the value '" + invokedOn.text() + "'";
                console.log(msg);
            }
        });

        $('#key_table td').contextMenu({
            menuSelector: "#keyMenu",
            menuSelected: function (invokedOn, selectedMenu){
                var msg = "You selected the menu item '" + selectedMenu.text() +
                    "' on the value '" + invokedOn.text() + "'";
                console.log(msg);
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