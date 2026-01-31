// Page Loader - Simple and Fast
(function() {
    var loaderHidden = false;
    
    // Create loader
    var loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:white;display:flex;align-items:center;justify-content:center;z-index:99999;';
    
    var container = document.createElement('div');
    container.id = 'lottie-container';
    container.style.cssText = 'width:300px;height:65px;';
    loader.appendChild(container);
    
    // Insert as first element
    document.body.insertBefore(loader, document.body.firstChild);

    function hideLoader() {
        if (loaderHidden) return;
        loaderHidden = true;
        loader.style.transition = 'opacity 0.3s';
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 300);
    }

    function playAnimation() {
        if (typeof lottie === 'undefined') {
            hideLoader();
            return;
        }
        
        var anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'Assets/lottieReload/makalogo.json'
        });

        anim.addEventListener('complete', hideLoader);
        setTimeout(hideLoader, 3000); // Fallback
    }

    // Wait for everything to be ready
    if (document.readyState === 'complete') {
        playAnimation();
    } else {
        window.addEventListener('load', playAnimation);
    }
})();
