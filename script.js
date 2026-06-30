document.querySelectorAll('.grid-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); 
    
    const targetDiv = this.querySelector('.grid-item');
    if (!targetDiv) return; 
    
    const rect = targetDiv.getBoundingClientRect();
    const currentRadius = window.getComputedStyle(targetDiv).borderRadius;
    
    // 1. Create the overlay panel
    const overlay = document.createElement('div');
    overlay.className = 'expanded-bg';
    overlay.style.backgroundImage = targetDiv.style.backgroundImage;
    
    // 2. Clone the inner HTML (the logo) into the new overlay
    overlay.innerHTML = targetDiv.innerHTML;
    
    document.body.appendChild(overlay);
    
    // 3. Define animation frames (Start State -> End State)
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
    
    // 4. Run expansion animation
    overlay.animate(openKeyframes, animationTiming);
    
    // 5. Shrink and remove when clicked
    overlay.addEventListener('click', function() {
      const closeAnimation = overlay.animate(openKeyframes, {
        duration: 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        direction: 'reverse', 
        fill: 'forwards'
      });
      
      closeAnimation.onfinish = () => overlay.remove();
    });
  });
});
