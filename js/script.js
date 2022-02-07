// noinspection CommaExpressionJS

setTimeout((() => {
    document.querySelector("html").classList.add("loaded")
}), 3e3);
const _window = window,
    _windowinnerWidth = _window.innerWidth,
    _windowinnerHeight = _window.innerHeight;

function startGame() {

    Array.prototype.last = function () {
        return this[this.length - 1]
    }, Math.sinus = function (e) {
        return Math.sin(e / 180 * Math.PI)
    };
    let e, t, i, n, a = "waiting",
        r = [],
        o = [],
        s = [],
        l = 0;
    const c = 375,
        d = document.getElementById("game");

    d.width = _windowinnerWidth, d.height = _windowinnerHeight;
    const h = d.getContext("2d"),
        u = document.getElementById("introduction"),
        f = document.getElementById("perfect"),
        g = document.getElementById("restart"),
        m = document.getElementById("score");

    function p() {

        a = "waiting", e = void 0, n = 0, l = 0, u.style.opacity = 1, f.style.opacity = 0, g.style.display = "none", m.innerText = l, r = [
            {
                x: 50,
                w: 50
            }], b(), b(), b(), b(), o = [
            {
                x: r[0].x + r[0].w,
                length: 0,
                rotation: 0
            }], s = [], w(), w(), w(), w(), w(), w(), w(), w(), w(), w(), t = r[0].x + r[0].w - 10, i = 0, y()
    }

    function w() {
        const e = s[s.length - 1],
            t = (e ? e.x : 0) + 30 + Math.floor(120 * Math.random()),
            i = ["#6D8821", "#8FAC34", "#98B333"][Math.floor(3 * Math.random())];
        s.push(
            {
                x: t,
                color: i
            })
    }

    function b() {
        const e = r[r.length - 1],
            t = e.x + e.w + 40 + Math.floor(160 * Math.random()),
            i = 20 + Math.floor(80 * Math.random());
        r.push(
            {
                x: t,
                w: i
            })
    }


    function v(r) {
        if (!e) return e = r, void _window.requestAnimationFrame(v);

        switch (a) {
            case "waiting":
                return;
            case "stretching":
                o.last().length += (r - e) / 4;
                break;
            case "turning":
                if (o.last().rotation += (r - e) / 4, o.last().rotation > 90) {
                    o.last().rotation = 90;
                    const [e, t] = x();

                    e && (l += t ? 2 : 1, m.innerText = l, t && (f.style.opacity = 1, setTimeout((() => f.style.opacity = 0), 1e3)), b(), w(), w()), a = "walking"
                }
                break;
            case "walking": {
                t += (r - e) / 4;
                const [i] = x();
                if (i) {
                    const e = i.x + i.w - 10;
                    t > e && (t = e, a = "transitioning")
                } else {
                    const e = o.last().x + o.last().length + 17;
                    t > e && (t = e, a = "falling")
                }
                break
            }
            case "transitioning": {
                n += (r - e) / 2;
                const [t] = x();
                n > t.x + t.w - 100 && (o.push(
                    {
                        x: t.x + t.w,
                        length: 0,
                        rotation: 0
                    }), a = "waiting");
                break
            }
            case "falling": {
                o.last().rotation < 180 && (o.last().rotation += (r - e) / 4), i += (r - e) / 2;
                const t = 200 + (_window.innerHeight - c) / 2;
                if (i > t) return void (g.style.display = "block");
                break
            }
            default:
                throw Error("Wrong phase")
        }
        y(), _window.requestAnimationFrame(v), e = r
    }

    function x() {
        if (90 !== o.last().rotation) throw Error(`Stick is ${o.last().rotation}°`);
        const e = o.last().x + o.last().length,
            t = r.find((t => t.x < e && e < t.x + t.w));
        return t && t.x + t.w / 2 - 5 < e && e < t.x + t.w / 2 + 5 ? [t, !0] : [t, !1]
    }

    function y() {
        var e;
        h.save(), h.clearRect(0, 0, _window.innerWidth, _window.innerHeight), (e = h.createLinearGradient(0, 0, 0, _window.innerHeight)).addColorStop(0, "#BBD691"), e.addColorStop(1, "#FEF1E1"), h.fillStyle = e, h.fillRect(0, 0, _window.innerWidth, _window.innerHeight), T(100, 10, 1, "#95C629"), T(70, 20, .5, "#659F1C"), s.forEach((e => function (e, t) {
            h.save(), h.translate(1 * (.2 * -n + e), function (e, t, i) {
                const n = _window.innerHeight - 100;
                return 10 * Math.sinus(e) + n
            }(e)), h.fillStyle = "#7D833C", h.fillRect(-1, -5, 2, 5), h.beginPath(), h.moveTo(-5, -5), h.lineTo(0, -30), h.lineTo(5, -5), h.fillStyle = t, h.fill(), h.restore()
        }(e.x, e.color))), h.translate((_window.innerWidth - 375) / 2 - n, (_window.innerHeight - c) / 2), r.forEach(((
            {
                x: e,
                w: t
            }) => {
            h.fillStyle = "black", h.fillRect(e, 275, t, 100 + (_window.innerHeight - c) / 2), o.last().x < e && (h.fillStyle = "red", h.fillRect(e + t / 2 - 5, 275, 10, 10))
        })),
            function () {
                var e, n;
                h.save(), h.fillStyle = "black", h.translate(t - 8.5, i + c - 100 - 15), e = -8.5, n = -15, h.beginPath(), h.moveTo(e, -10), h.lineTo(e, 6), h.arcTo(e, 11, e + 5, 11, 5), h.lineTo(3.5, 11), h.arcTo(8.5, 11, 8.5, 6, 5), h.lineTo(8.5, -10), h.arcTo(8.5, n, 3.5, n, 5), h.lineTo(e + 5, n), h.arcTo(e, n, e, -10, 5), h.fill(), h.beginPath(), h.arc(5, 11.5, 3, 0, 2 * Math.PI, !1), h.fill(), h.beginPath(), h.arc(-5, 11.5, 3, 0, 2 * Math.PI, !1), h.fill(), h.beginPath(), h.fillStyle = "white", h.arc(5, -7, 3, 0, 2 * Math.PI, !1), h.fill(), h.fillStyle = "red", h.fillRect(-9.5, -12, 19, 4.5), h.beginPath(), h.moveTo(-9, -14.5), h.lineTo(-17, -18.5), h.lineTo(-14, -8.5), h.fill(), h.beginPath(), h.moveTo(-10, -10.5), h.lineTo(-15, -3.5), h.lineTo(-5, -7), h.fill(), h.restore()
            }(), o.forEach((e => {
            h.save(), h.translate(e.x, 275), h.rotate(Math.PI / 180 * e.rotation), h.beginPath(), h.lineWidth = 2, h.moveTo(0, 0), h.lineTo(0, -e.length), h.stroke(), h.restore()
        })), h.restore()
    }

    function T(e, t, i, n) {
        h.beginPath(), h.moveTo(0, _window.innerHeight), h.lineTo(0, S(0, e, t, i));
        for (let n = 0; n < _window.innerWidth; n++) h.lineTo(n, S(n, e, t, i));
        h.lineTo(_window.innerWidth, _window.innerHeight), h.fillStyle = n, h.fill()
    }

    function S(e, t, i, a) {
        const r = _window.innerHeight - t;
        return Math.sinus((.2 * n + e) * a) * i + r
    }

    p(), p(), _window.addEventListener("mousedown", (function (t) {
        "waiting" === a && (e = void 0, u.style.opacity = 0, a = "stretching", _window.requestAnimationFrame(v))
    })), _window.addEventListener("mouseup", (function (e) {
        "stretching" === a && (a = "turning")
    })), _window.addEventListener("resize", (function (e) {
        d.width = _windowinnerWidth, d.height = _windowinnerHeight, y()
    })), _window.requestAnimationFrame(v), g.addEventListener("click", (function (e) {
        e.preventDefault(), p(), g.style.display = "none"
    }))
}

function timeString(e) {
    const t = new Date(e),
        i = t.getHours() % 12;
    let n = t.getMinutes();
    return n = n < 10 ? `0${n}` : n, `${i}:${n}`
}

!function () {
    var e = document.getElementsByTagName("script")[0],
        t = e.parentNode,
        i = /ed|co/,
        n = function (n, a) {
            var r = document.createElement("script");
            r.onload = r.onreadystatechange = function () {
                this.readyState && !i.test(this.readyState) || (r.onload = r.onreadystatechange = null, a && a(r), r = null)
            }, r.async = !0, r.src = n, t.insertBefore(r, e)
        };
    _window.sssl = function (e, t) {
        if ("string" == typeof e) n(e, t);
        else {
            var i = e.shift();
            n(i, (function () {
                e.length ? _window.sssl(e, t) : t && t()
            }))
        }
    }
}(), _window.addEventListener("load", (e => {
    setTimeout((() => {
        document.querySelector("html").classList.add("loaded")
    }), 1e3)
}));
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
    $("html").addClass("login"), StarWars(), setTimeout(startChat, 1e4), setTimeout(startGame, 15e3)
}

function startChat() {
    var e = new WebSocket("wss://stream-chat-demo.herokuapp.com");
    const t = document.querySelector("#input"),
        i = document.querySelector("#messages"),
        n = document.querySelector(".overflow"),
        a = (document.querySelector("#name-input"), document.querySelector("#send"));
    let r, o, s = !0;

    function l(i) {
        i && (t.setAttribute("disabled", !0), t.value = "", e.send(i), r || (r = i, a.innerHTML = "Chat"))
    }

    function c(e) {
        const t = document.createElement("div"),
            n = timeString(e.timestamp),
            a = c.odd ? "odd" : "even";
        c.odd = !c.odd, t.setAttribute("class", `${a} message`), t.innerHTML = `\n  <span class='timestamp'>${n}</span>\n  <span class='name' style='color: ${e.color}'>${e.author}:</span>\n  <span class='text'>${e.text}</span>\n`, i.prepend(t)
    }

    e.addEventListener("open", (e => {
    })), e.addEventListener("message", (e => {
        let i;
        try {
            i = JSON.parse(e.data)
        } catch (e) {
            console.warn(e), console.warn("The message does not seem to be valid JSON.")
        }
        t.removeAttribute("disabled"), "history" === i.type ? i.data.forEach((e => c(e))) : "color" === i.type ? o = i.data : "message" === i.type && c(i.data)
    })), t.addEventListener("keydown", (e => {
        13 === e.keyCode && l(e.target.value)
    })), a.addEventListener("click", (e => {
        l(t.value)
    })), c.odd = !0, n.addEventListener("scroll", (e => {
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
        Particles.init(
            {
                selector: ".background"
            }), Particles.init(
            {
                selector: ".background",
                color: ["#03dac6", "#ff0266", "#000000"],
                connectParticles: !0,
                responsive: [
                    {
                        breakpoint: 768,
                        options:
                            {
                                color: ["#faebd7", "#03dac6", "#ff0266"],
                                maxParticles: 43,
                                connectParticles: !1
                            }
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
        let i = $(t.attr("href")).offset().top - this.tabContainerHeight + 1;
        $("html, body").animate(
            {
                scrollTop: i
            }, 600)
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
        let t, i, n = this;
        $(".nav-tab").each((function () {
            let e = $(this).attr("href"),
                a = $(e).offset().top - n.tabContainerHeight,
                r = $(e).offset().top + $(e).height() - n.tabContainerHeight;
            $(window).scrollTop() > a && $(window).scrollTop() < r && (t = e, i = $(this))
        })), this.currentId == t && null !== this.currentId || (this.currentId = t, this.currentTab = i, this.setSliderCss())
    }

    setSliderCss() {
        let e = 0,
            t = 0;
        this.currentTab && (e = this.currentTab.css("width"), t = this.currentTab.offset().left), $(".nav-tab-slider").css("width", e), $(".nav-tab-slider").css("left", t)
    }
}

!function (e, t) {
    "use strict";

    function i(t) {
        var i = t.target ? t.target : t.toElement;
        if ("notifi-wrapper" !== i.getAttribute("id")) {
            for (var n = !1; !o(i, "notifi-notification");) o(i, "notifi-close") && (n = !0), o(i, "btn-close-notification") && (n = !0), i = i.parentElement;
            var a = i.getAttribute("id");
            if (a = /notifi-notification-([a-zA-Z0-9]+)/.exec(a)[1], n && d.notifications[a].options.dismissable) d.removeNotification(a);
            else {
                var r = d.notifications[a].action;
                if (null == r) return;
                "string" == typeof r ? e.location = r : "function" == typeof r ? r(a) : (console.log("Notifi Error: Invalid click action:"), console.log(r))
            }
        }
    }

    function n(e) {
        if (void 0 === d.notifications[e] && (d.notifications[e] = {}), null === d.notifications[e].element || void 0 === d.notifications[e].element) {
            var i = h.cloneNode(!0);
            r(i, "notifi-notification"), i.setAttribute("id", "notifi-notification-" + e), d.notifications[e].element = i
        }
        if (null === d.notifications[e].element.parentElement) {
            var n = t.getElementById("notifi-wrapper");
            t.body.clientWidth > 480 ? n.appendChild(d.notifications[e].element) : n.insertBefore(d.notifications[e].element, n.firstChild)
        }
    }

    function a(e, t) {
        var i, n = {};
        for (i in e) n[i] = e[i];
        for (i in t) n[i] = t[i];
        return n
    }

    function r(e, t) {
        o(e, t) || (e.className += " " + t)
    }

    function o(e, t) {
        var i = new RegExp("(?:^|\\s)" + t + "(?!\\S)", "g");
        return null !== e.className.match(i)
    }

    function s(e, t) {
        var i = new RegExp("(?:^|\\s)" + t + "(?!\\S)", "g");
        e.className = e.className.replace(i, "")
    }

    function l() {
        return "ontouchstart" in e || "onmsgesturechange" in e
    }

    function c() {
        var e = t.createElement("div");
        e.setAttribute("id", "notifi-wrapper"), e.addEventListener("click", i), t.body.appendChild(e), d.setNotificationHTML('<div class="notifi-notification"><div class="notifi-icon"></div><h3 class="notifi-title"></h3><p class="notifi-text"></p><p class="notifi-button"></p><div class="notifi-close"><i class="fa fa-times"></i></div></div>')
    }

    var d = d ||
        {};
    d = {
        count: 0,
        notifications:
            {},
        defaultOptions:
            {
                color: "default",
                title: "",
                text: "",
                icon: "",
                timeout: 5e3,
                action: null,
                button: null,
                dismissable: !0
            },
        setNotificationHTML: function (e) {
            var i = t.createElement("div");
            i.innerHTML = e;
            var n = i.firstChild;
            i.removeChild(n), h = n
        },
        addNotification: function (e) {
            d.count += 1;
            var t = function () {
                var e = "",
                    t = "abcdefghijklmnopqrstuvwxyz0123456789";
                do {
                    e = "";
                    for (var i = 0; 5 > i; i++) e += t.charAt(Math.floor(Math.random() * t.length))
                } while (d.exists(e));
                return e
            }();
            return n(t), d.editNotification(t, e), t
        },
        editNotification: function (e, t) {
            null !== d.notifications[e].removeTimer && (clearTimeout(d.notifications[e].removeTimer), d.notifications[e].removeTimer = null), n(e), t = t ||
                {}, void 0 === d.notifications[e].options && (d.notifications[e].options = d.defaultOptions), t = a(d.notifications[e].options, t);
            var i = d.notifications[e].element;
            r(i, t.color);
            var o = i.getElementsByClassName("notifi-title")[0];
            t.title ? (o.textContent = t.title, s(i, "notifi-no-title")) : (o.textContent = "", r(i, "notifi-no-title"));
            var c = i.getElementsByClassName("notifi-text")[0];
            t.text ? (c.textContent = t.text, s(i, "notifi-no-text")) : (c.textContent = "", r(i, "notifi-no-text"));
            var h = i.getElementsByClassName("notifi-icon")[0];
            t.icon ? (h.innerHTML = t.icon, s(i, "notifi-no-icon")) : (h.innerHTML = "", r(i, "notifi-no-icon")), null !== t.timer && clearTimeout(d.notifications[e].timer);
            var u = null;
            null !== t.timeout && (u = setTimeout((function () {
                d.removeNotification(e)
            }), t.timeout)), d.notifications[e].timer = u, d.notifications[e].action = t.action;
            var f = i.getElementsByClassName("notifi-button")[0];
            t.button ? f.innerHTML = t.button : f.innerHTML = "", t.dismissable ? s(i, "not-dismissable") : r(i, "not-dismissable"), setTimeout((function () {
                r(i, "notifi-in"), i.removeAttribute("style")
            }), 0), l() && r(i, "no-hover"), d.notifications[e].options = t
        },
        removeNotification: function (e) {
            if (d.isDismissed(e)) return !1;
            var i = d.notifications[e].element;
            return s(i, "notifi-in"), t.body.clientWidth > 480 ? i.style.marginBottom = -i.offsetHeight + "px" : i.style.marginTop = -i.offsetHeight + "px", d.notifications[e].removeTimer = setTimeout((function () {
                i.parentElement.removeChild(i)
            }), 500), clearTimeout(d.notifications[e].timer), !0
        },
        isDismissed: function (e) {
            return !d.exists(e) || null === d.notifications[e].element.parentElement
        },
        exists: function (e) {
            return void 0 !== d.notifications[e]
        },
        setTitle: function (e, t) {
            d.editNotification(e,
                {
                    title: t
                })
        },
        setText: function (e, t) {
            d.editNotification(e,
                {
                    text: t
                })
        },
        setIcon: function (e, t) {
            d.editNotification(e,
                {
                    icon: t
                })
        },
        setTimeout: function (e, t) {
            d.editNotification(e,
                {
                    timeout: t
                })
        }
    };
    var h = null;
    "complete" === t.readyState || "interactive" === t.readyState && t.body ? c() : t.addEventListener ? t.addEventListener("DOMContentLoaded", (function () {
        t.removeEventListener("DOMContentLoaded", null, !1), c()
    }), !1) : t.attachEvent && t.attachEvent("onreadystatechange", (function () {
        "complete" === t.readyState && (t.detachEvent("onreadystatechange", null), c())
    })), e.Notifi = d
}(window, document);

function resetGame() {
    phase = "waiting", lastTimestamp = void 0, sceneOffset = 0, score = 0, introductionElement.style.opacity = 1, perfectElement.style.opacity = 0, restartButton.style.display = "none", scoreElement.innerText = score, platforms = [
        {
            x: 50,
            w: 50
        }], generatePlatform(), generatePlatform(), generatePlatform(), generatePlatform(), sticks = [
        {
            x: platforms[0].x + platforms[0].w,
            length: 0,
            rotation: 0
        }], trees = [], generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge, heroY = 0, drawZ()
}

function generateTree() {
    const e = trees[trees.length - 1],
        t = (e ? e.x : 0) + 30 + Math.floor(120 * Math.random()),
        i = ["#6D8821", "#8FAC34", "#98B333"][Math.floor(3 * Math.random())];
    trees.push(
        {
            x: t,
            color: i
        })
}

function generatePlatform() {
    const e = platforms[platforms.length - 1],
        t = e.x + e.w + 40 + Math.floor(160 * Math.random()),
        i = 20 + Math.floor(80 * Math.random());
    platforms.push(
        {
            x: t,
            w: i
        })
}

function animate(e) {
    if (!lastTimestamp) return lastTimestamp = e, void _window.requestAnimationFrame(animate);
    switch (phase) {
        case "waiting":
            return;
        case "stretching":
            sticks.last().length += (e - lastTimestamp) / stretchingSpeed;
            break;
        case "turning":
            if (sticks.last().rotation += (e - lastTimestamp) / turningSpeed, sticks.last().rotation > 90) {
                sticks.last().rotation = 90;
                const [e, t] = thePlatformTheStickHits();
                e && (score += t ? 2 : 1, scoreElement.innerText = score, t && (perfectElement.style.opacity = 1, setTimeout((() => perfectElement.style.opacity = 0), 1e3)), generatePlatform(), generateTree(), generateTree()), phase = "walking"
            }
            break;
        case "walking": {
            heroX += (e - lastTimestamp) / walkingSpeed;
            const [t] = thePlatformTheStickHits();
            if (t) {
                const e = t.x + t.w - heroDistanceFromEdge;
                heroX > e && (heroX = e, phase = "transitioning")
            } else {
                const e = sticks.last().x + sticks.last().length + heroWidth;
                heroX > e && (heroX = e, phase = "falling")
            }
            break
        }
        case "transitioning": {
            sceneOffset += (e - lastTimestamp) / transitioningSpeed;
            const [t] = thePlatformTheStickHits();
            sceneOffset > t.x + t.w - paddingX && (sticks.push(
                {
                    x: t.x + t.w,
                    length: 0,
                    rotation: 0
                }), phase = "waiting");
            break
        }
        case "falling": {
            sticks.last().rotation < 180 && (sticks.last().rotation += (e - lastTimestamp) / turningSpeed), heroY += (e - lastTimestamp) / fallingSpeed;
            const t = platformHeight + 100 + (_window.innerHeight - canvasHeight) / 2;
            if (heroY > t) return void (restartButton.style.display = "block");
            break
        }
        default:
            throw Error("Wrong phase")
    }
    drawZ(), _window.requestAnimationFrame(animate), lastTimestamp = e
}

function thePlatformTheStickHits() {
    if (90 !== sticks.last().rotation) throw Error(`Stick is ${sticks.last().rotation}°`);
    const e = sticks.last().x + sticks.last().length,
        t = platforms.find((t => t.x < e && e < t.x + t.w));
    return t && t.x + t.w / 2 - perfectAreaSize / 2 < e && e < t.x + t.w / 2 + perfectAreaSize / 2 ? [t, !0] : [t, !1]
}

function drawZ() {
    ctx.save(), ctx.clearRect(0, 0, _window.innerWidth, _window.innerHeight), drawBackground(), ctx.translate((_window.innerWidth - canvasWidth) / 2 - sceneOffset, (_window.innerHeight - canvasHeight) / 2), drawPlatforms(), drawHero(), drawSticks(), ctx.restore()
}

function drawPlatforms() {
    platforms.forEach(((
        {
            x: e,
            w: t
        }) => {
        ctx.fillStyle = "black", ctx.fillRect(e, canvasHeight - platformHeight, t, platformHeight + (_window.innerHeight - canvasHeight) / 2), sticks.last().x < e && (ctx.fillStyle = "red", ctx.fillRect(e + t / 2 - perfectAreaSize / 2, canvasHeight - platformHeight, perfectAreaSize, perfectAreaSize))
    }))
}

function drawHero() {
    ctx.save(), ctx.fillStyle = "black", ctx.translate(heroX - heroWidth / 2, heroY + canvasHeight - platformHeight - heroHeight / 2), drawRoundedRect(-heroWidth / 2, -heroHeight / 2, heroWidth, heroHeight - 4, 5), ctx.beginPath(), ctx.arc(5, 11.5, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.beginPath(), ctx.arc(-5, 11.5, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.beginPath(), ctx.fillStyle = "white", ctx.arc(5, -7, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.fillStyle = "red", ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5), ctx.beginPath(), ctx.moveTo(-9, -14.5), ctx.lineTo(-17, -18.5), ctx.lineTo(-14, -8.5), ctx.fill(), ctx.beginPath(), ctx.moveTo(-10, -10.5), ctx.lineTo(-15, -3.5), ctx.lineTo(-5, -7), ctx.fill(), ctx.restore()
}

function drawRoundedRect(e, t, i, n, a) {
    ctx.beginPath(), ctx.moveTo(e, t + a), ctx.lineTo(e, t + n - a), ctx.arcTo(e, t + n, e + a, t + n, a), ctx.lineTo(e + i - a, t + n), ctx.arcTo(e + i, t + n, e + i, t + n - a, a), ctx.lineTo(e + i, t + a), ctx.arcTo(e + i, t, e + i - a, t, a), ctx.lineTo(e + a, t), ctx.arcTo(e, t, e, t + a, a), ctx.fill()
}

function drawSticks() {
    sticks.forEach((e => {
        ctx.save(), ctx.translate(e.x, canvasHeight - platformHeight), ctx.rotate(Math.PI / 180 * e.rotation), ctx.beginPath(), ctx.lineWidth = 2, ctx.moveTo(0, 0), ctx.lineTo(0, -e.length), ctx.stroke(), ctx.restore()
    }))
}

function drawBackground() {
    var e = ctx.createLinearGradient(0, 0, 0, _window.innerHeight);
    e.addColorStop(0, "#BBD691"), e.addColorStop(1, "#FEF1E1"), ctx.fillStyle = e, ctx.fillRect(0, 0, _window.innerWidth, _window.innerHeight), drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, "#95C629"), drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, "#659F1C"), trees.forEach((e => drawTree(e.x, e.color)))
}

function drawHill(e, t, i, n) {
    ctx.beginPath(), ctx.moveTo(0, _window.innerHeight), ctx.lineTo(0, getHillY(0, e, t, i));
    for (let n = 0; n < _window.innerWidth; n++) ctx.lineTo(n, getHillY(n, e, t, i));
    ctx.lineTo(_window.innerWidth, _window.innerHeight), ctx.fillStyle = n, ctx.fill()
}

function drawTree(e, t) {
    ctx.save(), ctx.translate((-sceneOffset * backgroundSpeedMultiplier + e) * hill1Stretch, getTreeY(e, hill1BaseHeight, hill1Amplitude)), ctx.fillStyle = "#7D833C", ctx.fillRect(-1, -5, 2, 5), ctx.beginPath(), ctx.moveTo(-5, -5), ctx.lineTo(0, -30), ctx.lineTo(5, -5), ctx.fillStyle = t, ctx.fill(), ctx.restore()
}

function getHillY(e, t, i, n) {
    const a = _window.innerHeight - t;
    return Math.sinus((sceneOffset * backgroundSpeedMultiplier + e) * n) * i + a
}

function getTreeY(e, t, i) {
    const n = _window.innerHeight - t;
    return Math.sinus(e) * i + n
}

function app() {
    return {
        showSettingsPage: !1,
        openModal: !1,
        username: "",
        bannerImage: "",
        colors: [
            {
                label: "#3182ce",
                value: "blue"
            },
            {
                label: "#38a169",
                value: "green"
            },
            {
                label: "#805ad5",
                value: "purple"
            },
            {
                label: "#e53e3e",
                value: "red"
            },
            {
                label: "#dd6b20",
                value: "orange"
            },
            {
                label: "#5a67d8",
                value: "indigo"
            },
            {
                label: "#319795",
                value: "teal"
            },
            {
                label: "#718096",
                value: "gray"
            },
            {
                label: "#d69e2e",
                value: "yellow"
            }],
        colorSelected:
            {
                label: "#3182ce",
                value: "blue"
            },
        dateDisplay: "toDateString",
        boards: ["Todo", "Progress", "Review", "Done"],
        task:
            {
                name: "",
                boardName: "",
                date: new Date
            },
        editTask:
            {},
        tasks: [],
        formatDateDisplay(e) {
            return "toDateString" === this.dateDisplay ? new Date(e).toDateString() : "toLocaleDateString" === this.dateDisplay ? new Date(e).toLocaleDateString("en-GB") : (new Date).toLocaleDateString("en-GB")
        },
        showModal(e) {
            this.task.boardName = e, this.openModal = !0, setTimeout((() => this.$refs.taskName.focus()), 200)
        },
        saveEditTask(e) {
            if ("" === e.name) return;
            let t = this.tasks.findIndex((t => t.uuid === e.uuid));
            this.tasks[t].name = e.name, this.tasks[t].date = new Date, this.tasks[t].edit = !1;
            let i = JSON.parse(localStorage.getItem("TG-tasks"));
            i[t].name = e.name, i[t].date = new Date, i[t].edit = !1, localStorage.setItem("TG-tasks", JSON.stringify(i)), this.dispatchCustomEvents("flash", "Task detail updated")
        },
        getTasks() {
            const e = JSON.parse(localStorage.getItem("TG-theme"));
            if (this.dateDisplay = localStorage.getItem("TG-dateDisplay") || "toLocaleDateString", this.username = localStorage.getItem("TG-username") || "", this.bannerImage = localStorage.getItem("TG-bannerImage") || "", this.colorSelected = e ||
                {
                    label: "#3182ce",
                    value: "blue"
                }, localStorage.getItem("TG-tasks")) {
                const e = JSON.parse(localStorage.getItem("TG-tasks"));
                this.tasks = e.map((e => (
                    {
                        id: e.id,
                        uuid: e.uuid,
                        name: e.name,
                        status: e.status,
                        boardName: e.boardName,
                        date: e.date,
                        edit: !1
                    })))
            } else this.tasks = []
        },
        addTask() {
            if ("" === this.task.name) return;
            const e = {
                uuid: this.generateUUID(),
                name: this.task.name,
                status: "pending",
                boardName: this.task.boardName,
                date: new Date
            };
            this.saveDataToLocalStorage(e, "TG-tasks"), this.getTasks(), this.dispatchCustomEvents("flash", "New task added"), this.task.name = "", this.task.boardName = "", this.openModal = !1
        },
        saveSettings() {
            const e = JSON.stringify(this.colorSelected);
            localStorage.setItem("TG-username", this.username), localStorage.setItem("TG-theme", e), localStorage.setItem("TG-bannerImage", this.bannerImage), localStorage.setItem("TG-dateDisplay", this.dateDisplay), this.dispatchCustomEvents("flash", "Settings updated"), this.showSettingsPage = !1
        },
        onDragStart(e, t) {
            e.dataTransfer.setData("text/plain", t), e.target.classList.add("opacity-5")
        },
        onDragOver: e => (e.preventDefault(), !1),
        onDragEnter(e) {
            e.target.classList.add("bg-gray-200")
        },
        onDragLeave(e) {
            e.target.classList.remove("bg-gray-200")
        },
        onDrop(e, t) {
            e.stopPropagation(), e.preventDefault(), e.target.classList.remove("bg-gray-200");
            const i = e.dataTransfer.getData("text"),
                n = document.getElementById(i);
            e.target.appendChild(n);
            let a = JSON.parse(localStorage.getItem("TG-tasks")),
                r = a.findIndex((e => e.uuid === i));
            a[r].boardName = t, a[r].date = new Date, localStorage.setItem("TG-tasks", JSON.stringify(a)), this.getTasks(), this.dispatchCustomEvents("flash", "Task moved to " + t), e.dataTransfer.clearData()
        },
        saveDataToLocalStorage(e, t) {
            var i = [];
            (i = JSON.parse(localStorage.getItem(t)) || []).push(e), localStorage.setItem(t, JSON.stringify(i))
        },
        generateUUID: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (e) {
            var t = 16 * Math.random() | 0;
            return ("x" === e ? t : 3 & t | 8).toString(16)
        })),
        dispatchCustomEvents(e, t) {
            let i = new CustomEvent(e,
                {
                    detail:
                        {
                            message: t
                        }
                });
            _window.dispatchEvent(i)
        },
        greetText() {
            var e = (new Date).getHours();
            const t = e => e.split(" ").map((e => `${e.charAt(0).toUpperCase()}${e.slice(1)}`)).join(" ");
            let i = localStorage.getItem("TG-username") || "";
            return e < 12 ? "Good morning, " + t(i) : e < 17 ? "Good afternoon, " + t(i) : "Good evening, " + t(i)
        }
    }
}

sssl(["https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js", "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js", "https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js", "https://kendo.cdn.telerik.com/2015.3.1111/js/jquery.min.js", "https://kendo.cdn.telerik.com/2015.3.1111/js/kendo.all.min.js", "./js/includes/newNote.js", "./js/includes/newTask.js", "./js/includes/notes.js", "./js/includes/profile.js", "./js/includes/signIn.js", "./js/includes/signOut.js", "./js/includes/viewNote.js", "./js/includes/viewTask.js"], (function () {
    $("form :input[required='required']").blur((function () {
        $(this).val() ? $(this).hasClass("hasError") && $(this).removeClass("hasError") : $(this).addClass("hasError")
    })), $("form :input[required='required']").change((function () {
        $(this).hasClass("hasError") && $(this).removeClass("hasError")
    })), $(".autosize").length > 0 && $(".autosize").each((function () {
        resizeTextArea($(this))
    }));
    var e = null;
    $("#signout").click((function (t) {
        t.preventDefault(), Notifi.isDismissed(e) && (e = Notifi.addNotification(
            {
                color: "default",
                title: accountSignOutTitle,
                text: accountSignOutText,
                icon: '<i class="fa fa-sign-out fa-lg"></i>',
                button: '<a href="index.php?action=signout" class="btn btn-success btn-notifi">' + yesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-notifi btn-close-notification">' + cancelOption + "</span>",
                timeout: null
            }))
    })), $((function () {
        $("#scheduler").kendoScheduler(
            {
                date: new Date,
                startTime: new Date,
                height: 600,
                views: ["day",
                    {
                        type: "workWeek",
                        selected: !0
                    }, "week", "month", "agenda",
                    {
                        type: "timeline",
                        eventHeight: 50
                    }],
                timezone: "Etc/UTC",
                dataSource:
                    {
                        batch: !0,
                        transport:
                            {
                                read:
                                    {
                                        url: "",
                                        dataType: "jsonp"
                                    },
                                update:
                                    {
                                        url: "",
                                        dataType: "jsonp"
                                    },
                                create:
                                    {
                                        url: "",
                                        dataType: "jsonp"
                                    },
                                destroy:
                                    {
                                        url: "",
                                        dataType: "jsonp"
                                    },
                                parameterMap: function (e, t) {
                                    if ("read" !== t && e.models) return {
                                        models: kendo.stringify(e.models)
                                    }
                                }
                            },
                        schema:
                            {
                                model:
                                    {
                                        id: "taskId",
                                        fields:
                                            {
                                                taskId:
                                                    {
                                                        from: "TaskID",
                                                        type: "number"
                                                    },
                                                title:
                                                    {
                                                        from: "Title",
                                                        defaultValue: "No title",
                                                        validation:
                                                            {
                                                                required: !0
                                                            }
                                                    },
                                                start:
                                                    {
                                                        type: "date",
                                                        from: "Start"
                                                    },
                                                end:
                                                    {
                                                        type: "date",
                                                        from: "End"
                                                    },
                                                startTimezone:
                                                    {
                                                        from: "StartTimezone"
                                                    },
                                                endTimezone:
                                                    {
                                                        from: "EndTimezone"
                                                    },
                                                description:
                                                    {
                                                        from: "Description"
                                                    },
                                                recurrenceId:
                                                    {
                                                        from: "RecurrenceID"
                                                    },
                                                recurrenceRule:
                                                    {
                                                        from: "RecurrenceRule"
                                                    },
                                                recurrenceException:
                                                    {
                                                        from: "RecurrenceException"
                                                    },
                                                ownerId:
                                                    {
                                                        from: "OwnerID",
                                                        defaultValue: 1
                                                    },
                                                isAllDay:
                                                    {
                                                        type: "boolean",
                                                        from: "IsAllDay"
                                                    }
                                            }
                                    }
                            }
                    },
                resources: [
                    {
                        field: "ownerId",
                        title: "Owner",
                        dataSource: [
                            {
                                text: "Alex",
                                value: 1,
                                color: "#f8a398"
                            },
                            {
                                text: "Bob",
                                value: 2,
                                color: "#51a0ed"
                            },
                            {
                                text: "Charlie",
                                value: 3,
                                color: "#56ca85"
                            }]
                    }]
            }), new resetStar;
        var e = [
                {
                    type: "regionEntrance",
                    userId: "Bob Saget",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionEntrance",
                    userId: "Bob Saget",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionExit",
                    userId: "Bob Saget",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionEntrance",
                    userId: "Jeff",
                    regionId: "cid10_chi_conf_2"
                },
                {
                    type: "regionExit",
                    userId: "Jeff",
                    regionId: "cid10_chi_conf_2"
                },
                {
                    type: "regionEntrance",
                    userId: "Paul",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionExit",
                    userId: "Paul",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionEntrance",
                    userId: "Paul",
                    regionId: "cid10_chi_conf_2"
                },
                {
                    type: "regionEntrance",
                    userId: "DenverCoder9",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "regionEntrance",
                    userId: "Trogdor",
                    regionId: "cid10_chi_lobby"
                },
                {
                    type: "coffeeBrewed",
                    when: "9:37am"
                },
                {
                    type: "coffeeDepleted",
                    when: "10:15am"
                },
                {
                    type: "coffeeBrewed",
                    when: "10:30am"
                }],
            t = function () {
                var t = e[Math.floor(Math.random() * (e.length - 1)) + 1];
                dashboard.$app.trigger("dashboard.messageReceived", t)
            };
        _window.dashboard = {
            $app: $("#app"),
            dispatcher: setInterval(t, 5e3),
            endDemo: function () {
                return clearInterval(this.dispatcher)
            }
        }, dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
            console.log(t)
        })), $("#welcome").click(t), dashboard.$app.find(".welcome-component").each((function (e, t) {
            var i = $(t),
                n = i.data("region"),
                a = i.data("message-welcome"),
                r = i.data("message-farewell"),
                o = [],
                s = [],
                l = function (e) {
                    return $("<h2></h2>").text(e)
                },
                c = function (e) {
                    return s.some((function (t) {
                        return e === t
                    }))
                },
                d = function () {
                    o.shift().remove()
                };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (t.regionId !== n) return !0;
                if ("regionEntrance" !== t.type && "regionExit" !== t.type) return !0;
                var h, u = !1,
                    f = t.userId,
                    g = t.type,
                    m = "regionEntrance" === g ? a.replace("{$user}", f) : r.replace("{$user}", f);
                c(f) || "regionEntrance" !== g ? c(f) && "regionExit" === g && (h = l(m), s.splice(s.indexOf(f), 1), function (e) {
                    i.find("h2").each((function (t, i) {
                        var n = $(i);
                        n.data("user") === e && (console.log("activeMessages before", o.length), o.splice(o.indexOf(n), 1), n.remove(), console.log("activeMessages after", o.length))
                    }))
                }(f), u = !0) : (h = l(m).data("user", f), s.push(f), u = !0), u && (i.append(h), o.push(h), setTimeout(d, 7275))
            }))
        })), dashboard.$app.find(".connected-users").each((function (e, t) {
            var i = $(t),
                n = i.data("region"),
                a = i.data("message"),
                r = [],
                o = function () {
                    var e = 1 === r.length ? a.replace("users", "user") : a;
                    i.find("h3").text(e.replace("{$num}", r.length))
                };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (t.regionId !== n) return !0;
                if ("regionEntrance" === t.type && -1 === r.indexOf(t.userId) && (r.push(t.userId), o()), "regionExit" === t.type) {
                    var i = r.indexOf(t.userId);
                    -1 !== i && (r.splice(i, 1), o())
                }
                return !0
            }))
        })), dashboard.$app.find(".coffee-brewed").each((function (e, t) {
            var i = $(t),
                n = i.data("state"),
                a = i.data("message-brewed"),
                r = i.data("message-depleted");
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if ("coffeeBrewed" !== t.type && "coffeeDepleted" !== t.type) return !0;
                if ("coffeeDepleted" === t.type && n === t.type) return !0;
                var o = "coffeeBrewed" === t.type ? a.replace("{$time}", t.when) : r.replace("{$time}", t.when);
                return i.data("state", t.type), i.html(o), !0
            }))
        })), dashboard.$app.find(".conference-rooms").each((function (e, t) {
            var i = $(t),
                n = i.data("message"),
                a = i.data("empty-verbiage"),
                r = i.data("full-verbiage"),
                o = {};
            i.find("h3").each((function (e, t) {
                o[t.id] = {
                    id: t.id,
                    $el: $(t),
                    name: $(t).data("room-name"),
                    users: []
                }
            }));
            var s = function (e) {
                var t = o[e],
                    i = n.replace("{$room}", t.name),
                    s = t.users.length > 0 ? i.replace("{$status}", r) : i.replace("{$status}", a);
                t.$el.html(s)
            };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (!function (e) {
                    return ("regionEntrance" === e.type || "regionExit" === e.type) && o.hasOwnProperty(e.regionId)
                }(t)) return !0;
                var i = o[t.regionId],
                    n = i.users.some((function (e) {
                        return t.userId === e
                    }));
                "regionEntrance" === t.type ? n || (i.users.push(t.userId), s(i.id)) : "regionExit" === t.type && n && (i.users.splice(i.users.indexOf(t.userId), 1), s(i.id))
            }))
        }))
    }))
}));
const hueBase = 0,
    hueRange = 255,
    segmentCount = 50,
    bubbleCount = 100,
    segmentLengthBase = 2,
    fadeIn = (e, t) => e / t,
    fadeOut = (e, t) => (t - e) / t,
    fadeInOut = (e, t) => {
        let i = .5 * t;
        return abs((e + i) % t - i) / i
    },
    angle = (e, t, i, n) => atan2(n - t, i - e);
let buffer, canvas, creature, bubbles, center, simplex;

class AttributeArray {
    constructor(e, t) {
        this.count = e, this.attrs = t, this.spread = t.length, this.values = new Float32Array(e * this.spread)
    }

    get length() {
        return this.values.length
    }

    set(e, t, i = !1) {
        i && (t *= this.spread), this.values.set(e, t)
    }

    get(e, t = !1) {
        return t && (e *= this.spread), this.values.slice(e, e + this.spread)
    }

    forEach(e) {
        let t = 0,
            i = 0;
        for (; t < this.length; t += this.spread, i++) e(this.get(t), i, this)
    }

    map(e) {
        let t = 0,
            i = 0;
        for (; t < this.length; t += this.spread, i++) this.set(e(this.get(t), i, this), t)
    }

    reverseMap(e) {
        let t = this.length - this.spread,
            i = this.count - 1;
        for (; t >= 0; t -= this.spread, i--) this.set(e(this.get(t), i, this), t)
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

    drawParticle(e, t, i, n, a, r) {
        const o = fadeInOut(a, r);
        buffer.stroke(n, 50, 100, .5 * o), buffer.strokeWeight(1 + i * o), buffer.point(e, t)
    }

    update() {
        this.map((([e, t, i, n, a, r, o, s, l]) => {
            const c = simplex.noise3D(.0015 * e, .0015 * t, .0015 * frameCount) * TAU;
            if (i = lerp(i, cos(c) * a, .15), n = lerp(n, (sin(c) + 2) * -a, .15), this.repelTarget && dist(e, t, ...this.repelTarget) < this.repelThreshold) {
                const r = angle(e, t, ...this.repelTarget);
                i = lerp(i, i - cos(r) * a, .275), n = lerp(n, n - sin(r) * a, .275)
            }
            return e = lerp(e, e + i, .125), t = lerp(t, t + n, .125), s++, this.drawParticle(e, t, r, o, s, l), s > l || e > windowWidth + r || e < -r || t < -r ? this.reset() : [e, t, i, n, a, r, o, s, l]
        }))
    }
}

class Chain extends AttributeArray {
    constructor(e, t, i, n, a, r = []) {
        super(i, ["x1", "y1", "x2", "y2", "l", "d", ...r]), this.position = [e, t], this.target = [e, t], this.baseLength = n, this.baseDirection = a
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
        let i = this.position;
        this.mapSegments((([t, n, a, r, o, s, ...l], c) => {
            t = i[0], n = i[1];
            const [d, ...h] = e([t, n, a, r, o, s, ...l], c), u = isNaN(d) ? s : d;
            return a = t + o * cos(u), r = n + o * sin(u), i = [a, r], [t, n, a, r, o, u, ...h]
        }), t)
    }
}

class Creature extends Chain {
    constructor() {
        super(center[0], center[1], 200, 1, 0, ["h"]), this.follow = !1, this.initSegments()
    }

    initSegments() {
        let e, t, i, n, a, r, o;
        a = this.baseLength, r = this.baseDirection, this.mapSegments(((s, l) => {
            var c, d;
            return e = i || this.position[0], t = n || this.position[1], i = e - a * cos(r), n = t - a * sin(r), r += .1, a *= 1.01, o = 0 + 500 * (c = l, ((d = this.segmentNum) - c) / d), [e, t, i, n, a, r, o]
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
        this.setPosition([lerp(this.position[0], this.target[0], .015), lerp(this.position[1], this.target[1], .015)]), this.updateTarget(), this.updateSegments((([e, t, i, n, a, r, o], s) => {
            let l;
            return l = simplex.noise3D(.005 * e, .005 * t, .005 * (s + frameCount)), r = angle(e, t, i, n) + .075 * l, this.drawSegment(e, t, i, n, o, l, r, s), [r]
        }), "backward")
    }

    drawSegment(e, t, i, n, a, r, o, s) {
        const l = 6 + 30 * fadeIn(s, this.segmentNum),
            c = 1.35 * l,
            d = e + c * cos(o + .85 + r),
            h = t + c * sin(o + .85 + r),
            u = e + c * cos(o - .85 - r),
            f = t + c * sin(o - .85 - r),
            g = .35 * l;
        buffer.strokeWeight(1 + 4 * fadeIn(s, this.segmentNum)), buffer.stroke(a, 100, 100, .1), buffer.noFill(), buffer.line(e, t, d, h), buffer.ellipse(d, h, g), buffer.line(e, t, u, f), buffer.ellipse(u, f, g), buffer.line(i, n, e, t), buffer.ellipse(e, t, l)
    }
}

function setup() {
    buffer = createGraphics(windowWidth, windowHeight), buffer.colorMode(HSB), canvas = createCanvas(windowWidth, windowHeight), canvas.mouseOver(mouseOver), canvas.mouseOut(mouseOut), frameRate(160), simplex = new SimplexNoise, center = [.5 * windowWidth, .5 * windowHeight], creature = new Creature, bubbles = new Bubbles(250)
}

function drawGlow() {
    drawingContext.save(), drawingContext.filter = "blur(6px) brightness(200%)", image(buffer, 0, 0), drawingContext.restore()
}

function drawImage() {
    drawingContext.save(), drawingContext.globalCompositeOperation = "lighter", image(buffer, 0, 0), drawingContext.restore()
}

function mouseOut() {
    creature.follow = !1
}

function mouseOver() {
    creature.follow = !0
}