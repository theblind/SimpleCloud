var Index = function () {


    return {

        //main function
        init: function () {
            App.addResponsiveHandler(function () {
                jQuery('.vmaps').each(function () {
                    var map = jQuery(this);
                    map.width(map.parent().width());
                });
            });
        },

        initJVMAP: function (map_server_list) {

            var showMap = function () {
                jQuery('.vmaps').hide();
                jQuery('#vmap_world').show();
            }

            markers = [];

            latLng_info = {
                'ap-southeast-1' : [1.34 , 103.82],
                'ap-southeast-2' : [-33.82,151.21],
                'ap-northeast-1' : [35.70,139.69],
                'us-east-1' : [37.54, -78.65],
                'us-west-1' : [37.13,-119.49],
                'us-west-2' : [44.21, -120.61],
                'eu-west-1' : [53.49,-7.72],
                'sa-east-1' : [-23.49, -46.63],
                'pek1' : [39.93, 116.41],
                'gd1' : [23.43,113.27],

            }
            $.each(map_server_list, function(index, map_server){
                markers.push({latLng: latLng_info[map_server['location']], name: map_server['manufacture']+" : "+map_server['location']+"<br/>Instance Number: "+map_server['server_num']});
            });

            var setMap = function () {
                jQuery('#vmap_world').vectorMap({
                    map: 'world_mill_en',
                    scaleColors: ['#C8EEFF', '#0071A4'],
                    normalizeFunction: 'polynomial',
                    hoverOpacity: 0.7,
                    hoverColor: false,
                    markerStyle: {
                      initial: {
                        fill: '#1D9C16',
                        stroke: '#1D9C16'
                      }
                    },
                    backgroundColor: '#383f47',
                    markers: markers,
                });
            }

            setMap();
            showMap();

            $('#region_statistics_loading').hide();
            $('#region_statistics_content').show();
        },

        initChat: function () {

            var cont = $('#chats');
            var list = $('.chats', cont);
            var form = $('.chat-form', cont);
            var input = $('input', form);
            var btn = $('.btn', form);

            var handleClick = function (e) {
                e.preventDefault();
                
                var text = input.val();
                if (text.length == 0) {
                    return;
                }

                var time = new Date();
                var time_str = time.toString('MMM dd, yyyy hh:mm');
                var tpl = '';
                tpl += '<li class="out">';
                tpl += '<img class="avatar" alt="" src="/static/cloudmanagers/img/avatar1.jpg"/>';
                tpl += '<div class="message">';
                tpl += '<span class="arrow"></span>';
                tpl += '<a href="#" class="name">Bob Nilson</a>&nbsp;';
                tpl += '<span class="datetime">at ' + time_str + '</span>';
                tpl += '<span class="body">';
                tpl += text;
                tpl += '</span>';
                tpl += '</div>';
                tpl += '</li>';

                var msg = list.append(tpl);
                input.val("");
                $('.scroller', cont).slimScroll({
                    scrollTo: list.height()
                });
            }

            /*
            $('.scroller', cont).slimScroll({
                scrollTo: list.height()
            });
            */

            $('body').on('click', '.message .name', function(e){
                e.preventDefault(); // prevent click event

                var name = $(this).text(); // get clicked user's full name
                input.val('@' +  name + ':'); // set it into the input field
                App.scrollTo(input); // scroll to input if needed
            });

            btn.click(handleClick);
            input.keypress(function (e) {
                if (e.which == 13) {
                    handleClick();
                    return false; //<---- Add this line
                }
            });
        },

        initPeityElements : function() {
               if (!jQuery().peity) {
                    return;
                }

                if (jQuery.browser.msie && jQuery.browser.version.substr(0, 2) <= 8) { // ie7&ie8
                    return;
                }

                $(".stat.bad .line-chart").peity("line", {
                    height: 20,
                    width: 50,
                    colour: "#d12610",
                    strokeColour: "#666"
                }).show();

                $(".stat.bad .bar-chart").peity("bar", {
                    height: 20,
                    width: 50,
                    colour: "#d12610",
                    strokeColour: "#666"
                }).show();

                $(".stat.ok .line-chart").peity("line", {
                    height: 20,
                    width: 50,
                    colour: "#37b7f3",
                    strokeColour: "#757575"
                }).show();

                $(".stat.ok .bar-chart").peity("bar", {
                    height: 20,
                    width: 50,
                    colour: "#37b7f3"
                }).show();

                $(".stat.good .line-chart").peity("line", {
                    height: 20,
                    width: 50,
                    colour: "#52e136"
                }).show();

                $(".stat.good .bar-chart").peity("bar", {
                    height: 20,
                    width: 50,
                    colour: "#52e136"
                }).show();
                //

                $(".stat.bad.huge .line-chart").peity("line", {
                    height: 20,
                    width: 40,
                    colour: "#d12610",
                    strokeColour: "#666"
                }).show();

                $(".stat.bad.huge .bar-chart").peity("bar", {
                    height: 20,
                    width: 40,
                    colour: "#d12610",
                    strokeColour: "#666"
                }).show();

                $(".stat.ok.huge .line-chart").peity("line", {
                    height: 20,
                    width: 40,
                    colour: "#37b7f3",
                    strokeColour: "#757575"
                }).show();

                $(".stat.ok.huge .bar-chart").peity("bar", {
                    height: 20,
                    width: 40,
                    colour: "#37b7f3"
                }).show();

                $(".stat.good.huge .line-chart").peity("line", {
                    height: 20,
                    width: 40,
                    colour: "#52e136"
                }).show();

                $(".stat.good.huge .bar-chart").peity("bar", {
                    height: 20,
                    width: 40,
                    colour: "#52e136"
                }).show();
        
        },

        initDashboardDaterange: function () {

            $('#dashboard-report-range span').html(moment().format('MMMM D, YYYY dddd'));
            $('#dashboard-report-range').show();
        }
    };

}();
