# SabianFileUploader
JQuery PlugIn for uploading files to the server

```javascript
$('#fileArea').sabian_uploader(
{
            file_main_url: "https://files.myapi.com",
            file_upload_form: "#fileForm",
            file_upload_file: "#fileInput",
            file_upload_dropzone: "#fileDragAndDropArea",
            
            /**
             * Called when file has been uploaded
             * @param id The file ID
             * @param fileContainer The HTML DOM file container
             * @param url The file url
             */
            on_item_loaded: function (id, fileContainer, url) {
            },
            
            /**
             * Called when there is an error
             * @param fileContainer The HTML DOM of the file container
             * @param message The error message
             */
            on_item_error: function (fileContainer, message) {
            },
            
             /**
             * Shows file upload progress
             * @param fileContainer The HTML DOM of the file container identified by the option file_upload_loader
             * @param percent The percentage
             */
            on_item_progress_loading: function (fileContainer, percent) {
            },
            
            /**
             * Called when the file is finished loaded
             * @param fileContainer The HTML DOM loader container identified by file_upload_loader
             */
            on_item_progress_loaded: function (fileContainer) {
            },
            
            /**
             * Called when the file is loaded on the upload queue
             * @param fileContainer The HTML DOM file loader container identified by file_upload_loader
             */
            on_item_before_upload: function (fileContainer) {
            }
);
```
