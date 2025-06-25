/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Kumuha ng lahat ng elemento na may 'scroll-animate' class
    const animatedElements = document.querySelectorAll('.scroll-animate');

    // Mga opsyon para sa Intersection Observer
    const observerOptions = {
        root: null, // Default na viewport
        rootMargin: '0px',
        threshold: 0.1 // Kapag 10% ng elemento ay nakikita, i-trigger ang callback
    };

    // Callback function para sa Intersection Observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Kung ang elemento ay nasa viewport, idagdag ang 'scroll-animate-visible' class
                entry.target.classList.add('scroll-animate-visible');
                // Optional: Ihinto ang pag-obserba kapag na-animate na
                // observer.unobserve(entry.target);
            } else {
                // Optional: Alisin ang 'scroll-animate-visible' class kapag umalis sa viewport
                // entry.target.classList.remove('scroll-animate-visible');
            }
        });
    };

    // Gumawa ng bagong Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // I-obserba ang bawat animated na elemento
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Handle Music Play/Pause
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggleButton = document.getElementById('musicToggleButton');
    let isPlaying = false; // Subaybayan ang estado ng musika

    // Try to play music on load, but handle the promise to catch autoplay policy blocks
    const tryPlayMusic = () => {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started!
                isPlaying = true;
                musicToggleButton.textContent = 'Pause Music';
                musicToggleButton.style.display = 'inline-block'; // Ipakita ang button kung nag-autoplay
            }).catch(error => {
                // Autoplay was prevented. Show the button for user interaction.
                console.warn('Autoplay prevented:', error);
                isPlaying = false;
                musicToggleButton.textContent = 'Play Music';
                musicToggleButton.style.display = 'inline-block'; // Ipakita ang button
            });
        }
    };

    // Initially hide the button, will be shown if autoplay fails or on user interaction
    musicToggleButton.style.display = 'none';

    // Event listener for the music toggle button
    musicToggleButton.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
            musicToggleButton.textContent = 'Play Music';
        } else {
            backgroundMusic.play();
            isPlaying = true;
            musicToggleButton.textContent = 'Pause Music';
        }
    });

    // Try to play music when the DOM is fully loaded
    tryPlayMusic();

    // Check for user interaction to potentially play music later if autoplay failed initially
    // This is a common workaround for strict autoplay policies
    document.body.addEventListener('click', () => {
        if (!isPlaying && backgroundMusic.paused) {
            tryPlayMusic();
        }
    }, { once: true }); // Only trigger this once
});