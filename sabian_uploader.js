/**
 * Sabian Uploader
 * @description Meant to simplify the file upload process from drag and drop functionality to real time file upload alerts and events
 * @version 1.4.9.2
 * @author Brian Sabana
 * @link http://briansabana.co.ke
 * @dependancies jquery-v1.3+,bootstrap,jquery.ui.widget.js,jquery.iframe-transport.js",jquery.fileupload.js,file-upload.css
 */
(function ($)
{
    $.fn.sabian_uploader = function (options)
    {
        var _this = $(this);

        var optf = $.extend({
            file_main_url: null,
            file_delete_url: null,
            file_upload_form: null,
            file_upload_file: null,
            file_upload_button: null,
            file_upload_container: null,
            file_upload_loader: null,
            file_upload_update: false,
            file_item_column_class: 'col-md-3',
            file_upload_dropzone: null,
            selectable: false,
            allow_auto_select: false,
            selected_class: 'sabian_selected',
            allow_multi_select: false,
            /**
             * Called when image has been selected
             * @param {type} id
             * @param {type} imgContainer
             * @returns {undefined}
             */
            on_item_selected: function (id, imgContainer) {
            },
            /**
             * Called when image has been unselected
             * @param {type} id
             * @param {type} imgContainer
             * @returns {undefined}
             */
            on_item_unselected: function (id, imgContainer) {
            },
            /**
             * Called when image has been deleted
             * @param {type} id
             * @param {type} imgContainer
             * @param {type} was_selected
             * @returns {undefined}
             */
            on_item_removed: function (id, imgContainer, was_selected) {
            },
            /**
             * Called when file has been loaded
             * @param {type} id
             * @param {type} imgContainer
             * @param {type} imgSource
             * @returns {undefined}
             */
            on_item_loaded: function (id, imgContainer, imgSource) {
            },
            /**
             * Called when there is an error
             * @param {type} imgContainer
             * @returns {undefined}
             */
            on_item_error: function (imgContainer, message) {
            },
            /**
             * Called when the file is loading
             * @param fileContainer The file loader container identified by file_upload_loader
             */
            on_item_progress_loading: function (fileContainer,percent) {
            },
            /**
             * Called when the file is finished loaded
             * @param fileContainer The file loader container identified by file_upload_loader
             */
            on_item_progress_loaded: function (fileContainer) {
            },
			
			/**
             * Called when the file is on the upload queue
             * @param fileContainer The file loader container identified by file_upload_loader
             */
			on_item_before_upload : function(fileContainer) {
			},
			
			
        }, options);

        var ul = $(optf.file_upload_container);

        var main_url = optf.file_main_url;

        var delete_url = (optf.file_delete_url != null) ? optf.file_delete_url : main_url + "delete_pic.php";

        var is_update = optf.file_upload_update;

        var image = /image.*/;

        var upload_ids = "sabuinp_f" + _this.attr("id");

        var upload_cids = "sabup_f" + _this.attr("id");

        var main_photo_holder = $('input#main_photo');

        var main_photo_tracker = 0;

        var good_result = "success";

        var upload_button = $(optf.file_upload_button);

        var upload_form = $(optf.file_upload_form);

        var upload_file = $(optf.file_upload_file);

        var upload_drop_zone = $(optf.file_upload_dropzone);

        var upload_loader = (optf.file_upload_loader != null) ? optf.file_upload_loader : null;

        var col_class = optf.file_item_column_class;

        var selectable = optf.selectable;

        var allow_auto_select = optf.allow_auto_select;

        var allow_multi_select = optf.allow_multi_select;

        var selected_class = optf.selected_class;

        var on_item_selected = optf.on_item_selected;

        var on_item_unselected = optf.on_item_unselected;

        var on_item_removed = optf.on_item_removed;

        var on_item_loaded = optf.on_item_loaded;
		
		var on_item_before_upload=optf.on_item_before_upload;

        var selected_id = -1;

        upload_button.click(function (e) {
            // Simulate a click on the file input button
            // to show the file browser dialog
            e.preventDefault();

            //alert("We are good");
            upload_file.click();
        });

        // Initialize the jQuery File Upload plugin
        upload_form.fileupload({
            //Since it forms the root plugin,its shouldnt be cloned recomend to false
            replaceFileInput: false,
            // This element will accept file drag/drop uploading
            dropZone: upload_drop_zone,
            // This function is called when a file is added to the queue;
            // either via the browse button, or via drag/drop:
            add: function (e, data) {

                var file = data.files[0];

                var tpl = $('<div class="col-md-4"><div class="img-thumbnail sabian_img_upl_box"><div class="sabian_preview"></div><a href="#" class="badge-corner badger badge-corner-base" id="" style="display:none"><span class="fa fa-check"></span></a><img class="img-responsive img-upload" src="http://localhost/tulia/images/icons/photo.png" style="display:none" data-src=""/><div class="progress progress-lg img-progress"><div class="progress-bar progress-bar-base" role="progressbar" style="width:0%"><span class="sr-only">0% complete</span></div></div></div></div>');

                if (upload_loader != null) {
                    tpl = $(upload_loader);
                }

                var imgPrev = tpl.find('img');

                //Attach to image
                if (file.type.match(image))
                {
                    var reader = new FileReader();

                    reader.onload = function () {
                        //imgPrev.attr("data-src",reader.result);

                    }
                    reader.readAsDataURL(file);
                }


                // Add the HTML to the UL element
                data.context = tpl.prependTo(ul);
				
				handle_file_before_loaded(data.context);

                // Automatically upload the file once it is added to the queue
                data.submit();
            },
            progress: function (e, data) {

                // Calculate the completion percentage of the upload

                var progress = parseInt(data.loaded / data.total * 100, 10);

                var parent = data.context;

                var imgLoader = data.context.find('div.progress-bar');

                var span = data.context.find('span.sr-only');
                
                if (progress == 100) {

                    handle_file_progress_loaded(parent);
                }

                var pr = progress + '% complete';

                // Update progress
                handle_file_progress_loading(parent,progress);

                span.text(pr);

                imgLoader.css("width", progress + "%");

            },
            done: function (e, data) {

                try {

                    var all_res = $.parseJSON($.trim(data.result));

                } catch (err) {

                    handle_file_error(data.context, "There seems to be an error with the server. Check console for more");

                    console.log(data.result);

                    return;

                }

                var res = all_res.id;

                var source = all_res.source;

                var container = data.context;

                var imgLoader = data.context.find('div.progress-bar');

                if ($.isNumeric(res))
                {
                    handle_file_loaded(res, container, all_res);
                }
                else
                {
                    imgLoader.attr("id", -1);

                    imgLoader.attr("data_id", -1);

                    imgLoader.css("width", "100%");

                    imgLoader.addClass('upl_error');

                    data.context.find('span.sr-only').text("An Error Occured");

                    handle_file_error(container, all_res.status);

                }


                //alert(res);

            },
            fail: function (e, data) {
                // Something has gone wrong!
                data.context.find('span.sr-only').text("Something went wrong");

                data.context.find('div.progress-bar').css("width", "100%");

                data.context.find('div.progress-bar').addClass('upl_error');

                handle_file_error(data.context, "Could not connect to server");

            }


        });


        // Prevent the default action when a file is dropped on the window
        $(document).on('drop dragover', function (e) {

            e.preventDefault();

        });
		
		function handle_file_before_loaded(cont){
			
			optf.on_item_before_upload(cont);	
		}
		
        function handle_file_error(imgContainer, message) {

            optf.on_item_error(imgContainer, message);
        }
        function handle_file_loaded(id, imgContainer, imgSource) {

            optf.on_item_loaded(id, imgContainer, imgSource);
        }

        function handle_file_progress_loading(container,percent) {

            optf.on_item_progress_loading(container,percent);
        }

        function handle_file_progress_loaded(container) {

            optf.on_item_progress_loaded(container);
        }

        function handle_remove(id, container, was_selected)
        {
            on_item_removed(id, container, was_selected);

            if (!selectable)
                return;

            if (!allow_multi_select)
            {
                if (was_selected)
                    selected_id = 1;
            }

        }

        function handle_select(id, container, badger, auto_selected)
        {
            if (!selectable)
                return;

            var sel = auto_selected;

            if (sel)
            {
                container.addClass(selected_class);

                badger.css("display", "block");

                if (!allow_multi_select)
                {
                    assign_selected_id(id, badger);
                }

                on_item_selected(id, container);

                sel = false;


                return;
            }

            if (!container.hasClass(selected_class))
            {
                container.addClass(selected_class);

                badger.css("display", "block");

                if (!allow_multi_select)
                {
                    assign_selected_id(id, badger);
                }

                on_item_selected(id, container);

                return;
            }
            else
            {
                container.removeClass(selected_class);

                badger.css("display", "none");

                on_item_unselected(id, container);

                return;
            }
        }

        function assign_selected_id(id, badger)
        {
            var remove_class = upload_cids + "" + selected_id;

            $('.' + remove_class).css("display", "none");

            badger.addClass(upload_cids + "" + id);

            selected_id = id;
        }

        // Helper function that formats the file sizes
        function formatFileSize(bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }

            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }

            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }

            return (bytes / 1000).toFixed(2) + ' KB';
        }
        // Helper function that formats the file sizes

    }

}(jQuery));// JavaScript Document