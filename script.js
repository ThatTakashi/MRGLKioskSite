document.querySelectorAll('.grid-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Stop instant navigation so animation can play
    
    const targetDiv = this.querySelector('.grid-item');
    if (!targetDiv) return; 
    
    const rect = targetDiv.getBoundingClientRect();
    const currentRadius = window.getComputedStyle(targetDiv).borderRadius;
    const destinationUrl = this.getAttribute('href');
    
    // 1. Create the overlay panel
    const overlay = document.createElement('div');
    overlay.className = 'expanded-bg';
    overlay.style.backgroundImage = targetDiv.style.backgroundImage;
    overlay.innerHTML = targetDiv.innerHTML;
    document.body.appendChild(overlay);
    
    // 2. Define animation frames (Start State -> End State)
    const openKeyframes = [
      {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius: currentRadius
      },
      {
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100vh',
        borderRadius: '0px'
      }
    ];
    
    const animationTiming = {
      duration: 500,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    };
    
    // 3. Run the expansion animation
    const openAnimation = overlay.animate(openKeyframes, animationTiming);
    
    // 4. Navigate to the link destination only AFTER the animation completes
    if (destinationUrl && destinationUrl !== '#') {
      openAnimation.onfinish = () => {
        window.location.href = destinationUrl;
      };
    }
  });
});

// 5. ANDROID KIOSK BACK BUTTON FIX
// When navigating back from the destination site, Android WebViews redraw 
// the page from memory cache. This fires instantly and resets the layout.
window.addEventListener('pageshow', function() {
  const visibleOverlays = document.querySelectorAll('.expanded-bg');
  visibleOverlays.forEach(overlay => {
    overlay.remove(); // Instantly removes the full-screen view so the clean grid shows
  });
});
