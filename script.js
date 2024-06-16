window.onload = function() {
    const lines = document.querySelectorAll('.line');
    const content = document.getElementById('content');
    const line1 = document.getElementById('line1');
    const initialWhiteStripPosition = window.innerHeight * 0.2;

    // Function to scroll the content manually
    function scrollContent() {
        let start = null;
        const duration = 2000; // 2 seconds for the scroll
        const targetScroll = line1.getBoundingClientRect().top - initialWhiteStripPosition;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            content.style.transform = `translateY(${-percentage * targetScroll}px)`;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                animateLines(); // Animate lines when scrolling stops
            }
        }

        window.requestAnimationFrame(step);
    }

    // Wrap words in spans
    lines.forEach(line => {
        wrapWordsWithSpan(line);
    });

    // Start scrolling
    scrollContent();

    function wrapWordsWithSpan(lineElement) {
        const words = lineElement.textContent.trim().split(' ');
        lineElement.innerHTML = ''; // Clear the line
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word + ' ';
            wordSpan.classList.add('word');
            wordSpan.style.opacity = 0.3; // Initial reduced opacity
            lineElement.appendChild(wordSpan);
        });
    }

    function animateLines() {
        let totalDelay = 0;
        lines.forEach((line, lineIndex) => {
            setTimeout(() => {
                line.classList.add('visible'); // Zoom in animation
                animateWords(line); // Animate words' opacity change

                if (lineIndex === lines.length - 1) { // Last line
                    setTimeout(() => {
                        const lastWord = line.querySelector('.word:last-child');
                        lastWord.classList.add('strikethrough');
                        setTimeout(() => {
                            lastWord.classList.add('active'); // Trigger strikethrough animation
                            
                            // Add new word "people" beside the strikethrough line
                            const newWord = document.createElement('span');
                            newWord.classList.add('new-word');
                            newWord.textContent = '  ^ people';
                            newWord.style.position = 'absolute';
                            newWord.style.top = '53%';
                            newWord.style.left = `${lastWord.getBoundingClientRect().right + 10}px`;
                            newWord.style.transform = 'translateY(-50%)';
                            newWord.style.opacity = 0;
                            document.body.appendChild(newWord);

                            setTimeout(() => {
                                newWord.style.opacity = 1; // Show new word after strikethrough animation
                            }, 1000); // Adjust delay to sync with strikethrough animation
                            
                        }, 500); // Delay before starting the strikethrough animation
                    }, (line.children.length + 1) * 500); // Delay strikethrough until after words animation
                }
            }, totalDelay);
            totalDelay += 500; // Delay each line animation by 500ms
        });
    }

    function animateWords(line) {
        const words = line.querySelectorAll('.word');
        words.forEach((word, wordIndex) => {
            setTimeout(() => {
                word.style.opacity = 1; // Change opacity to full
            }, wordIndex * 500); // Delay each word animation by 500ms
        });
    }
};
