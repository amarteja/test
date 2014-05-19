 (function($) {
                $(document).ready(function() {
                    var mySlidebars = new $.slidebars(); // Create new instance of Slidebars
                    
                    
                    $('.toggle-left').on('click', function() {
                        mySlidebars.toggle('left');
                    });
                    
                    $('.close').on('click', function() {
                        mySlidebars.close();
                    });
                    
                    $('.test-slidebars-init').on('click', function(e) {
                        e.stopPropagation();
                        if (mySlidebars.init) { // Check if Slidebars has been initiated.
                            //alert('Slidebars has been initialised.');
                        } else {
                            //alert('Slidebars has not been initialised.');
                        }
                    });
                    $('.test-right-slidebar').on('click', function(e) {
                        e.stopPropagation();
                        if (mySlidebars.active('left')) { // Check if right Slidebar is active.
                           // alert('Right Slidebar is open.');
                        } else {
                            //alert('Right Slidebar is closed.');
                        }
                    });
                });
            }) (jQuery);