(function () {
    var d = document.getElementsByTagName("script")[0], f = d.parentNode, g = /ed|co/, e = function (b, c) {
        var a = document.createElement("script");
        a.onload = a.onreadystatechange = function () {
            if (!this.readyState || g.test(this.readyState)) {
                a.onload = a.onreadystatechange = null;
                c && c(a);
                a = null
            }
        };
        a.async = true;
        a.src = b;
        f.insertBefore(a, d)
    };
    window.sssl = function (b, c) {
        if (typeof b == "string") e(b, c); else {
            var a = b.shift();
            e(a, function () {
                if (b.length) window.sssl(b, c); else c && c()
            })
        }
    }
})();

window.addEventListener('beforeinstallprompt', e => {
    return beforeInstallprompt(e);
});
window.addEventListener('load', () => {
    registerSW.go();
    registerMain.go();
    binary_circle.go();
    new NavigationPage();
});
window.addEventListener('resize', function () {
    binary_circle();
});

function beforeInstallprompt(e) {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.querySelector('.welcomeMsg').classList.add("activation");
        createEl('welcomeMsg', './js/includes/WELCOME TO DASHBOARD');
        return e.preventDefault();
    } else {
        createEl('installMsg', './js/includes/<span><b>CLICK HERE</b> TO INSTALL DASHBOARD 🚀 </span>');
        const btn = document.querySelector('.installMsg')
        document.querySelector('.installMsg').classList.add("activation");
        btn.onclick = _ => e.prompt();
        return e.preventDefault();
    }
}

class registerSW {
    static go() {
        if ('serviceWorker' in navigator) {
            try {
                navigator.serviceWorker.register('/serviceworker.js');
            } catch (e) {
                console.log('SW registration failed');
            }
        }
    }
}

class registerMain {
    static go() {
        Particles.init({selector: ".background"});
        $(".btn").click(function () {
            $('html').addClass('login');

        });
        var particles = Particles.init({
            selector: ".background",
            color: ["#03dac6", "#ff0266", "#000000"],
            connectParticles: true,
            responsive: [{
                breakpoint: 768,
                options: {color: ["#faebd7", "#03dac6", "#ff0266"], maxParticles: 43, connectParticles: false}
            }]
        });
    }
}

class NavigationPage {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.lastScroll = 0;
        let self = this;
        $(".nav-tab").click(function () {
            self.onTabClick(event, $(this));
        });
        $(window).scroll(() => {
            this.onScroll();
        });
        $(window).resize(() => {
            this.onResize();
        });
    }

    onTabClick(event, element) {
        event.preventDefault();
        let scrollTop = $(element.attr("href")).offset().top - this.tabContainerHeight + 1;
        $("html, body").animate({scrollTop: scrollTop}, 600);
    }

    onScroll() {
        this.checkHeaderPosition();
        this.findCurrentTabSelector();
        this.lastScroll = $(window).scrollTop();
    }

    onResize() {
        if (this.currentId) {
            this.setSliderCss();
        }
    }

    checkHeaderPosition() {
        const headerHeight = 75;
        if ($(window).scrollTop() > headerHeight) {
            $(".header").addClass("header--scrolled");
        } else {
            $(".header").removeClass("header--scrolled");
        }
        let offset = $(".nav").offset().top +
            $(".nav").height() -
            this.tabContainerHeight -
            headerHeight;
        if ($(window).scrollTop() > this.lastScroll && $(window).scrollTop() > offset) {
            $(".header").addClass("et-header--move-up");
            $(".nav-container").removeClass("nav-container--top-first");
            $(".nav-container").addClass("nav-container--top-second");
        } else if ($(window).scrollTop() < this.lastScroll && $(window).scrollTop() > offset) {
            $(".header").removeClass("et-header--move-up");
            $(".nav-container").removeClass("nav-container--top-second");
            $(".et-hero-tabs-container").addClass("et-hero-tabs-container--top-first");
        } else {
            $(".header").removeClass("header--move-up");
            $(".nav-container").removeClass("nav-container--top-first");
            $(".nav-container").removeClass("nav-container--top-second");
        }
    }

    findCurrentTabSelector(element) {
        let newCurrentId;
        let newCurrentTab;
        let self = this;
        $(".nav-tab").each(function () {
            let id = $(this).attr("href");
            let offsetTop = $(id).offset().top - self.tabContainerHeight;
            let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
            if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
                newCurrentId = id;
                newCurrentTab = $(this);
            }
        });
        if (this.currentId != newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }

    setSliderCss() {
        let width = 0;
        let left = 0;
        if (this.currentTab) {
            width = this.currentTab.css("width");
            left = this.currentTab.offset().left;
        }
        $(".nav-tab-slider").css("width", width);
        $(".nav-tab-slider").css("left", left);
    }
}

class binary_circle {
    canvas;
    height;
    width;
    ctx;
    letters;
    font_size;
    drops;
    frame;

    static go() {
        binary_circle.canvas = document.querySelector('canvas'), binary_circle.ctx = binary_circle.canvas.getContext('2d'), binary_circle.letters = '010110', binary_circle.height = binary_circle.canvas.height = window.innerHeight, binary_circle.width = binary_circle.canvas.width = window.innerWidth, binary_circle.font_size = 10, binary_circle.columns = binary_circle.width / binary_circle.font_size, binary_circle.drops = [], binary_circle.frame = 1;
        binary_circle.letters = binary_circle.letters.split("");
        for (let i = 0; i < binary_circle.columns; i++) {
            binary_circle.drops[i] = 1;
        }
        binary_circle.clear()
        binary_circle.height = binary_circle.canvas.height = window.innerHeight;
        binary_circle.width = binary_circle.canvas.width = window.innerWidth;
    }

    static clear() {
        binary_circle.ctx.fillStyle = 'rgba(0, 0, 0,0.1)';
        binary_circle.ctx.fillRect(0, 0, binary_circle.width, binary_circle.height);
    }

    static draw() {
        if (binary_circle.frame == 1) {
            binary_circle.clear();
            binary_circle.showLetters();
        } else if (binary_circle.frame == 2) {
            binary_circle.frame = 0;
        }
        binary_circle.frame++;
        window.requestAnimationFrame(binary_circle.draw);
    }

    static showLetters() {
        binary_circle.ctx.fillStyle = "#fff";
        binary_circle.ctx.font = binary_circle.font_size + "px Gotham";
        for (let i = 0; i < binary_circle.drops.length; i++) {
            let text = binary_circle.letters[Math.floor(Math.random() * binary_circle.letters.length)];
            let textPosY = binary_circle.drops[i] * binary_circle.font_size;
            binary_circle.ctx.fillText(text, i * binary_circle.font_size, binary_circle.textPosY);
            if (textPosY > binary_circle.height && Math.random() > 0.956) {
                binary_circle.drops[i] = 0;
            }
            binary_circle.drops[i]++;
        }
    }
}

sssl(['./js/includes/newNote.js', './js/includes/newTask.js', './js/includes/notes.js', './js/includes/profile.js', './js/includes/sign-in.js', './js/includes/sign-out.js', './js/includes/sign-out.js', './js/includes/viewNote.js', './js/includes/viewTask.js'], function () {
});