const _window = window;
(function(){var d=document.getElementsByTagName("script")[0],f=d.parentNode,g=/ed|co/,e=function(b,c){var a=document.createElement("script");a.onload=a.onreadystatechange=function(){if(!this.readyState||g.test(this.readyState)){a.onload=a.onreadystatechange=null;c&&c(a);a=null}};a.async=true;a.src=b;f.insertBefore(a,d)};_window.sssl=function(b,c){if(typeof b=="string")e(b,c);else{var a=b.shift();e(a,function(){if(b.length)_window.sssl(b,c);else c&&c()})}}})();


function startGame() {

    /*



    If you want to know how this game was made, check out this video, that explains how it's made:

    https://youtu.be/eue3UdFvwPo

    Follow me on twitter for more: https://twitter.com/HunorBorbely

    */

// Extend the base functionality of JavaScript
    Array.prototype.last = function () {
        return this[this.length - 1];
    };

// A sinus function that acceps degrees instead of radians
    Math.sinus = function (degree) {
        return Math.sin((degree / 180) * Math.PI);
    };

// Game data
    let phase = "waiting"; // waiting | stretching | turning | walking | transitioning | falling
    let lastTimestamp; // The timestamp of the previous requestAnimationFrame cycle

    let heroX; // Changes when moving forward
    let heroY; // Only changes when falling
    let sceneOffset; // Moves the whole game

    let platforms = [];
    let sticks = [];
    let trees = [];

// Todo: Save high score to localStorage (?)

    let score = 0;

// Configuration
    const canvasWidth = 375;
    const canvasHeight = 375;
    const platformHeight = 100;
    const heroDistanceFromEdge = 10; // While waiting
    const paddingX = 100; // The waiting position of the hero in from the original canvas size
    const perfectAreaSize = 10;

// The background moves slower than the hero
    const backgroundSpeedMultiplier = 0.2;

    const hill1BaseHeight = 100;
    const hill1Amplitude = 10;
    const hill1Stretch = 1;
    const hill2BaseHeight = 70;
    const hill2Amplitude = 20;
    const hill2Stretch = 0.5;

    const stretchingSpeed = 4; // Milliseconds it takes to draw a pixel
    const turningSpeed = 4; // Milliseconds it takes to turn a degree
    const walkingSpeed = 4;
    const transitioningSpeed = 2;
    const fallingSpeed = 2;

    const heroWidth = 17; // 24
    const heroHeight = 30; // 40

    const canvas = document.getElementById("game");
    canvas.width = _window.innerWidth; // Make the Canvas full screen
    canvas.height = _window.innerHeight;

    const ctx = canvas.getContext("2d");

    const introductionElement = document.getElementById("introduction");
    const perfectElement = document.getElementById("perfect");
    const restartButton = document.getElementById("restart");
    const scoreElement = document.getElementById("score");

// Initialize layout
    resetGame();

// Resets game variables and layouts but does not start the game (game starts on keypress)
    function resetGame() {
        // Reset game progress
        phase = "waiting";
        lastTimestamp = undefined;
        sceneOffset = 0;
        score = 0;

        introductionElement.style.opacity = 1;
        perfectElement.style.opacity = 0;
        restartButton.style.display = "none";
        scoreElement.innerText = score;

        // The first platform is always the same
        // x + w has to match paddingX
        platforms = [{ x: 50, w: 50 }];
        generatePlatform();
        generatePlatform();
        generatePlatform();
        generatePlatform();

        sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];

        trees = [];
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();

        heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
        heroY = 0;

        draw();
    }

    function generateTree() {
        const minimumGap = 30;
        const maximumGap = 150;

        // X coordinate of the right edge of the furthest tree
        const lastTree = trees[trees.length - 1];
        let furthestX = lastTree ? lastTree.x : 0;

        const x =
            furthestX +
            minimumGap +
            Math.floor(Math.random() * (maximumGap - minimumGap));

        const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
        const color = treeColors[Math.floor(Math.random() * 3)];

        trees.push({ x, color });
    }

    function generatePlatform() {
        const minimumGap = 40;
        const maximumGap = 200;
        const minimumWidth = 20;
        const maximumWidth = 100;

        // X coordinate of the right edge of the furthest platform
        const lastPlatform = platforms[platforms.length - 1];
        let furthestX = lastPlatform.x + lastPlatform.w;

        const x =
            furthestX +
            minimumGap +
            Math.floor(Math.random() * (maximumGap - minimumGap));
        const w =
            minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

        platforms.push({ x, w });
    }

    resetGame();

// If space was pressed restart the game
    _window.addEventListener("keydown", function (event) {
        if (event.key == " ") {
            event.preventDefault();
            resetGame();
            return;
        }
    });

    _window.addEventListener("mousedown", function (event) {
        if (phase == "waiting") {
            lastTimestamp = undefined;
            introductionElement.style.opacity = 0;
            phase = "stretching";
            _window.requestAnimationFrame(animate);
        }
    });

    _window.addEventListener("mouseup", function (event) {
        if (phase == "stretching") {
            phase = "turning";
        }
    });

    _window.addEventListener("resize", function (event) {
        canvas.width = _window.innerWidth;
        canvas.height = _window.innerHeight;
        draw();
    });

    _window.requestAnimationFrame(animate);

// The main game loop
    function animate(timestamp) {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
            _window.requestAnimationFrame(animate);
            return;
        }

        switch (phase) {
            case "waiting":
                return; // Stop the loop
            case "stretching": {
                sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
                break;
            }
            case "turning": {
                sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

                if (sticks.last().rotation > 90) {
                    sticks.last().rotation = 90;

                    const [nextPlatform, perfectHit] = thePlatformTheStickHits();
                    if (nextPlatform) {
                        // Increase score
                        score += perfectHit ? 2 : 1;
                        scoreElement.innerText = score;

                        if (perfectHit) {
                            perfectElement.style.opacity = 1;
                            setTimeout(() => (perfectElement.style.opacity = 0), 1000);
                        }

                        generatePlatform();
                        generateTree();
                        generateTree();
                    }

                    phase = "walking";
                }
                break;
            }
            case "walking": {
                heroX += (timestamp - lastTimestamp) / walkingSpeed;

                const [nextPlatform] = thePlatformTheStickHits();
                if (nextPlatform) {
                    // If hero will reach another platform then limit it's position at it's edge
                    const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
                    if (heroX > maxHeroX) {
                        heroX = maxHeroX;
                        phase = "transitioning";
                    }
                } else {
                    // If hero won't reach another platform then limit it's position at the end of the pole
                    const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
                    if (heroX > maxHeroX) {
                        heroX = maxHeroX;
                        phase = "falling";
                    }
                }
                break;
            }
            case "transitioning": {
                sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

                const [nextPlatform] = thePlatformTheStickHits();
                if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
                    // Add the next step
                    sticks.push({
                        x: nextPlatform.x + nextPlatform.w,
                        length: 0,
                        rotation: 0
                    });
                    phase = "waiting";
                }
                break;
            }
            case "falling": {
                if (sticks.last().rotation < 180)
                    sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

                heroY += (timestamp - lastTimestamp) / fallingSpeed;
                const maxHeroY =
                    platformHeight + 100 + (_window.innerHeight - canvasHeight) / 2;
                if (heroY > maxHeroY) {
                    restartButton.style.display = "block";
                    return;
                }
                break;
            }
            default:
                throw Error("Wrong phase");
        }

        draw();
        _window.requestAnimationFrame(animate);

        lastTimestamp = timestamp;
    }

// Returns the platform the stick hit (if it didn't hit any stick then return undefined)
    function thePlatformTheStickHits() {
        if (sticks.last().rotation != 90)
            throw Error(`Stick is ${sticks.last().rotation}°`);
        const stickFarX = sticks.last().x + sticks.last().length;

        const platformTheStickHits = platforms.find(
            (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
        );

        // If the stick hits the perfect area
        if (
            platformTheStickHits &&
            platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 <
            stickFarX &&
            stickFarX <
            platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2
        )
            return [platformTheStickHits, true];

        return [platformTheStickHits, false];
    }

    function draw() {
        ctx.save();
        ctx.clearRect(0, 0, _window.innerWidth, _window.innerHeight);

        drawBackground();

        // Center main canvas area to the middle of the screen
        ctx.translate(
            (_window.innerWidth - canvasWidth) / 2 - sceneOffset,
            (_window.innerHeight - canvasHeight) / 2
        );

        // Draw scene
        drawPlatforms();
        drawHero();
        drawSticks();

        // Restore transformation
        ctx.restore();
    }

    restartButton.addEventListener("click", function (event) {
        event.preventDefault();
        resetGame();
        restartButton.style.display = "none";
    });

    function drawPlatforms() {
        platforms.forEach(({ x, w }) => {
            // Draw platform
            ctx.fillStyle = "black";
            ctx.fillRect(
                x,
                canvasHeight - platformHeight,
                w,
                platformHeight + (_window.innerHeight - canvasHeight) / 2
            );

            // Draw perfect area only if hero did not yet reach the platform
            if (sticks.last().x < x) {
                ctx.fillStyle = "red";
                ctx.fillRect(
                    x + w / 2 - perfectAreaSize / 2,
                    canvasHeight - platformHeight,
                    perfectAreaSize,
                    perfectAreaSize
                );
            }
        });
    }

    function drawHero() {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(
            heroX - heroWidth / 2,
            heroY + canvasHeight - platformHeight - heroHeight / 2
        );

        // Body
        drawRoundedRect(
            -heroWidth / 2,
            -heroHeight / 2,
            heroWidth,
            heroHeight - 4,
            5
        );

        // Legs
        const legDistance = 5;
        ctx.beginPath();
        ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
        ctx.fill();

        // Band
        ctx.fillStyle = "red";
        ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
        ctx.beginPath();
        ctx.moveTo(-9, -14.5);
        ctx.lineTo(-17, -18.5);
        ctx.lineTo(-14, -8.5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-10, -10.5);
        ctx.lineTo(-15, -3.5);
        ctx.lineTo(-5, -7);
        ctx.fill();

        ctx.restore();
    }

    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
    }

    function drawSticks() {
        sticks.forEach((stick) => {
            ctx.save();

            // Move the anchor point to the start of the stick and rotate
            ctx.translate(stick.x, canvasHeight - platformHeight);
            ctx.rotate((Math.PI / 180) * stick.rotation);

            // Draw stick
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -stick.length);
            ctx.stroke();

            // Restore transformations
            ctx.restore();
        });
    }

    function drawBackground() {
        // Draw sky
        var gradient = ctx.createLinearGradient(0, 0, 0, _window.innerHeight);
        gradient.addColorStop(0, "#BBD691");
        gradient.addColorStop(1, "#FEF1E1");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, _window.innerWidth, _window.innerHeight);

        // Draw hills
        drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
        drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");

        // Draw trees
        trees.forEach((tree) => drawTree(tree.x, tree.color));
    }

// A hill is a shape under a stretched out sinus wave
    function drawHill(baseHeight, amplitude, stretch, color) {
        ctx.beginPath();
        ctx.moveTo(0, _window.innerHeight);
        ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
        for (let i = 0; i < _window.innerWidth; i++) {
            ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
        }
        ctx.lineTo(_window.innerWidth, _window.innerHeight);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawTree(x, color) {
        ctx.save();
        ctx.translate(
            (-sceneOffset * backgroundSpeedMultiplier + x) * hill1Stretch,
            getTreeY(x, hill1BaseHeight, hill1Amplitude)
        );

        const treeTrunkHeight = 5;
        const treeTrunkWidth = 2;
        const treeCrownHeight = 25;
        const treeCrownWidth = 10;

        // Draw trunk
        ctx.fillStyle = "#7D833C";
        ctx.fillRect(
            -treeTrunkWidth / 2,
            -treeTrunkHeight,
            treeTrunkWidth,
            treeTrunkHeight
        );

        // Draw crown
        ctx.beginPath();
        ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
        ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
        ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }

    function getHillY(windowX, baseHeight, amplitude, stretch) {
        const sineBaseY = _window.innerHeight - baseHeight;
        return (
            Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) *
            amplitude +
            sineBaseY
        );
    }

    function getTreeY(x, baseHeight, amplitude) {
        const sineBaseY = _window.innerHeight - baseHeight;
        return Math.sinus(x) * amplitude + sineBaseY;
    }


}
_window.addEventListener('load', (event) => {
    document.querySelector('html').classList.add('loaded');
  });

function timeString(e) {
    const t = new Date(e), r = t.getHours() % 12;
    let n = t.getMinutes();
    return n = n < 10 ? `0${n}` : n, `${r}:${n}`
}

var THIS = null;

function getEl() {
    return THIS || (this.el = $(".starwars"), this.audio = this.el.find("audio").get(0), this.start = this.el.find(".start"), this.animation = this.el.find(".animation"), THIS = this, this)
}

function resetStar() {
    _this = getEl(), _this.start.show(), _this.cloned = _this.animation.clone(!0), _this.animation.remove(), _this.animation = _this.cloned, THIS = _this
}

function StarWars() {
    $(".starwars").addClass("on"), _this = getEl(), _this.start.hide(), _this.audio.play(), _this.el.append(_this.animation), THIS = _this
}
function Login() {
    $("html").addClass("login");
    StarWars();
    setTimeout(startChat,10000);
        setTimeout(startGame,15000);
}
function beforeInstallprompt(e) {
    if (_window.matchMedia("(display-mode: standalone)").matches) return document.querySelector(".welcomeMsg").classList.add("activation"), createEl("welcomeMsg", "./js/includes/WELCOME TO DASHBOARD"), e.preventDefault();
    {
        createEl("installMsg", "./js/includes/<span><b>CLICK HERE</b> TO INSTALL DASHBOARD 🚀 </span>");
        const t = document.querySelector(".installMsg");
        return document.querySelector(".installMsg").classList.add("activation"), t.onclick = t => e.prompt(), e.preventDefault()
    }
}


function startChat() {
    var e = new WebSocket("wss://stream-chat-demo.herokuapp.com");
    const t = document.querySelector("#input"), r = document.querySelector("#messages"),
        n = document.querySelector(".overflow"),
        i = (document.querySelector("#name-input"), document.querySelector("#send"));
    let o, a, s = !0;

    function l(r) {
        r && (t.setAttribute("disabled", !0), t.value = "", e.send(r), o || (o = r, i.innerHTML = "Chat"))
    }

    function u(e) {
        const t = document.createElement("div"), n = timeString(e.timestamp), i = u.odd ? "odd" : "even";
        u.odd = !u.odd, t.setAttribute("class", `${i} message`), t.innerHTML = `\n  <span class='timestamp'>${n}</span>\n  <span class='name' style='color: ${e.color}'>${e.author}:</span>\n  <span class='text'>${e.text}</span>\n`, r.prepend(t)
    }

    e.addEventListener("open", (e => {
    })), e.addEventListener("message", (e => {
        let r;
        try {
            r = JSON.parse(e.data)
        } catch (e) {
            console.warn(e), console.warn("The message does not seem to be valid JSON.")
        }
        t.removeAttribute("disabled"), "history" === r.type ? r.data.forEach((e => u(e))) : "color" === r.type ? a = r.data : "message" === r.type && u(r.data)
    })), t.addEventListener("keydown", (e => {
        13 === e.keyCode && l(e.target.value)
    })), i.addEventListener("click", (e => {
        l(t.value)
    })), u.odd = !0, n.addEventListener("scroll", (e => {
        s = !1;
        const t = e.target;
        t.scrollTop === t.scrollHeight - t.clientHeight && (s = !0)
    }))
}



class registerSW {
    static go() {
        if ("serviceWorker" in navigator) try {
            navigator.serviceWorker.register("/serviceworker.js")
        } catch (e) {
            console.log("SW registration failed")
        }
    }
}

class registerMain {
    static go() {
        Particles.init({selector: ".background"}), Particles.init({
            selector: ".background",
            color: ["#03dac6", "#ff0266", "#000000"],
            connectParticles: !0,
            responsive: [{
                breakpoint: 768,
                options: {color: ["#faebd7", "#03dac6", "#ff0266"], maxParticles: 43, connectParticles: !1}
            }]
        })
    }
}

class NavigationPage {
    constructor() {
        this.currentId = null, this.currentTab = null, this.tabContainerHeight = 70, this.lastScroll = 0;
        let e = this;
        $(".nav-tab").click((function () {
            e.onTabClick(event, $(this))
        })), $(window).scroll((() => {
            this.onScroll()
        })), $(window).resize((() => {
            this.onResize()
        }))
    }

    onTabClick(e, t) {
        e.preventDefault();
        let r = $(t.attr("href")).offset().top - this.tabContainerHeight + 1;
        $("html, body").animate({scrollTop: r}, 600)
    }

    onScroll() {
        this.checkHeaderPosition(), this.findCurrentTabSelector(), this.lastScroll = $(window).scrollTop()
    }

    onResize() {
        this.currentId && this.setSliderCss()
    }

    checkHeaderPosition() {
        $(window).scrollTop() > 75 ? $(".header").addClass("header--scrolled") : $(".header").removeClass("header--scrolled");
        let e = $(".nav").offset().top + $(".nav").height() - this.tabContainerHeight - 75;
        $(window).scrollTop() > this.lastScroll && $(window).scrollTop() > e ? ($(".header").addClass("et-header--move-up"), $(".nav-container").removeClass("nav-container--top-first"), $(".nav-container").addClass("nav-container--top-second")) : $(window).scrollTop() < this.lastScroll && $(window).scrollTop() > e ? ($(".header").removeClass("et-header--move-up"), $(".et-hero-tabs-container").addClass("et-hero-tabs-container--top-first")) : ($(".header").removeClass("header--move-up"), $(".nav-container").removeClass("nav-container--top-first"), $(".nav-container").removeClass("nav-container--top-second"))
    }

    findCurrentTabSelector(e) {
        let t, r, n = this;
        $(".nav-tab").each((function () {
            let e = $(this).attr("href"), i = $(e).offset().top - n.tabContainerHeight,
                o = $(e).offset().top + $(e).height() - n.tabContainerHeight;
            $(window).scrollTop() > i && $(window).scrollTop() < o && (t = e, r = $(this))
        })), this.currentId == t && null !== this.currentId || (this.currentId = t, this.currentTab = r, this.setSliderCss())
    }

    setSliderCss() {
        let e = 0, t = 0;
        this.currentTab && (e = this.currentTab.css("width"), t = this.currentTab.offset().left), $(".nav-tab-slider").css("width", e), $(".nav-tab-slider").css("left", t)
    }
}

!function (e, t) {
    "use strict";

    function r(t) {
        var r = t.target ? t.target : t.toElement;
        if ("notifi-wrapper" !== r.getAttribute("id")) {
            for (var n = !1; !a(r, "notifi-notification");) a(r, "notifi-close") && (n = !0), a(r, "btn-close-notification") && (n = !0), r = r.parentElement;
            var i = r.getAttribute("id");
            if (i = /notifi-notification-([a-zA-Z0-9]+)/.exec(i)[1], n && c.notifications[i].options.dismissable) c.removeNotification(i); else {
                var o = c.notifications[i].action;
                if (null == o) return;
                "string" == typeof o ? e.location = o : "function" == typeof o ? o(i) : (console.log("Notifi Error: Invalid click action:"), console.log(o))
            }
        }
    }

    function n(e) {
        if (void 0 === c.notifications[e] && (c.notifications[e] = {}), null === c.notifications[e].element || void 0 === c.notifications[e].element) {
            var r = d.cloneNode(!0);
            o(r, "notifi-notification"), r.setAttribute("id", "notifi-notification-" + e), c.notifications[e].element = r
        }
        if (null === c.notifications[e].element.parentElement) {
            var n = t.getElementById("notifi-wrapper");
            t.body.clientWidth > 480 ? n.appendChild(c.notifications[e].element) : n.insertBefore(c.notifications[e].element, n.firstChild)
        }
    }

    function i(e, t) {
        var r, n = {};
        for (r in e) n[r] = e[r];
        for (r in t) n[r] = t[r];
        return n
    }

    function o(e, t) {
        a(e, t) || (e.className += " " + t)
    }

    function a(e, t) {
        var r = new RegExp("(?:^|\\s)" + t + "(?!\\S)", "g");
        return null !== e.className.match(r)
    }

    function s(e, t) {
        var r = new RegExp("(?:^|\\s)" + t + "(?!\\S)", "g");
        e.className = e.className.replace(r, "")
    }

    function l() {
        return "ontouchstart" in e || "onmsgesturechange" in e
    }

    function u() {
        var e = t.createElement("div");
        e.setAttribute("id", "notifi-wrapper"), e.addEventListener("click", r), t.body.appendChild(e), c.setNotificationHTML('<div class="notifi-notification"><div class="notifi-icon"></div><h3 class="notifi-title"></h3><p class="notifi-text"></p><p class="notifi-button"></p><div class="notifi-close"><i class="fa fa-times"></i></div></div>')
    }

    var c = c || {};
    c = {
        count: 0,
        notifications: {},
        defaultOptions: {
            color: "default",
            title: "",
            text: "",
            icon: "",
            timeout: 5e3,
            action: null,
            button: null,
            dismissable: !0
        },
        setDefaultOptions: function (e) {
            c.defaultOptions = i(c.defaultOptions, e)
        },
        setNotificationHTML: function (e) {
            var r = t.createElement("div");
            r.innerHTML = e;
            var n = r.firstChild;
            r.removeChild(n), d = n
        },
        addNotification: function (e) {
            c.count += 1;
            var t = function () {
                var e = "", t = "abcdefghijklmnopqrstuvwxyz0123456789";
                do {
                    e = "";
                    for (var r = 0; 5 > r; r++) e += t.charAt(Math.floor(Math.random() * t.length))
                } while (c.exists(e));
                return e
            }();
            return n(t), c.editNotification(t, e), t
        },
        editNotification: function (e, t) {
            null !== c.notifications[e].removeTimer && (clearTimeout(c.notifications[e].removeTimer), c.notifications[e].removeTimer = null), n(e), t = t || {}, void 0 === c.notifications[e].options && (c.notifications[e].options = c.defaultOptions), t = i(c.notifications[e].options, t);
            var r = c.notifications[e].element;
            o(r, t.color);
            var a = r.getElementsByClassName("notifi-title")[0];
            t.title ? (a.textContent = t.title, s(r, "notifi-no-title")) : (a.textContent = "", o(r, "notifi-no-title"));
            var u = r.getElementsByClassName("notifi-text")[0];
            t.text ? (u.textContent = t.text, s(r, "notifi-no-text")) : (u.textContent = "", o(r, "notifi-no-text"));
            var d = r.getElementsByClassName("notifi-icon")[0];
            t.icon ? (d.innerHTML = t.icon, s(r, "notifi-no-icon")) : (d.innerHTML = "", o(r, "notifi-no-icon")), null !== t.timer && clearTimeout(c.notifications[e].timer);
            var f = null;
            null !== t.timeout && (f = setTimeout((function () {
                c.removeNotification(e)
            }), t.timeout)), c.notifications[e].timer = f, c.notifications[e].action = t.action;
            var h = r.getElementsByClassName("notifi-button")[0];
            t.button ? h.innerHTML = t.button : h.innerHTML = "", t.dismissable ? s(r, "not-dismissable") : o(r, "not-dismissable"), setTimeout((function () {
                o(r, "notifi-in"), r.removeAttribute("style")
            }), 0), l() && o(r, "no-hover"), c.notifications[e].options = t
        },
        reOpenNotification: function (e) {
            c.editNotification(e)
        },
        removeNotification: function (e) {
            if (c.isDismissed(e)) return !1;
            var r = c.notifications[e].element;
            return s(r, "notifi-in"), t.body.clientWidth > 480 ? r.style.marginBottom = -r.offsetHeight + "px" : r.style.marginTop = -r.offsetHeight + "px", c.notifications[e].removeTimer = setTimeout((function () {
                r.parentElement.removeChild(r)
            }), 500), clearTimeout(c.notifications[e].timer), !0
        },
        isDismissed: function (e) {
            return !c.exists(e) || null === c.notifications[e].element.parentElement
        },
        exists: function (e) {
            return void 0 !== c.notifications[e]
        },
        setTitle: function (e, t) {
            c.editNotification(e, {title: t})
        },
        setText: function (e, t) {
            c.editNotification(e, {text: t})
        },
        setIcon: function (e, t) {
            c.editNotification(e, {icon: t})
        },
        setTimeout: function (e, t) {
            c.editNotification(e, {timeout: t})
        }
    };
    var d = null;
    "complete" === t.readyState || "interactive" === t.readyState && t.body ? u() : t.addEventListener ? t.addEventListener("DOMContentLoaded", (function () {
        t.removeEventListener("DOMContentLoaded", null, !1), u()
    }), !1) : t.attachEvent && t.attachEvent("onreadystatechange", (function () {
        "complete" === t.readyState && (t.detachEvent("onreadystatechange", null), u())
    })), e.Notifi = c
}(window, document);

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
        binary_circle.canvas = document.querySelector("canvas"), binary_circle.ctx = binary_circle.canvas.getContext("2d"), binary_circle.letters = "010110", binary_circle.height = binary_circle.canvas.height = _window.innerHeight, binary_circle.width = binary_circle.canvas.width = _window.innerWidth, binary_circle.font_size = 10, binary_circle.columns = binary_circle.width / binary_circle.font_size, binary_circle.drops = [], binary_circle.frame = 1, binary_circle.letters = binary_circle.letters.split("");
        for (let e = 0; e < binary_circle.columns; e++) binary_circle.drops[e] = 1;
        binary_circle.clear(), binary_circle.height = binary_circle.canvas.height = _window.innerHeight, binary_circle.width = binary_circle.canvas.width = _window.innerWidth
    }

    static clear() {
        binary_circle.ctx.fillStyle = "rgba(0, 0, 0,0.1)", binary_circle.ctx.fillRect(0, 0, binary_circle.width, binary_circle.height)
    }

    static draw() {
        1 == binary_circle.frame ? (binary_circle.clear(), binary_circle.showLetters()) : 2 == binary_circle.frame && (binary_circle.frame = 0), binary_circle.frame++, _window.requestAnimationFrame(binary_circle.draw)
    }

    static showLetters() {
        binary_circle.ctx.fillStyle = "#fff", binary_circle.ctx.font = binary_circle.font_size + "px Gotham";
        for (let e = 0; e < binary_circle.drops.length; e++) {
            let t = binary_circle.letters[Math.floor(Math.random() * binary_circle.letters.length)],
                r = binary_circle.drops[e] * binary_circle.font_size;
            binary_circle.ctx.fillText(t, e * binary_circle.font_size, binary_circle.textPosY), r > binary_circle.height && Math.random() > .956 && (binary_circle.drops[e] = 0), binary_circle.drops[e]++
        }
    }
}



// Resets game variables and layouts but does not start the game (game starts on keypress)
    function resetGame() {
        // Reset game progress
        phase = "waiting";
        lastTimestamp = undefined;
        sceneOffset = 0;
        score = 0;

        introductionElement.style.opacity = 1;
        perfectElement.style.opacity = 0;
        restartButton.style.display = "none";
        scoreElement.innerText = score;

        // The first platform is always the same
        // x + w has to match paddingX
        platforms = [{ x: 50, w: 50 }];
        generatePlatform();
        generatePlatform();
        generatePlatform();
        generatePlatform();

        sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];

        trees = [];
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();
        generateTree();

        heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
        heroY = 0;

        drawZ();
    }

    function generateTree() {
        const minimumGap = 30;
        const maximumGap = 150;

        // X coordinate of the right edge of the furthest tree
        const lastTree = trees[trees.length - 1];
        let furthestX = lastTree ? lastTree.x : 0;

        const x =
            furthestX +
            minimumGap +
            Math.floor(Math.random() * (maximumGap - minimumGap));

        const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
        const color = treeColors[Math.floor(Math.random() * 3)];

        trees.push({ x, color });
    }

    function generatePlatform() {
        const minimumGap = 40;
        const maximumGap = 200;
        const minimumWidth = 20;
        const maximumWidth = 100;

        // X coordinate of the right edge of the furthest platform
        const lastPlatform = platforms[platforms.length - 1];
        let furthestX = lastPlatform.x + lastPlatform.w;

        const x =
            furthestX +
            minimumGap +
            Math.floor(Math.random() * (maximumGap - minimumGap));
        const w =
            minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

        platforms.push({ x, w });
    }

// The main game loop
    function animate(timestamp) {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
            _window.requestAnimationFrame(animate);
            return;
        }

        switch (phase) {
            case "waiting":
                return; // Stop the loop
            case "stretching": {
                sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
                break;
            }
            case "turning": {
                sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

                if (sticks.last().rotation > 90) {
                    sticks.last().rotation = 90;

                    const [nextPlatform, perfectHit] = thePlatformTheStickHits();
                    if (nextPlatform) {
                        // Increase score
                        score += perfectHit ? 2 : 1;
                        scoreElement.innerText = score;

                        if (perfectHit) {
                            perfectElement.style.opacity = 1;
                            setTimeout(() => (perfectElement.style.opacity = 0), 1000);
                        }

                        generatePlatform();
                        generateTree();
                        generateTree();
                    }

                    phase = "walking";
                }
                break;
            }
            case "walking": {
                heroX += (timestamp - lastTimestamp) / walkingSpeed;

                const [nextPlatform] = thePlatformTheStickHits();
                if (nextPlatform) {
                    // If hero will reach another platform then limit it's position at it's edge
                    const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
                    if (heroX > maxHeroX) {
                        heroX = maxHeroX;
                        phase = "transitioning";
                    }
                } else {
                    // If hero won't reach another platform then limit it's position at the end of the pole
                    const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
                    if (heroX > maxHeroX) {
                        heroX = maxHeroX;
                        phase = "falling";
                    }
                }
                break;
            }
            case "transitioning": {
                sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

                const [nextPlatform] = thePlatformTheStickHits();
                if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
                    // Add the next step
                    sticks.push({
                        x: nextPlatform.x + nextPlatform.w,
                        length: 0,
                        rotation: 0
                    });
                    phase = "waiting";
                }
                break;
            }
            case "falling": {
                if (sticks.last().rotation < 180)
                    sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

                heroY += (timestamp - lastTimestamp) / fallingSpeed;
                const maxHeroY =
                    platformHeight + 100 + (_window.innerHeight - canvasHeight) / 2;
                if (heroY > maxHeroY) {
                    restartButton.style.display = "block";
                    return;
                }
                break;
            }
            default:
                throw Error("Wrong phase");
        }

        drawZ();
        _window.requestAnimationFrame(animate);

        lastTimestamp = timestamp;
    }

// Returns the platform the stick hit (if it didn't hit any stick then return undefined)
    function thePlatformTheStickHits() {
        if (sticks.last().rotation != 90)
            throw Error(`Stick is ${sticks.last().rotation}°`);
        const stickFarX = sticks.last().x + sticks.last().length;

        const platformTheStickHits = platforms.find(
            (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
        );

        // If the stick hits the perfect area
        if (
            platformTheStickHits &&
            platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 <
            stickFarX &&
            stickFarX <
            platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2
        )
            return [platformTheStickHits, true];

        return [platformTheStickHits, false];
    }

    function drawZ() {
        ctx.save();
        ctx.clearRect(0, 0, _window.innerWidth, _window.innerHeight);

        drawBackground();

        // Center main canvas area to the middle of the screen
        ctx.translate(
            (_window.innerWidth - canvasWidth) / 2 - sceneOffset,
            (_window.innerHeight - canvasHeight) / 2
        );

        // Draw scene
        drawPlatforms();
        drawHero();
        drawSticks();

        // Restore transformation
        ctx.restore();
    }

    function drawPlatforms() {
        platforms.forEach(({ x, w }) => {
            // Draw platform
            ctx.fillStyle = "black";
            ctx.fillRect(
                x,
                canvasHeight - platformHeight,
                w,
                platformHeight + (_window.innerHeight - canvasHeight) / 2
            );

            // Draw perfect area only if hero did not yet reach the platform
            if (sticks.last().x < x) {
                ctx.fillStyle = "red";
                ctx.fillRect(
                    x + w / 2 - perfectAreaSize / 2,
                    canvasHeight - platformHeight,
                    perfectAreaSize,
                    perfectAreaSize
                );
            }
        });
    }

    function drawHero() {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(
            heroX - heroWidth / 2,
            heroY + canvasHeight - platformHeight - heroHeight / 2
        );

        // Body
        drawRoundedRect(
            -heroWidth / 2,
            -heroHeight / 2,
            heroWidth,
            heroHeight - 4,
            5
        );

        // Legs
        const legDistance = 5;
        ctx.beginPath();
        ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
        ctx.fill();

        // Band
        ctx.fillStyle = "red";
        ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
        ctx.beginPath();
        ctx.moveTo(-9, -14.5);
        ctx.lineTo(-17, -18.5);
        ctx.lineTo(-14, -8.5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-10, -10.5);
        ctx.lineTo(-15, -3.5);
        ctx.lineTo(-5, -7);
        ctx.fill();

        ctx.restore();
    }

    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();
    }

    function drawSticks() {
        sticks.forEach((stick) => {
            ctx.save();

            // Move the anchor point to the start of the stick and rotate
            ctx.translate(stick.x, canvasHeight - platformHeight);
            ctx.rotate((Math.PI / 180) * stick.rotation);

            // Draw stick
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -stick.length);
            ctx.stroke();

            // Restore transformations
            ctx.restore();
        });
    }

    function drawBackground() {
        // Draw sky
        var gradient = ctx.createLinearGradient(0, 0, 0, _window.innerHeight);
        gradient.addColorStop(0, "#BBD691");
        gradient.addColorStop(1, "#FEF1E1");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, _window.innerWidth, _window.innerHeight);

        // Draw hills
        drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629");
        drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C");

        // Draw trees
        trees.forEach((tree) => drawTree(tree.x, tree.color));
    }

// A hill is a shape under a stretched out sinus wave
    function drawHill(baseHeight, amplitude, stretch, color) {
        ctx.beginPath();
        ctx.moveTo(0, _window.innerHeight);
        ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
        for (let i = 0; i < _window.innerWidth; i++) {
            ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
        }
        ctx.lineTo(_window.innerWidth, _window.innerHeight);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawTree(x, color) {
        ctx.save();
        ctx.translate(
            (-sceneOffset * backgroundSpeedMultiplier + x) * hill1Stretch,
            getTreeY(x, hill1BaseHeight, hill1Amplitude)
        );

        const treeTrunkHeight = 5;
        const treeTrunkWidth = 2;
        const treeCrownHeight = 25;
        const treeCrownWidth = 10;

        // Draw trunk
        ctx.fillStyle = "#7D833C";
        ctx.fillRect(
            -treeTrunkWidth / 2,
            -treeTrunkHeight,
            treeTrunkWidth,
            treeTrunkHeight
        );

        // Draw crown
        ctx.beginPath();
        ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
        ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
        ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }

    function getHillY(windowX, baseHeight, amplitude, stretch) {
        const sineBaseY = _window.innerHeight - baseHeight;
        return (
            Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) *
            amplitude +
            sineBaseY
        );
    }

    function getTreeY(x, baseHeight, amplitude) {
        const sineBaseY = _window.innerHeight - baseHeight;
        return Math.sinus(x) * amplitude + sineBaseY;
    }

sssl(["https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js", "https://kendo.cdn.telerik.com/2015.3.1111/js/jquery.min.js","https://kendo.cdn.telerik.com/2015.3.1111/js/kendo.all.min.js", "./js/includes/newNote.js", "./js/includes/newTask.js", "./js/includes/notes.js", "./js/includes/profile.js", "./js/includes/signIn.js", "./js/includes/signOut.js", "./js/includes/viewNote.js", "./js/includes/viewTask.js"], (function () {


    $("form :input[required='required']").blur((function () {
        $(this).val() ? $(this).hasClass("hasError") && $(this).removeClass("hasError") : $(this).addClass("hasError")
    })), $("form :input[required='required']").change((function () {
        $(this).hasClass("hasError") && $(this).removeClass("hasError")
    })), $(".autosize").length > 0 && $(".autosize").each((function () {
        resizeTextArea($(this))
    }));


    var signoutNotification = null;


    $("#signout").click((function (e) {
        e.preventDefault(), Notifi.isDismissed(signoutNotification) && (signoutNotification = Notifi.addNotification({
            color: "default",
            title: accountSignOutTitle,
            text: accountSignOutText,
            icon: '<i class="fa fa-sign-out fa-lg"></i>',
            button: '<a href="index.php?action=signout" class="btn btn-success btn-notifi">' + yesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-notifi btn-close-notification">' + cancelOption + "</span>",
            timeout: null
        }))
    }));

    $(function() {
        $("#scheduler").kendoScheduler({
            date: new Date(),
            startTime: new Date(),
            height: 600,
            views: [
                "day",
                { type: "workWeek", selected: true },
                "week",
                "month",
                "agenda",
                { type: "timeline", eventHeight: 50}
            ],
            timezone: "Etc/UTC",
            dataSource: {
                batch: true,
                transport: {
                    read: {
                        url: "//demos.telerik.com/kendo-ui/service/tasks",
                        dataType: "jsonp"
                    },
                    update: {
                        url: "//demos.telerik.com/kendo-ui/service/tasks/update",
                        dataType: "jsonp"
                    },
                    create: {
                        url: "//demos.telerik.com/kendo-ui/service/tasks/create",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: "//demos.telerik.com/kendo-ui/service/tasks/destroy",
                        dataType: "jsonp"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read" && options.models) {
                            return {models: kendo.stringify(options.models)};
                        }
                    }
                },
                schema: {
                    model: {
                        id: "taskId",
                        fields: {
                            taskId: { from: "TaskID", type: "number" },
                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                            start: { type: "date", from: "Start" },
                            end: { type: "date", from: "End" },
                            startTimezone: { from: "StartTimezone" },
                            endTimezone: { from: "EndTimezone" },
                            description: { from: "Description" },
                            recurrenceId: { from: "RecurrenceID" },
                            recurrenceRule: { from: "RecurrenceRule" },
                            recurrenceException: { from: "RecurrenceException" },
                            ownerId: { from: "OwnerID", defaultValue: 1 },
                            isAllDay: { type: "boolean", from: "IsAllDay" }
                        }
                    }
                }
            },
            resources: [
                {
                    field: "ownerId",
                    title: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "#f8a398" },
                        { text: "Bob", value: 2, color: "#51a0ed" },
                        { text: "Charlie", value: 3, color: "#56ca85" }
                    ]
                }
            ]
        });


        new resetStar;


        var events = [{type: "regionEntrance", userId: "Bob Saget", regionId: "cid10_chi_lobby"}, {
            type: "regionEntrance",
            userId: "Bob Saget",
            regionId: "cid10_chi_lobby"
        }, {type: "regionExit", userId: "Bob Saget", regionId: "cid10_chi_lobby"}, {
            type: "regionEntrance",
            userId: "Jeff",
            regionId: "cid10_chi_conf_2"
        }, {type: "regionExit", userId: "Jeff", regionId: "cid10_chi_conf_2"}, {
            type: "regionEntrance",
            userId: "Paul",
            regionId: "cid10_chi_lobby"
        }, {type: "regionExit", userId: "Paul", regionId: "cid10_chi_lobby"}, {
            type: "regionEntrance",
            userId: "Paul",
            regionId: "cid10_chi_conf_2"
        }, {type: "regionEntrance", userId: "DenverCoder9", regionId: "cid10_chi_lobby"}, {
            type: "regionEntrance",
            userId: "Trogdor",
            regionId: "cid10_chi_lobby"
        }, {type: "coffeeBrewed", when: "9:37am"}, {type: "coffeeDepleted", when: "10:15am"}, {
            type: "coffeeBrewed",
            when: "10:30am"
        }], dispatchEvent = function () {
            var e = events[Math.floor(Math.random() * (events.length - 1)) + 1];
            dashboard.$app.trigger("dashboard.messageReceived", e)
        };
        _window.dashboard = {
            $app: $("#app"), dispatcher: setInterval(dispatchEvent, 5e3), endDemo: function () {
                return clearInterval(this.dispatcher)
            }
        }, dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
            console.log(t)
        })), $("#welcome").click(dispatchEvent), dashboard.$app.find(".welcome-component").each((function (e, t) {
            var r = $(t), n = r.data("region"), i = r.data("message-welcome"), o = r.data("message-farewell"), a = [], s = [],
                l = function (e) {
                    return $("<h2></h2>").text(e)
                }, u = function (e) {
                    return s.some((function (t) {
                        return e === t
                    }))
                }, c = function () {
                    a.shift().remove()
                };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (t.regionId !== n) return !0;
                if ("regionEntrance" !== t.type && "regionExit" !== t.type) return !0;
                var d, f = !1, h = t.userId, p = t.type,
                    m = "regionEntrance" === p ? i.replace("{$user}", h) : o.replace("{$user}", h);
                u(h) || "regionEntrance" !== p ? u(h) && "regionExit" === p && (d = l(m), s.splice(s.indexOf(h), 1), function (e) {
                    r.find("h2").each((function (t, r) {
                        var n = $(r);
                        n.data("user") === e && (console.log("activeMessages before", a.length), a.splice(a.indexOf(n), 1), n.remove(), console.log("activeMessages after", a.length))
                    }))
                }(h), f = !0) : (d = l(m).data("user", h), s.push(h), f = !0), f && (r.append(d), a.push(d), setTimeout(c, 7275))
            }))
        })), dashboard.$app.find(".connected-users").each((function (e, t) {
            var r = $(t), n = r.data("region"), i = r.data("message"), o = [], a = function () {
                var e = 1 === o.length ? i.replace("users", "user") : i;
                r.find("h3").text(e.replace("{$num}", o.length))
            };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (t.regionId !== n) return !0;
                if ("regionEntrance" === t.type && -1 === o.indexOf(t.userId) && (o.push(t.userId), a()), "regionExit" === t.type) {
                    var r = o.indexOf(t.userId);
                    -1 !== r && (o.splice(r, 1), a())
                }
                return !0
            }))
        })), dashboard.$app.find(".coffee-brewed").each((function (e, t) {
            var r = $(t), n = r.data("state"), i = r.data("message-brewed"), o = r.data("message-depleted");
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if ("coffeeBrewed" !== t.type && "coffeeDepleted" !== t.type) return !0;
                if ("coffeeDepleted" === t.type && n === t.type) return !0;
                var a = "coffeeBrewed" === t.type ? i.replace("{$time}", t.when) : o.replace("{$time}", t.when);
                return r.data("state", t.type), r.html(a), !0
            }))
        })), dashboard.$app.find(".conference-rooms").each((function (e, t) {
            var r = $(t), n = r.data("message"), i = r.data("empty-verbiage"), o = r.data("full-verbiage"), a = {};
            r.find("h3").each((function (e, t) {
                a[t.id] = {id: t.id, $el: $(t), name: $(t).data("room-name"), users: []}
            }));
            var s = function (e) {
                var t = a[e], r = n.replace("{$room}", t.name),
                    s = t.users.length > 0 ? r.replace("{$status}", o) : r.replace("{$status}", i);
                t.$el.html(s)
            };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (!function (e) {
                    return ("regionEntrance" === e.type || "regionExit" === e.type) && a.hasOwnProperty(e.regionId)
                }(t)) return !0;
                var r = a[t.regionId], n = r.users.some((function (e) {
                    return t.userId === e
                }));
                "regionEntrance" === t.type ? n || (r.users.push(t.userId), s(r.id)) : "regionExit" === t.type && n && (r.users.splice(r.users.indexOf(t.userId), 1), s(r.id))
            }))
        }));

    });


    function app() {
        return {
          showSettingsPage: false,
          openModal: false,
          username: '',
          bannerImage: '',
          colors: [{
              label: '#3182ce',
              value: 'blue'
            },
            {
              label: '#38a169',
              value: 'green'
            },
            {
              label: '#805ad5',
              value: 'purple'
            },
            {
              label: '#e53e3e',
              value: 'red'
            },
            {
              label: '#dd6b20',
              value: 'orange'
            },
            {
              label: '#5a67d8',
              value: 'indigo'
            },
            {
              label: '#319795',
              value: 'teal'
            },
            {
              label: '#718096',
              value: 'gray'
            },
            {
              label: '#d69e2e',
              value: 'yellow'
            }
          ],
          colorSelected: {
            label: '#3182ce',
            value: 'blue'
          },
          dateDisplay: 'toDateString',
          boards: [
            'Todo',
            'In Progress',
            'Review',
            'Done'
          ],
          task: {
            name: '',
            boardName: '',
            date: new Date()
          },
          editTask: {},
          tasks: [],
          formatDateDisplay(date) {
            if (this.dateDisplay === 'toDateString') return new Date(date).toDateString();
            if (this.dateDisplay === 'toLocaleDateString') return new Date(date).toLocaleDateString('en-GB');
            return new Date().toLocaleDateString('en-GB');
          },
          showModal(board) {
            this.task.boardName = board;
            this.openModal = true;
            setTimeout(() => this.$refs.taskName.focus(), 200);
          },
          saveEditTask(task) {
            if (task.name == '') return;
            let taskIndex = this.tasks.findIndex(t => t.uuid === task.uuid);
            this.tasks[taskIndex].name = task.name;
            this.tasks[taskIndex].date = new Date();
            this.tasks[taskIndex].edit = false;
            // Get the existing data
            let existing = JSON.parse(localStorage.getItem('TG-tasks'));
            // Add new data to localStorage Array
            existing[taskIndex].name = task.name;
            existing[taskIndex].date = new Date();
            existing[taskIndex].edit = false;
            // Save back to localStorage
            localStorage.setItem('TG-tasks', JSON.stringify(existing));
            this.dispatchCustomEvents('flash', 'Task detail updated');
          },
          getTasks() {
            // Get Default Settings
            const themeFromLocalStorage = JSON.parse(localStorage.getItem('TG-theme'));
            this.dateDisplay = localStorage.getItem('TG-dateDisplay') || 'toLocaleDateString';
            this.username = localStorage.getItem('TG-username') || '';
            this.bannerImage = localStorage.getItem('TG-bannerImage') || '';
            this.colorSelected = themeFromLocalStorage || {
              label: '#3182ce',
              value: 'blue'
            };
            if (localStorage.getItem('TG-tasks')) {
              const tasksFromLocalStorage = JSON.parse(localStorage.getItem('TG-tasks'));
              this.tasks = tasksFromLocalStorage.map(t => {
                return {
                  id: t.id,
                  uuid: t.uuid,
                  name: t.name,
                  status: t.status,
                  boardName: t.boardName,
                  date: t.date,
                  edit: false
                }
              });
            } else {
              this.tasks = [];
            }
          },
          addTask() {
            if (this.task.name == '') return;
            // data to save
            const taskData = {
              uuid: this.generateUUID(),
              name: this.task.name,
              status: 'pending',
              boardName: this.task.boardName,
              date: new Date()
            };
            // Save to localStorage
            this.saveDataToLocalStorage(taskData, 'TG-tasks');
            // Refetch all tasks
            this.getTasks();
            // Show Flash message
            this.dispatchCustomEvents('flash', 'New task added');
            // Reset the form
            this.task.name = '';
            this.task.boardName = '';
            // close the modal
            this.openModal = false;
          },
          saveSettings() {
            // data to save
            const theme = JSON.stringify(this.colorSelected);
            // Save to localStorage
            localStorage.setItem('TG-username', this.username);
            localStorage.setItem('TG-theme', theme);
            localStorage.setItem('TG-bannerImage', this.bannerImage);
            localStorage.setItem('TG-dateDisplay', this.dateDisplay);
            // Show Flash message
            this.dispatchCustomEvents('flash', 'Settings updated');
            // Back to Main Page
            this.showSettingsPage = false;
          },
          onDragStart(event, uuid) {
            event.dataTransfer.setData('text/plain', uuid);
            event.target.classList.add('opacity-5');
          },
          onDragOver(event) {
            event.preventDefault();
            return false;
          },
          onDragEnter(event) {
            event.target.classList.add('bg-gray-200');
          },
          onDragLeave(event) {
            event.target.classList.remove('bg-gray-200');
          },
          onDrop(event, boardName) {
            event.stopPropagation(); // Stops some browsers from redirecting.
            event.preventDefault();
            event.target.classList.remove('bg-gray-200');
            // console.log('Dropped', this);
            const id = event.dataTransfer.getData('text');
            const draggableElement = document.getElementById(id);
            const dropzone = event.target;
            dropzone.appendChild(draggableElement);
            // Update
            // Get the existing data
            let existing = JSON.parse(localStorage.getItem('TG-tasks'));
            let taskIndex = existing.findIndex(t => t.uuid === id);
            // Add new data to localStorage Array
            existing[taskIndex].boardName = boardName;
            existing[taskIndex].date = new Date();
            // Save back to localStorage
            localStorage.setItem('TG-tasks', JSON.stringify(existing));
            // Get Updated Tasks
            this.getTasks();
            // Show flash message
            this.dispatchCustomEvents('flash', 'Task moved to ' + boardName);
            event.dataTransfer.clearData();
          },
          saveDataToLocalStorage(data, keyName) {
            var a = [];
            // Parse the serialized data back into an aray of objects
            a = JSON.parse(localStorage.getItem(keyName)) || [];
            // Push the new data (whether it be an object or anything else) onto the array
            a.push(data);
            // Re-serialize the array back into a string and store it in localStorage
            localStorage.setItem(keyName, JSON.stringify(a));
          },
          generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          },
          dispatchCustomEvents(eventName, message) {
            let customEvent = new CustomEvent(eventName, {
              detail: {
                message: message
              }
            });
            _window.dispatchEvent(customEvent);
          },
          greetText() {
            var d = new Date();
            var time = d.getHours();
            // From: https://1loc.dev/ (Uppercase the first character of each word in a string)
            const uppercaseWords = str => str.split(' ').map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(' ');
            let name = localStorage.getItem('TG-username') || '';
            if (time < 12) {
              return "Good morning, " + uppercaseWords(name);
            } else if (time < 17) {
              return "Good afternoon, " + uppercaseWords(name);
            } else {
              return "Good evening, " + uppercaseWords(name);
            }
          },
        }
      }

}));


const hueBase = 0, hueRange = 360, segmentCount = 200, bubbleCount = 500, segmentLengthBase = 1,
    fadeIn = (e, t) => e / t, fadeOut = (e, t) => (t - e) / t, fadeInOut = (e, t) => {
        let r = .5 * t;
        return abs((e + r) % t - r) / r
    }, angle = (e, t, r, n) => atan2(n - t, r - e);

function creature() {

    let buffer, canvas2, creature, bubbles, center, simplex;
}

class AttributeArray {
    constructor(e, t) {
        this.count = e, this.attrs = t, this.spread = t.length, this.values = new Float32Array(e * this.spread)
    }

    get length() {
        return this.values.length
    }

    set(e, t, r = !1) {
        r && (t *= this.spread), this.values.set(e, t)
    }

    get(e, t = !1) {
        return t && (e *= this.spread), this.values.slice(e, e + this.spread)
    }

    forEach(e) {
        let t = 0, r = 0;
        for (; t < this.length; t += this.spread, r++) e(this.get(t), r, this)
    }

    map(e) {
        let t = 0, r = 0;
        for (; t < this.length; t += this.spread, r++) this.set(e(this.get(t), r, this), t)
    }

    reverseMap(e) {
        let t = this.length - this.spread, r = this.count - 1;
        for (; t >= 0; t -= this.spread, r--) this.set(e(this.get(t), r, this), t)
    }
}
class Bubbles extends AttributeArray {
    constructor(e) {
        super(e, ["x", "y", "vx", "vy", "s", "d", "h", "l", "ttl"]), this.initPoints(), this.repelTarget = null, this.repelThreshold = 200
    }

    setRepelTarget(e = null) {
        this.repelTarget = e
    }

    initPoints() {
        this.map((() => [random(-.25 * windowWidth, 1.25 * windowWidth), random(1.25 * windowHeight), random(-2, 2), random(-4, -1), random(2, 6), random(2, 6), random(180, 240), random(0, 200), random(500, 1e3)]))
    }

    reset() {
        return [random(-.25 * windowWidth, 1.25 * windowWidth), random(1.25 * windowHeight), 0, random(-4, -1), random(2, 6), random(2, 6), random(180, 240), 0, random(500, 1e3)]
    }

    drawParticle(e, t, r, n, i, o) {
        const a = fadeInOut(i, o);
        buffer.stroke(n, 50, 100, .5 * a), buffer.strokeWeight(1 + r * a), buffer.point(e, t)
    }

    update() {
        this.map((([e, t, r, n, i, o, a, s, l]) => {
            const u = simplex.noise3D(.0015 * e, .0015 * t, .0015 * frameCount) * TAU;
            if (r = lerp(r, cos(u) * i, .15), n = lerp(n, (sin(u) + 2) * -i, .15), this.repelTarget && dist(e, t, ...this.repelTarget) < this.repelThreshold) {
                const o = angle(e, t, ...this.repelTarget);
                r = lerp(r, r - cos(o) * i, .275), n = lerp(n, n - sin(o) * i, .275)
            }
            return e = lerp(e, e + r, .125), t = lerp(t, t + n, .125), s++, this.drawParticle(e, t, o, a, s, l), s > l || e > windowWidth + o || e < -o || t < -o ? this.reset() : [e, t, r, n, i, o, a, s, l]
        }))
    }
}

class Chain extends AttributeArray {
    constructor(e, t, r, n, i, o = []) {
        super(r, ["x1", "y1", "x2", "y2", "l", "d", ...o]), this.position = [e, t], this.target = [e, t], this.baseLength = n, this.baseDirection = i
    }

    get segmentNum() {
        return this.count
    }

    setTarget(e) {
        this.target = "function" == typeof e ? e(this.target) : e
    }

    setPosition(e) {
        this.position = "function" == typeof e ? e(this.position) : e
    }

    mapSegments(e, t = "forward") {
        "backward" === t ? this.reverseMap(e) : this.map(e)
    }

    updateSegments(e, t = "forward") {
        let r = this.position;
        this.mapSegments((([t, n, i, o, a, s, ...l], u) => {
            t = r[0], n = r[1];
            const [c, ...d] = e([t, n, i, o, a, s, ...l], u), f = isNaN(c) ? s : c;
            return i = t + a * cos(f), o = n + a * sin(f), r = [i, o], [t, n, i, o, a, f, ...d]
        }), t)
    }
}

class Creature extends Chain {
    constructor() {
        super(center[0], center[1], 200, 1, 0, ["h"]), this.follow = !1, this.initSegments()
    }

    initSegments() {
        let e, t, r, n, i, o, a;
        i = this.baseLength, o = this.baseDirection, this.mapSegments(((s, l) => {
            var u, c;
            return e = r || this.position[0], t = n || this.position[1], r = e - i * cos(o), n = t - i * sin(o), o += .1, i *= 1.01, a = 0 + 360 * (u = l, ((c = this.segmentNum) - u) / c), [e, t, r, n, i, o, a]
        }))
    }

    updateTarget() {
        if (!this.follow) {
            const e = simplex.noise3D(.005 * this.target[0], .005 * this.target[1], .005 * frameCount) * TAU;
            this.setTarget([lerp(this.target[0], this.target[0] + 20 * (cos(e) + cos(.05 * frameCount)), .25), lerp(this.target[1], this.target[1] + 20 * (sin(e) + sin(.05 * frameCount)), .25)])
        }
        (this.position[0] > windowWidth + 500 || this.position[0] < -500 || this.position[1] > windowHeight + 500 || this.position[1] < -500) && this.setTarget([...center])
    }

    update() {
        this.setPosition([lerp(this.position[0], this.target[0], .015), lerp(this.position[1], this.target[1], .015)]), this.updateTarget(), this.updateSegments((([e, t, r, n, i, o, a], s) => {
            let l;
            return l = simplex.noise3D(.005 * e, .005 * t, .005 * (s + frameCount)), o = angle(e, t, r, n) + .075 * l, this.drawSegment(e, t, r, n, a, l, o, s), [o]
        }), "backward")
    }

    drawSegment(e, t, r, n, i, o, a, s) {
        const l = 6 + 30 * fadeIn(s, this.segmentNum), u = 1.35 * l, c = e + u * cos(a + .85 + o),
            d = t + u * sin(a + .85 + o), f = e + u * cos(a - .85 - o), h = t + u * sin(a - .85 - o), p = .35 * l;
        buffer.strokeWeight(1 + 4 * fadeIn(s, this.segmentNum)), buffer.stroke(i, 100, 100, .1), buffer.noFill(), buffer.line(e, t, c, d), buffer.ellipse(c, d, p), buffer.line(e, t, f, h), buffer.ellipse(f, h, p), buffer.line(r, n, e, t), buffer.ellipse(e, t, l)
    }
}

function setup() {
    buffer = createGraphics(windowWidth, windowHeight), buffer.colorMode(HSB), canvas2 = createCanvas(windowWidth, windowHeight), canvas2.mouseOver(mouseOver), canvas2.mouseOut(mouseOut), frameRate(360), simplex = new SimplexNoise, center = [.5 * windowWidth, .5 * windowHeight], creature = new Creature, bubbles = new Bubbles(500)
}

function drawGlow() {
    drawingContext.save(), drawingContext.filter = "blur(6px) brightness(200%)", image(buffer, 0, 0), drawingContext.restore()
}

function drawImage() {
    drawingContext.save(), drawingContext.globalCompositeOperation = "lighter", image(buffer, 0, 0), drawingContext.restore()
}

function draw() {
    buffer.background(220, 70, 2);
    try {
        creature.update(), bubbles.setRepelTarget(creature.position), bubbles.update(), drawGlow(), drawImage()
    } catch (e) {
        console.error(e), noLoop()
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight), buffer.resizeCanvas(windowWidth, windowHeight), center = [.5 * windowWidth, .5 * windowHeight]
}

function mouseMoved() {
    creature.setTarget([mouseX, mouseY])
}

function mouseOut() {
    creature.follow = !1
}

function mouseOver() {
    creature.follow = !0
}

    creature();