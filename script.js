document.addEventListener('DOMContentLoaded', () => {
  const stopCards = document.querySelectorAll('.stop-card');
  const trackNodes = document.querySelectorAll('.track-node');
  const carMarker = document.getElementById('car-marker');
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const polaroidCard = document.getElementById('polaroid-card');
  const startBtns = document.querySelectorAll('.start-btn');
  
  const imgA = document.getElementById('photo-a');
  const imgB = document.getElementById('photo-b');
  const caption = document.getElementById('polaroid-caption');

  const backTime = document.getElementById('back-time');
  const backReqs = document.getElementById('back-reqs');
  const backTakeaway = document.getElementById('back-takeaway');

  let activeIndex = 0;
  const totalStops = stopCards.length;

  // Initialize first state
  updateCarousel(activeIndex);

  // --- BUTTON NAVIGATION ---
  prevBtn.addEventListener('click', () => {
    if (activeIndex > 0) {
      activeIndex--;
      updateCarousel(activeIndex);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (activeIndex < totalStops - 1) {
      activeIndex++;
      updateCarousel(activeIndex);
    }
  });

  // --- NODE NAVIGATION ---
  trackNodes.forEach((node) => {
    node.addEventListener('click', () => {
      const jumpIndex = parseInt(node.getAttribute('data-jump'), 10);
      if (jumpIndex !== activeIndex) {
        activeIndex = jumpIndex;
        updateCarousel(activeIndex);
      }
    });
  });

  // --- STAMP TRIGGER ---
  startBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentRow = btn.closest('.action-row');
      const stamp = parentRow?.querySelector('.passport-stamp');
      if (stamp) {
        stamp.classList.add('stamped');
      }
    });
  });

  // --- 3D CARD FLIP ---
  polaroidCard.addEventListener('click', () => {
    polaroidCard.classList.toggle('is-flipped');
  });

  // --- MASTER UPDATE FUNCTION ---
  function updateCarousel(index) {
    // 1. Update Button States
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalStops - 1;

    // 2. Switch Active Card
    stopCards.forEach((c, i) => {
      c.classList.toggle('active', i === index);
    });

    // 3. Update Track Nodes
    trackNodes.forEach((node, i) => {
      node.classList.toggle('active', i <= index);
    });

    // 4. Move Car Marker (Left to Right)
    const progressPercent = (index / (totalStops - 1)) * 100;
    carMarker.style.left = `${progressPercent}%`;

    // 5. Update Polaroid Info
    const activeCard = document.getElementById(`stop-${index}`);
    const newImageSrc = activeCard.getAttribute('data-image');
    const newCaptionText = activeCard.getAttribute('data-caption');
    const tiltDirection = activeCard.getAttribute('data-tilt');

    backTime.textContent = activeCard.getAttribute('data-time');
    backReqs.textContent = activeCard.getAttribute('data-reqs');
    backTakeaway.textContent = activeCard.getAttribute('data-takeaway');

    const activeImg = imgA.classList.contains('active') ? imgA : imgB;
    const nextImg = activeImg === imgA ? imgB : imgA;

    const tiltAngle = tiltDirection === 'right' ? '3.5deg' : '-3.5deg';
    polaroidCard.style.setProperty('--tilt-angle', tiltAngle);

    caption.style.opacity = '0';
    setTimeout(() => {
      caption.textContent = newCaptionText;
      caption.style.opacity = '1';
    }, 200);

    nextImg.src = newImageSrc;
    activeImg.classList.remove('active');
    nextImg.classList.add('active');
    
    // Ensure card is flipped to front when changing stops
    polaroidCard.classList.remove('is-flipped');
  }
});
