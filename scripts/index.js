var photoswipeElement = document.querySelector('.pswp');
var galleries = [];
var defaultOptions = {
    escKey: true,
    arrowKeys: true,
    bgOpacity: 0.8,
    showHideOpacity: true,
    fullscreenEl: false
};

var createGallery = function (gallery) {
    var bodyElement = document.querySelector('body');

    gallery.instance = new PhotoSwipe(photoswipeElement,
        PhotoSwipeUI_Default,
        gallery.items,
        JSON.parse(JSON.stringify(gallery.options)));

    gallery.instance.init();
    bodyElement.classList.add('js-lightbox-open');
    gallery.instance.listen('close', function () {
        gallery.instance = null;
        bodyElement.classList.remove('js-lightbox-open');
    });
}

var buildPhotoswipeItems = function (imagesItems) {
    var result = [];

    for (var i = 0; i < imagesItems.length; i++) {
        if (!imagesItems[i].dataset.fullUrl || !imagesItems[i].dataset.fullSize) {
            continue;
        }
        var item = imagesItems[i];
        var size = item.getAttribute('data-full-size').split('x');
        var width;
        var height;

        if (size && size.length == 2) {
            width = parseInt(size[0]);
            height = parseInt(size[1]);
        } else {
            width = window.screen.availWidth;
            height = window.screen.availHeight;
        }

        var newItem = {
            src: item.dataset['fullUrl'],
            w: width,
            h: height,
            title: item.nextElementSibling.innerHTML
        }
        result.push(newItem);
    }
    return result;
}

var initGallery = function (container) {
    var holder = container;
    if (!holder) {
        console.warn("Can't find lightbox gallery holder with selector: " + container);
        return;
    }

    var images = holder.querySelectorAll('img') || [];
    if (!images.length) {
        return;
    }

    var galleryModel = {
        uId: Math.random(),
        holder: holder,
        items: buildPhotoswipeItems(images),
        options: JSON.parse(JSON.stringify(defaultOptions))
    }
    galleryModel.options.galleryUID = galleryModel.uId;

    var imageArray = Array.from(images);

    imageArray.forEach(function (image) {
        image.addEventListener("click", function() {
            galleryModel.options.index = imageArray.indexOf(image);
            createGallery(galleryModel);
        });
    });

    galleries.push(galleryModel);
}


  initGallery(document.querySelector('.js-lightbox-gallery'));

