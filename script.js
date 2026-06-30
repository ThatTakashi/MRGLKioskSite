document.querySelectorAll('.grid-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); 
    
    const targetDiv = this.querySelector('.grid-item');
    if (!targetDiv) return; 
    
    const rect = targetDiv.getBoundingClientRect();
    const currentRadius = window.getComputedStyle(targetDiv).borderRadius;
    
    // 1. Create the overlay panel layout
    const overlay = document.createElement('div');
    overlay.className = 'expanded-bg';
    overlay.style.backgroundImage = targetDiv.style.backgroundImage;
    overlay.innerHTML = targetDiv.innerHTML;
    document.body.appendChild(overlay);
    
    // 2. Define animation keyframes (Start State -> End State)
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
    
    // 3. Trigger expansion animation
    overlay.animate(openKeyframes, animationTiming);
    
    // 4. CRITICAL FOR ANDROID KIOSK: Create a fake history point
    // This intercepts the physical hardware back button action
    history.pushState({ isExpandedView: true }, '');
    
    // Function to run the closing shrink animation safely
    function closeOverlayView() {
      const closeAnimation = overlay.animate(openKeyframes, {
        duration: 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        direction: 'reverse', 
        fill: 'forwards'
      });
      
      closeAnimation.onfinish = () => overlay.remove();
    }
    
    // 5. Shrink overlay if user clicks directly on the expanded screen
    overlay.addEventListener('click', function() {
      // Step backward in history programmatically, which triggers popstate
      history.back(); 
    });

    // 6. Define the function to catch the physical Android back button event
    function handleAndroidBackButton(event) {
      closeOverlayView();
      // Clean up the global event listener immediately to prevent event pollution
      window.removeEventListener('popstate', handleAndroidBackButton);
    }

    // Bind listener to intercept back events while this item is active
    window.addEventListener('popstate', handleAndroidBackButton);
  });
});

// 7. GLOBAL FALLBACK: Cleans up any hanging nodes if cache acts up on cold wake
window.addEventListener('pageshow', function() {
  document.querySelectorAll('.expanded-bg').forEach(overlay => overlay.remove());
});
