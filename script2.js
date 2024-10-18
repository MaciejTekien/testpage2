document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const arrowUp = document.querySelector('.arrowU');
    const arrowDown = document.querySelector('.arrowD');
    const navLinks = document.querySelectorAll('.rightLinks a');
    const menu = document.getElementById('menu');
    const naviBar = document.querySelector('.naviBar');
    const rightLinks = document.querySelector('.rightLinks');
    const skillsContainer = document.querySelector('.skills-content')
    const skillsContent = document.querySelector('.skills');
    const skills = document.querySelectorAll('.skill');
    const arrowRight = document.querySelector('.arrowR');
    const arrowLeft = document.querySelector('.arrowL');
    const skillDescription = document.querySelectorAll('.skill-description')

    let currentSection = 0;
    let wheelFlag = true;
    let lastTouchY = 0;
    let skillsIndex = 0;
    let movedDistance = 0;
    const root = document.documentElement;
    const vars = getComputedStyle(root);

    function convertRemToPixels(remNum) {
        return remNum * parseFloat(vars.fontSize)
    }

    const skillMargin = 2 * convertRemToPixels(parseFloat(vars.getPropertyValue('--skill-margin')))

    menu.addEventListener('click', function() {
        rightLinks.classList.toggle('show');
        naviBar.classList.toggle('change');
        menu.classList.toggle('open');
    })

    const updateSections = () => {
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        arrowUp.style.display = currentSection > 0 ? 'flex' : 'none';
        arrowDown.style.display = currentSection < sections.length - 1 ? 'flex' : 'none';
    };

    arrowUp.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection--;
            updateSections();
        }
    });

    arrowDown.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            updateSections();
        }
    });

    function handleScroll(e) {
        if (!wheelFlag) {
            return;
        }

        let delta = 0;

        if (e.type === 'wheel') {
            delta = e.deltaY;
        } else if (e.type === 'touchmove') {
            delta = e.touches[0].clientY - lastTouchY;
            lastTouchY = e.touches[0].clientY;
        }

        if (e.deltaY > 0) {
            if (currentSection < sections.length - 1) {
                currentSection++;
                updateSections();
            }
            wheelFlag = false;
            setTimeout(() => {
                wheelFlag = true;
            }, '500');
        } else if (e.deltaY < 0) {
             if (currentSection > 0) {
                currentSection--;
                updateSections();
            }
            wheelFlag = false;
            setTimeout(() => {
                wheelFlag = true;
            }, '500');
        }
    }


    function getVisibleSkillsCount() {
        const skillsContainerWidth = skillsContainer.clientWidth;
        const skillsWidth = skills[0].clientWidth;
        return Math.floor(skillsContainerWidth / (skillsWidth + skillMargin));
    }

    function moveSkills(direction) {
        const visibleSkills = getVisibleSkillsCount();
        const skillWidth = skills[0].clientWidth;
        const skillMargin = 2 * convertRemToPixels(parseFloat(vars.getPropertyValue('--skill-margin')))
        const moveDistance = (visibleSkills - 1) * (skillWidth + skillMargin);

        if (direction === 'right') {
            movedDistance = movedDistance - moveDistance;
            maxDistance = -(skills.length * (skillWidth + skillMargin)) + skillsContainer.clientWidth
            if (movedDistance <= maxDistance) {
                movedDistance = maxDistance;
                arrowRight.style.display = 'none';
            };

            skillsContent.style.transform = `translateX(${movedDistance}px)`;
        } else if (direction === 'left') {
            movedDistance = movedDistance + moveDistance;
            if (movedDistance >= 0) {
                movedDistance = 0;
                arrowLeft.style.display = 'none';
            };
            skillsContent.style.transform = `translateX(${movedDistance}px)`;
        };
    };

    function rightArrowDisplay() {
        if ((skills[0].clientWidth + 2 * convertRemToPixels(parseFloat(vars.getPropertyValue('--skill-margin')))) * skills.length <= skillsContainer.clientWidth) {
            arrowRight.style.display = 'none';
        } else { arrowRight.style.display = 'flex' };
    }

    rightArrowDisplay()

    window.addEventListener('resize', rightArrowDisplay(), console.log('resize'));

    arrowLeft.addEventListener('click', () => {
        moveSkills('left');
        arrowRight.style.display = 'flex';
    });

    arrowRight.addEventListener('click', () => {
        moveSkills('right');
        arrowLeft.style.display = 'flex';
    });

    function lastLetters(text) {
        return `${text[text.length - 2]}${text[text.length - 1]}`;
    };

    skills[0].style.border = 'solid';
    skills[0].style.transform = 'translateY(-15px)';
    skillDescription[0].style.display = 'flex';
    skillDescription[0].style.transform = 'translateY(-15px)';

    skills.forEach(skill => {
        skill.addEventListener('click', () => {
            skills.forEach(skill2 => {
                skill2.style.border = 'none';
                skill2.style.transform = 'translateY(0px)';
            });

            skillDescription.forEach(skillDe => {
                skillDe.style.transform = 'translateX(0px)';
                setTimeout(() => { skillDe.style.display = 'none' }, 30);
            });

            skillDescription.forEach(skillDe => {
                if (lastLetters(skill.id) == lastLetters(skillDe.id)) {     
                    setTimeout(() => { skillDe.style.display = 'flex' }, 31);
                    setTimeout(() => { skillDe.style.transform = 'translateY(-15px)' }, 40);
                };
            });
        

            skill.style.border = 'solid';
            skill.style.transform = 'translateY(-15px)';
            
        });
    });
    

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = parseInt(link.getAttribute('data-section'));
            if (!isNaN(targetSection) && targetSection >= 0 && targetSection < sections.length) {
                currentSection = targetSection;
                updateSections();
            };
        });
    });

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', function(e) {
        lastTouchY = e.touches[0].clientY;
    }, {passive: true});
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // setInterval(nextSkill, 15000);

    updateSections();
});


