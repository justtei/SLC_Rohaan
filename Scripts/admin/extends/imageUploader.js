mslc.define('admin/extends/imageUploader', ['lib/jQuery', 'lib/ko', 'admin/config', 'admin/models'], function($, ko, config, models) {
    'use strict';

    function initializeImageUploaderWrapper() {
        window.imageUploaderWrapper = new ImageUploaderWrapper();

        imageUploaderWrapper.previewImageUrl = config.setting('previewImageUrl');
        imageUploaderWrapper.init();

        window.addPreviewImage = addPreviewImage;
        window.deletePreviewImage = deletePreviewImage;
        window.deleteModifyImage = deleteModifyImage;

        return imageUploaderWrapper;
    }

    function ImageUploaderWrapper() {
        var self = this;

        this.currentImageList = null;
        this.firstImageLoad = true;
        this.previewImageUrl = null;
        this.uploadImageUrl = null;
        this.height = 240;
        this.width = 320;
        this.orginalResizeWidth = 800;
        this.context = $(document);
        this.cropAndResizeContainer = $("#cropAndResizeContainer", self.context);
        this.uploadImageButton = $('#imageUploadButton', self.context);
        this.uploadImageForm = $('#imageUploadForm', self.context);
        this.uploadImageFileInput = $('#fileInput', self.context);
        this.uploadImageModalDialog = $('#selectImageModalDialog', self.context);
        this.previewContainer = $("div.preview-container ul.thumbnails", self.context);
        this.previewImageAnchor = $("div.preview-container ul.thumbnails li a", self.context);
        this.previewImageDeleteButton = $("div.preview-container ul.thumbnails li span.delete-image", self.context);
        this.imageContainer = $("#image-container", self.context);
        this.cropContainer = $("#crop-container", self.context);
        this.saveButtonsContainer = $(".modal-footer #saveButtons", self.context);
        this.cropAndResizeButtonsContainer = $(".modal-footer #cropAndResizeButtons", self.context);
        this.cropAndResizeCancelButton = $(".modal-footer #cropAndResizeButtons #cropCancelButton", self.context);
        this.saveImageButton = $("#saveImageButton", self.context);
        this.errorAlert = $("#errorAllert", self.context);
        this.errorAlertCloseButton = $("#errorAllert .close", self.context);
        this.modifyImageContainer = $("div.modify-image-container ul.thumbnails", self.context);
        this.modifyImageDeleteButton = $("div.modify-image-container ul.thumbnails li span.delete-image", self.context);
        this.resizeContainer = $("#resize-container", self.context);
        this.resizeImage = $("#preview-resize", self.context);
        this.toogleStateSwith = $("#toogleStateSwith", self.context);
        this.sliderSize = $("#slider-size", self.context);
        this.imageUploadedCallback = function() {
        };
        this.targetElementToInsert = {};
        this.previewCarusel = {};
        this.modifyCarousel = {};
        this.image160X120Src = config.setting('image160X120BaseUrl');
        this.previewCarouselEmptyMessage = "no source images...";
        this.modifyCarouselEmptyMessage = "no processed images...";
        this.isInitResize = false;

        this.init = function() {
            self.uploadImageFileInput.fileupload({
                url: self.previewImageUrl,
                dataType: 'json',
                maxFileSize: 3145728,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                process: [
                    {
                        action: 'load',
                        fileTypes: /^image\/(gif|jpeg|png)$/,
                        maxFileSize: 3145728
                    },
                    {
                        action: 'save'
                    }
                ],

                done: function(e, data) {
                    if (data.result != null) {
                        self.addPreviewImage(data);
                    }
                },
                fail: function() {
                    self.errorAlert.show();
                }
            });

            self.previewCarusel = self.previewContainer.jcarousel({
                scroll: 4,
                offest: 1,
                visible: 8,
                size: 0,
                itemDimension: 75
            });

            self.modifyCarousel = self.modifyImageContainer.jcarousel({
                scroll: 4,
                offest: 1,
                visible: 8,
                size: 0,
                itemDimension: 75
            });

            self.uploadImageForm.submit(function() {
                self.uploadImageButton.attr('disabled', true);
            });

            self.uploadImageButton.on('click', self.uploadImage);

            self.saveImageButton.click(function() {
                var images = self.modifyImageContainer.find("li");
                if (images.length > 0) {
                    images.each(function() {
                        var img = $(this).find("img");
                        var name = img.attr("data-imagename");
                        var src = img.attr("src");
                        
                        insertImage(name, src);
                    });
                }

                var maxCollectionImageRuleInput = self.targetElementToInsert.parent().find('.data-val-restrictimagecollectionlength-input');
                if (maxCollectionImageRuleInput.length > 0) {
                    var maxImageLength = maxCollectionImageRuleInput.attr('data-val-restrictimagecollectionlength-param');
                    $.validator.methods.restrictimagecollectionlength(null, maxCollectionImageRuleInput, maxImageLength);
                }

                self.hide();
            });

            self.uploadImageModalDialog.on('show', function() {
                self.clearImagePopup();
                self.carouselDestructor(self.previewCarusel);
                self.carouselDestructor(self.modifyCarousel);
                self.carouselEmptyMessage(self.previewCarusel, self.previewCarouselEmptyMessage);
                self.carouselEmptyMessage(self.modifyCarousel, self.modifyCarouselEmptyMessage);
            });

            self.uploadImageModalDialog.on('hide', function() {
                self.hideCropAndResizeContainer();
            });

            self.cropAndResizeCancelButton.click(function() {
                self.hideCropAndResizeContainer();
            });

            self.errorAlertCloseButton.click(function() {
                self.errorAlert.hide();
            });

            self.saveImageButton.attr("disabled", true);

            self.toogleStateSwith.on("switch-change", function(e, data) {
                if (data.value) {
                    self.hideResizeContainer();
                    self.showCropContainer();
                } else {
                    self.hideCropContainer();
                    self.showResizeContainer();
                }
            });

            self.sliderSize.slider({
                min: 0,
                max: 100,
                value: 100,
                slide: function(e, data) {
                    return self.sliderResizeImage(data);
                },
                change: function(e, data) {
                    return self.sliderResizeImage(data);
                }
            });
        };

        this.setCurrentImageList = function(currentImageList) {
            self.currentImageList = currentImageList;
        };

        this.show = function(element, currentImageList) {
            self.targetElementToInsert = $(element).parents('.js-image-collection');
            self.currentImageList = currentImageList;
            self.uploadImageModalDialog.modal('show');
        };

        this.hide = function() {
            self.uploadImageModalDialog.modal('hide');
        };

        this.hideCrop = function() {
            self.ias.setOptions({hide: true});
            self.ias.update();
        };

        this.showCrop = function() {
            self.ias.setOptions({show: true});
            self.ias.update();
        };

        this.showCropContainer = function() {
            var src = $("#Base64Image", self.context).val();
            self.initCropContainer(src);
            self.cropContainer.show();
            self.showCrop();
        };

        this.hideCropContainer = function() {
            self.cropContainer.hide();
            self.hideCrop();
        };

        this.showResizeContainer = function() {
            var src = $("#Base64Image", self.context).val();
            self.initResizeContainer(src);
            self.resizeContainer.show();
        };

        this.hideResizeContainer = function() {
            self.resizeContainer.hide();
            if (self.isInitResize) {
                self.resizeImage.draggable("destroy");
                self.isInitResize = false;
            }
            self.resizeImage.attr("src", "");
            self.resizeImage.attr("style", "top:0px; left:0px");
        };

        this.showCropAndResizeContainer = function() {
            self.imageContainer.hide();
            self.saveButtonsContainer.hide();
            self.cropAndResizeContainer.show();
            self.cropAndResizeButtonsContainer.show();
            self.toogleStateSwith.switch("setState", true);
            self.showCropContainer();
        };

        this.hideCropAndResizeContainer = function() {
            self.cropAndResizeContainer.hide();
            self.cropAndResizeButtonsContainer.hide();
            self.hideCropContainer();
            self.hideResizeContainer();
            self.imageContainer.show();
            self.saveButtonsContainer.show();
        };

        this.clearImagePopup = function() {
            self.previewContainer.empty();
            self.modifyImageContainer.empty();
        };

        this.initCropContainer = function(src) {
            self.firstImageLoad = false;
            self.preview.attr("src", "");
            self.preview.attr("src", src);
        };

        this.initResizeContainer = function(src) {
            self.resizeImage.attr("src", src);
            var naturalWidth = self.resizeImage[0].naturalWidth;
            var naturalHeigth = self.resizeImage[0].naturalHeight;
            
            if (naturalWidth * 0.75 > naturalHeigth) {
                self.resizeImage.width(self.width);
            } else {
                self.resizeImage.height(self.height);
            }

            self.sliderSize.slider("value", 100);

            self.resizeImage.draggable({
                containment: "parent",
            });
            self.isInitResize = true;
        };

        this.sliderResizeImage = function(data) {
            var widthScale;
            var heightScale;
            var floor = Math.floor;
            var scaleImage = self.resizeImage[0].naturalWidth / self.resizeImage[0].naturalHeight;
            if (self.resizeImage.width() > self.resizeImage.height()) {
                widthScale = ((self.width * data.value) / 100);
                heightScale = widthScale / scaleImage;
            } else {
                heightScale = ((self.height * data.value) / 100);
                widthScale = heightScale * scaleImage;
            }

            var x = self.resizeImage[0].offsetLeft;
            var y = self.resizeImage[0].offsetTop;

            if (floor(widthScale + x) > self.width || floor(heightScale + y) > self.height) {
                return false;
            }

            self.resizeImage.width(widthScale);
            self.resizeImage.height(heightScale);
            return true;
        };

        this.uploadImage = function() {
            window.callback = function() {
            };

            $('body').append('<iframe id="preview-iframe" onload="callback();" name="preview-iframe" style="display:none"></iframe>');
            var state = self.toogleStateSwith.switch("status");
            if (!state) {
                self.calculateResizeSize();
            }
            var action = self.uploadImageForm.attr('target', 'preview-iframe').attr('action');
            window.callback = function() {
                var result = $('#preview-iframe').contents().find('json').html();
                $('#preview-iframe').remove();
                $("Base64Image", self.context).val("");
                self.uploadImageButton.attr('disabled', false);
                self.addModifyImage(jQuery.parseJSON(result));
            };

            self.uploadImageForm.submit().attr('action', action).attr('target', '');
        };

        this.preview = $('#preview', self.context).load(function() {
            if (!self.firstImageLoad) {
                if ($(this).width() > $(this).height()) {
                    $('#uploadCut').css('height', self.width + 5);
                    $('#preview').css('height', self.width + 5);
                    $('#uploadCut').css('width', '');
                    $('#preview').css('width', '');
                } else {
                    $('#uploadCut').css('height', '');
                    $('#preview').css('height', '');
                    $('#uploadCut').css('width', self.width + 5);
                    $('#preview').css('width', self.width + 5);
                }

                self.calculateCropSize(0, 0, self.width, self.height);

                self.ias.setOptions({
                    x1: 0,
                    y1: 0,
                    x2: self.width,
                    y2: self.height,
                    aspectRatio: "4:3",
                    show: true
                });
            }
        });

        this.setPreview = function(x, y, w, h) {
            $('#X', self.context).val(x || 0);
            $('#Y', self.context).val(y || 0);
            $('#Width', self.context).val(w || self.preview[0].naturalWidth);
            $('#Height', self.context).val(h || self.preview[0].naturalHeight);
        };

        this.ias = self.preview.imgAreaSelect({
            handles: true,
            instance: true,
            parent: 'body',
            minWidth: self.width,
            minHeight: self.height,
            onSelectEnd: function(s, e) {
                self.calculateCropSize(e.x1, e.y1, e.width, e.height);
            }
        });

        this.calculateCropSize = function(x, y, width, heidth) {
            var scale = self.preview[0].naturalWidth / self.preview.width();
            var f = Math.floor;
            self.setPreview(f(scale * x), f(scale * y), f(scale * width), f(scale * heidth));
        };

        this.calculateResizeSize = function() {
            var resizeImage = self.resizeImage;
            var scale = self.orginalResizeWidth / self.width;
            var floor = Math.floor;
            var x = resizeImage[0].offsetLeft;
            var y = resizeImage[0].offsetTop;
            var width = resizeImage.width();
            var heigth = resizeImage.height();

            self.setPreview(floor(scale * x), floor(scale * y), floor(scale * width), floor(scale * heigth));
        };

        this.addElementToCarousel = function(carouselEl, data) {
            var carousel = carouselEl.data("jcarousel");
            var carouselSize = carousel.size();
            carousel.size(carouselSize + 1);
            carousel.add(carouselSize + 1, data);
            var currentElement = carousel.list.find("li:last");
            currentElement.width(81);
            carousel.list.css("width", parseInt(carousel.list.css("width")) + 91 + "px");
        };

        this.deleteElementToCarousel = function(carouselEl) {
            var carousel = carouselEl.data("jcarousel");
            var carouselSize = carousel.size();
            carousel.size(carouselSize - 1);
            self.updateCarouselNumbers(carouselEl);
        };

        this.updateCarouselNumbers = function(carousel) {
            var length = carousel.children().length;

            for (var i = 1; i <= length + 2; i++) {
                $('.jcarousel-item-' + i, carousel).removeClass('jcarousel-item-' + i);
                $('.jcarousel-item-' + i + '-horizontal', carousel).removeClass('jcarousel-item-' + i + '-horizontal');
            }

            carousel.children().each(function(j, sender) {
                $(sender).addClass('jcarousel-item-' + (j + 1));
                $(sender).addClass('jcarousel-item-' + (j + 1) + '-horizontal');
                $(sender).attr('jcarouselindex', j + 1);
            });
        };

        this.carouselEmptyMessage = function(carouselEl, message) {
            var carousel = carouselEl.data("jcarousel");
            var size = carousel.size();
            var emptyMessage = carouselEl.closest(".jcarousel-clip").find("#carousel-empty-message");
            if (size <= 0) {
                var insertHtml = "<div id = \"carousel-empty-message\" style = \"text-align:center; margin-top: 29px;\">" + message + "</div>";
                if (emptyMessage.length <= 0) {
                    carouselEl.closest(".jcarousel-clip").append(insertHtml);
                }
            } else {
                if (emptyMessage.length > 0) {
                    emptyMessage.remove();
                }
            }
        };

        this.carouselDestructor = function(carouselEl) {
            var carousel = carouselEl.data("jcarousel");
            carousel.size(0);
            carousel.last = 0;
            carousel.first = 0;
            carousel.reload();
        };

        this.changeStateSaveButton = function() {
            if (self.modifyImageContainer.find("li").length > 0) {
                self.saveImageButton.attr("disabled", false);
            } else {
                self.saveImageButton.attr("disabled", true);
            }
        };

        this.addPreviewImage = function(data) {
            var src = "data:" + data.result.mime + ";base64, " + data.result.message;
            var insertHtml = "<li class = \"image\">" +
                "<a onclick = \"addPreviewImage.call(this)\" class = \"thumbnail\">" +
                "<img class = \"preview-image\" src = \"" + src + "\" alt=\"image preview\"/>" +
                "</a>" +
                "<span class=\"btn btn-mini btn-danger delete-image\" onclick = \"deletePreviewImage.call(this)\">Delete</span>" +
                "</li>";

            self.addElementToCarousel(self.previewCarusel, insertHtml);
            self.carouselEmptyMessage(self.previewCarusel, self.previewCarouselEmptyMessage);
        };

        this.deletePreviewImage = function(image) {
            if (image != undefined && image.length > 0) {
                image.remove();
            }
            self.deleteElementToCarousel(self.previewCarusel);
            self.carouselEmptyMessage(self.previewCarusel, self.previewCarouselEmptyMessage);
        };

        this.addOnCropAndResizeImage = function(image) {
            var src = image.attr("src");
            $("#Base64Image", self.context).val(src);
            self.showCropAndResizeContainer();
        };

        this.addModifyImage = function(imageData) {
            var imageId = imageData.id;
            var imageName = imageData.name;
            var imageSrc = imageData.url;
            
            var insertHtml = '<li style = "width: 81px !important;" class="image"> <a class="thumbnail">'
                + '<img class="modify-image" data-imageid="' + imageId
                + '" data-imagename="' + imageName
                + '" src="' + imageSrc + '" /></a>'
                + '<span class="btn btn-mini btn-danger delete-image" onclick="deleteModifyImage.call(this);">Delete</span>'
                + '</li>';
            $("#Base64Image", self.context).val("");
            self.addElementToCarousel(self.modifyCarousel, insertHtml);
            self.carouselEmptyMessage(self.modifyCarousel, self.modifyCarouselEmptyMessage);
            self.hideCropAndResizeContainer();
            self.changeStateSaveButton();
        };

        this.deleteModifyImage = function(image) {
            if (image != undefined && image.length > 0) {
                image.remove();
            }
            self.deleteElementToCarousel(self.modifyCarousel);
            self.carouselEmptyMessage(self.modifyCarousel, self.modifyCarouselEmptyMessage);
            self.changeStateSaveButton();
        };
    }

    function addPreviewImage() {
        var img = $(this).find("img");
        window.imageUploaderWrapper.addOnCropAndResizeImage(img);
    }

    function deletePreviewImage() {
        var image = $(this).closest("li.image");
        window.imageUploaderWrapper.deletePreviewImage(image);
    }

    function deleteModifyImage() {
        var img = $(this).closest("li.image");
        window.imageUploaderWrapper.deleteModifyImage(img);
    }

    function insertImage(imageName, imageSrc) {
        window.imageUploaderWrapper.currentImageList.push(new models.ko.Image({
            name: imageName,
            url: imageSrc
        }));
    }

    return initializeImageUploaderWrapper();
});