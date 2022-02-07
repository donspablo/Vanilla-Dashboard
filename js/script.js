setTimeout(() => {
    document.querySelector("html").classList.add("loaded")
}, 3000);
const _window = window, _windowinnerWidth = _window.innerWidth, _windowinnerHeight = _window.innerHeight;

function startGame() {
    Array.prototype.last = function () {
        return this[this.length - 1]
    }, Math.sinus = function (e) {
        return Math.sin(e / 180 * Math.PI)
    };
    let e, t, i, n, a = "waiting", r = [], o = [], s = [], l = 0;
    const c = 375, d = 100, h = 10, u = 100, f = 17, g = document.getElementById("game");
    g.width = _windowinnerWidth, g.height = _windowinnerHeight;
    const m = g.getContext("2d"), p = document.getElementById("introduction"), w = document.getElementById("perfect"),
        b = document.getElementById("restart"), v = document.getElementById("score");

    function x() {
        a = "waiting", e = void 0, n = 0, l = 0, p.style.opacity = 1, w.style.opacity = 0, b.style.display = "none", v.innerText = l, r = [{
            x: 50,
            w: 50
        }], T(), T(), T(), T(), o = [{
            x: r[0].x + r[0].w,
            length: 0,
            rotation: 0
        }], s = [], y(), y(), y(), y(), y(), y(), y(), y(), y(), y(), t = r[0].x + r[0].w - 10, i = 0, k()
    }

    function y() {
        const e = s[s.length - 1];
        const t = (e ? e.x : 0) + 30 + Math.floor(120 * Math.random()),
            i = ["#6D8821", "#8FAC34", "#98B333"][Math.floor(3 * Math.random())];
        s.push({x: t, color: i})
    }

    function T() {
        const e = r[r.length - 1];
        const t = e.x + e.w + 40 + Math.floor(160 * Math.random()), i = 20 + Math.floor(80 * Math.random());
        r.push({x: t, w: i})
    }

    function S(r) {
        if (!e) return e = r, void _window.requestAnimationFrame(S);
        switch (a) {
            case"waiting":
                return;
            case"stretching":
                o.last().length += (r - e) / 4;
                break;
            case"turning":
                if (o.last().rotation += (r - e) / 4, o.last().rotation > 90) {
                    o.last().rotation = 90;
                    const [e, t] = _();
                    e && (l += t ? 2 : 1, v.innerText = l, t && (w.style.opacity = 1, setTimeout((() => w.style.opacity = 0), 1e3)), T(), y(), y()), a = "walking"
                }
                break;
            case"walking": {
                t += (r - e) / 4;
                const [i] = _();
                if (i) {
                    const e = i.x + i.w - 10;
                    t > e && (t = e, a = "transitioning")
                } else {
                    const e = o.last().x + o.last().length + f;
                    t > e && (t = e, a = "falling")
                }
                break
            }
            case"transitioning": {
                n += (r - e) / 2;
                const [t] = _();
                n > t.x + t.w - 100 && (o.push({x: t.x + t.w, length: 0, rotation: 0}), a = "waiting");
                break
            }
            case"falling": {
                o.last().rotation < 180 && (o.last().rotation += (r - e) / 4), i += (r - e) / 2;
                const t = 200 + (_window.innerHeight - c) / 2;
                if (i > t) return void (b.style.display = "block");
                break
            }
            default:
                throw Error("Wrong phase")
        }
        k(), _window.requestAnimationFrame(S), e = r
    }

    function _() {
        if (90 != o.last().rotation) throw Error(`Stick is ${o.last().rotation}°`);
        const e = o.last().x + o.last().length, t = r.find((t => t.x < e && e < t.x + t.w));
        return t && t.x + t.w / 2 - 5 < e && e < t.x + t.w / 2 + 5 ? [t, !0] : [t, !1]
    }

    function k() {
        var e;
        m.save(), m.clearRect(0, 0, _window.innerWidth, _window.innerHeight), (e = m.createLinearGradient(0, 0, 0, _window.innerHeight)).addColorStop(0, "#BBD691"), e.addColorStop(1, "#FEF1E1"), m.fillStyle = e, m.fillRect(0, 0, _window.innerWidth, _window.innerHeight), E(100, 10, 1, "#95C629"), E(70, 20, .5, "#659F1C"), s.forEach((e => function (e, t) {
            m.save(), m.translate(1 * (.2 * -n + e), function (e, t, i) {
                const n = _window.innerHeight - t;
                return Math.sinus(e) * i + n
            }(e, u, 10));
            const i = 5, a = 2, r = 25, o = 10;
            m.fillStyle = "#7D833C", m.fillRect(-a / 2, -i, a, i), m.beginPath(), m.moveTo(-o / 2, -i), m.lineTo(0, -(i + r)), m.lineTo(o / 2, -i), m.fillStyle = t, m.fill(), m.restore()
        }(e.x, e.color))), m.translate((_window.innerWidth - 375) / 2 - n, (_window.innerHeight - c) / 2), r.forEach((({
                                                                                                                           x: e,
                                                                                                                           w: t
                                                                                                                       }) => {
            m.fillStyle = "black", m.fillRect(e, 275, t, d + (_window.innerHeight - c) / 2), o.last().x < e && (m.fillStyle = "red", m.fillRect(e + t / 2 - 5, 275, h, h))
        })), function () {
            m.save(), m.fillStyle = "black", m.translate(t - 8.5, i + c - d - 15), e = -8.5, n = -15, a = f, r = 26, o = 5, m.beginPath(), m.moveTo(e, n + o), m.lineTo(e, n + r - o), m.arcTo(e, n + r, e + o, n + r, o), m.lineTo(e + a - o, n + r), m.arcTo(e + a, n + r, e + a, n + r - o, o), m.lineTo(e + a, n + o), m.arcTo(e + a, n, e + a - o, n, o), m.lineTo(e + o, n), m.arcTo(e, n, e, n + o, o), m.fill();
            var e, n, a, r, o;
            const s = 5;
            m.beginPath(), m.arc(s, 11.5, 3, 0, 2 * Math.PI, !1), m.fill(), m.beginPath(), m.arc(-s, 11.5, 3, 0, 2 * Math.PI, !1), m.fill(), m.beginPath(), m.fillStyle = "white", m.arc(5, -7, 3, 0, 2 * Math.PI, !1), m.fill(), m.fillStyle = "red", m.fillRect(-9.5, -12, 19, 4.5), m.beginPath(), m.moveTo(-9, -14.5), m.lineTo(-17, -18.5), m.lineTo(-14, -8.5), m.fill(), m.beginPath(), m.moveTo(-10, -10.5), m.lineTo(-15, -3.5), m.lineTo(-5, -7), m.fill(), m.restore()
        }(), o.forEach((e => {
            m.save(), m.translate(e.x, 275), m.rotate(Math.PI / 180 * e.rotation), m.beginPath(), m.lineWidth = 2, m.moveTo(0, 0), m.lineTo(0, -e.length), m.stroke(), m.restore()
        })), m.restore()
    }

    function E(e, t, i, n) {
        m.beginPath(), m.moveTo(0, _window.innerHeight), m.lineTo(0, I(0, e, t, i));
        for (let n = 0; n < _window.innerWidth; n++) m.lineTo(n, I(n, e, t, i));
        m.lineTo(_window.innerWidth, _window.innerHeight), m.fillStyle = n, m.fill()
    }

    function I(e, t, i, a) {
        const r = _window.innerHeight - t;
        return Math.sinus((.2 * n + e) * a) * i + r
    }

    x(), x(), _window.addEventListener("mousedown", (function (t) {
        "waiting" == a && (e = void 0, p.style.opacity = 0, a = "stretching", _window.requestAnimationFrame(S))
    })), _window.addEventListener("mouseup", (function (e) {
        "stretching" == a && (a = "turning")
    })), _window.addEventListener("resize", (function (e) {
        g.width = _windowinnerWidth, g.height = _windowinnerHeight, k()
    })), _window.requestAnimationFrame(S), b.addEventListener("click", (function (e) {
        e.preventDefault(), x(), b.style.display = "none"
    }))
}

function timeString(e) {
    const t = new Date(e), i = t.getHours() % 12;
    let n = t.getMinutes();
    return n = n < 10 ? `0${n}` : n, `${i}:${n}`
}

!function () {
    var e = document.getElementsByTagName("script")[0], t = e.parentNode, i = /ed|co/, n = function (n, a) {
        var r = document.createElement("script");
        r.onload = r.onreadystatechange = function () {
            this.readyState && !i.test(this.readyState) || (r.onload = r.onreadystatechange = null, a && a(r), r = null)
        }, r.async = !0, r.src = n, t.insertBefore(r, e)
    };
    _window.sssl = function (e, t) {
        if ("string" == typeof e) n(e, t); else {
            var i = e.shift();
            n(i, (function () {
                e.length ? _window.sssl(e, t) : t && t()
            }))
        }
    }
}(), _window.addEventListener("load", (e => {
    setTimeout(() => {
        document.querySelector("html").classList.add("loaded")
    }, 1000);
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
    const t = document.querySelector("#input"), i = document.querySelector("#messages"),
        n = document.querySelector(".overflow"),
        a = (document.querySelector("#name-input"), document.querySelector("#send"));
    let r, o, s = !0;

    function l(i) {
        i && (t.setAttribute("disabled", !0), t.value = "", e.send(i), r || (r = i, a.innerHTML = "Chat"))
    }

    function c(e) {
        const t = document.createElement("div"), n = timeString(e.timestamp), a = c.odd ? "odd" : "even";
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
        let i = $(t.attr("href")).offset().top - this.tabContainerHeight + 1;
        $("html, body").animate({scrollTop: i}, 600)
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
            let e = $(this).attr("href"), a = $(e).offset().top - n.tabContainerHeight,
                r = $(e).offset().top + $(e).height() - n.tabContainerHeight;
            $(window).scrollTop() > a && $(window).scrollTop() < r && (t = e, i = $(this))
        })), this.currentId == t && null !== this.currentId || (this.currentId = t, this.currentTab = i, this.setSliderCss())
    }

    setSliderCss() {
        let e = 0, t = 0;
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
            if (a = /notifi-notification-([a-zA-Z0-9]+)/.exec(a)[1], n && d.notifications[a].options.dismissable) d.removeNotification(a); else {
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

    var d = d || {};
    d = {
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
            d.defaultOptions = a(d.defaultOptions, e)
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
                var e = "", t = "abcdefghijklmnopqrstuvwxyz0123456789";
                do {
                    e = "";
                    for (var i = 0; 5 > i; i++) e += t.charAt(Math.floor(Math.random() * t.length))
                } while (d.exists(e));
                return e
            }();
            return n(t), d.editNotification(t, e), t
        },
        editNotification: function (e, t) {
            null !== d.notifications[e].removeTimer && (clearTimeout(d.notifications[e].removeTimer), d.notifications[e].removeTimer = null), n(e), t = t || {}, void 0 === d.notifications[e].options && (d.notifications[e].options = d.defaultOptions), t = a(d.notifications[e].options, t);
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
        reOpenNotification: function (e) {
            d.editNotification(e)
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
            d.editNotification(e, {title: t})
        },
        setText: function (e, t) {
            d.editNotification(e, {text: t})
        },
        setIcon: function (e, t) {
            d.editNotification(e, {icon: t})
        },
        setTimeout: function (e, t) {
            d.editNotification(e, {timeout: t})
        }
    };
    var h = null;
    "complete" === t.readyState || "interactive" === t.readyState && t.body ? c() : t.addEventListener ? t.addEventListener("DOMContentLoaded", (function () {
        t.removeEventListener("DOMContentLoaded", null, !1), c()
    }), !1) : t.attachEvent && t.attachEvent("onreadystatechange", (function () {
        "complete" === t.readyState && (t.detachEvent("onreadystatechange", null), c())
    })), e.Notifi = d
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
                i = binary_circle.drops[e] * binary_circle.font_size;
            binary_circle.ctx.fillText(t, e * binary_circle.font_size, binary_circle.textPosY), i > binary_circle.height && Math.random() > .956 && (binary_circle.drops[e] = 0), binary_circle.drops[e]++
        }
    }
}

function resetGame() {
    phase = "waiting", lastTimestamp = void 0, sceneOffset = 0, score = 0, introductionElement.style.opacity = 1, perfectElement.style.opacity = 0, restartButton.style.display = "none", scoreElement.innerText = score, platforms = [{
        x: 50,
        w: 50
    }], generatePlatform(), generatePlatform(), generatePlatform(), generatePlatform(), sticks = [{
        x: platforms[0].x + platforms[0].w,
        length: 0,
        rotation: 0
    }], trees = [], generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), generateTree(), heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge, heroY = 0, drawZ()
}

function generateTree() {
    const e = trees[trees.length - 1];
    const t = (e ? e.x : 0) + 30 + Math.floor(120 * Math.random()),
        i = ["#6D8821", "#8FAC34", "#98B333"][Math.floor(3 * Math.random())];
    trees.push({x: t, color: i})
}

function generatePlatform() {
    const e = platforms[platforms.length - 1];
    const t = e.x + e.w + 40 + Math.floor(160 * Math.random()), i = 20 + Math.floor(80 * Math.random());
    platforms.push({x: t, w: i})
}

function animate(e) {
    if (!lastTimestamp) return lastTimestamp = e, void _window.requestAnimationFrame(animate);
    switch (phase) {
        case"waiting":
            return;
        case"stretching":
            sticks.last().length += (e - lastTimestamp) / stretchingSpeed;
            break;
        case"turning":
            if (sticks.last().rotation += (e - lastTimestamp) / turningSpeed, sticks.last().rotation > 90) {
                sticks.last().rotation = 90;
                const [e, t] = thePlatformTheStickHits();
                e && (score += t ? 2 : 1, scoreElement.innerText = score, t && (perfectElement.style.opacity = 1, setTimeout((() => perfectElement.style.opacity = 0), 1e3)), generatePlatform(), generateTree(), generateTree()), phase = "walking"
            }
            break;
        case"walking": {
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
        case"transitioning": {
            sceneOffset += (e - lastTimestamp) / transitioningSpeed;
            const [t] = thePlatformTheStickHits();
            sceneOffset > t.x + t.w - paddingX && (sticks.push({
                x: t.x + t.w,
                length: 0,
                rotation: 0
            }), phase = "waiting");
            break
        }
        case"falling": {
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
    if (90 != sticks.last().rotation) throw Error(`Stick is ${sticks.last().rotation}°`);
    const e = sticks.last().x + sticks.last().length, t = platforms.find((t => t.x < e && e < t.x + t.w));
    return t && t.x + t.w / 2 - perfectAreaSize / 2 < e && e < t.x + t.w / 2 + perfectAreaSize / 2 ? [t, !0] : [t, !1]
}

function drawZ() {
    ctx.save(), ctx.clearRect(0, 0, _window.innerWidth, _window.innerHeight), drawBackground(), ctx.translate((_window.innerWidth - canvasWidth) / 2 - sceneOffset, (_window.innerHeight - canvasHeight) / 2), drawPlatforms(), drawHero(), drawSticks(), ctx.restore()
}

function drawPlatforms() {
    platforms.forEach((({x: e, w: t}) => {
        ctx.fillStyle = "black", ctx.fillRect(e, canvasHeight - platformHeight, t, platformHeight + (_window.innerHeight - canvasHeight) / 2), sticks.last().x < e && (ctx.fillStyle = "red", ctx.fillRect(e + t / 2 - perfectAreaSize / 2, canvasHeight - platformHeight, perfectAreaSize, perfectAreaSize))
    }))
}

function drawHero() {
    ctx.save(), ctx.fillStyle = "black", ctx.translate(heroX - heroWidth / 2, heroY + canvasHeight - platformHeight - heroHeight / 2), drawRoundedRect(-heroWidth / 2, -heroHeight / 2, heroWidth, heroHeight - 4, 5);
    ctx.beginPath(), ctx.arc(5, 11.5, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.beginPath(), ctx.arc(-5, 11.5, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.beginPath(), ctx.fillStyle = "white", ctx.arc(5, -7, 3, 0, 2 * Math.PI, !1), ctx.fill(), ctx.fillStyle = "red", ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5), ctx.beginPath(), ctx.moveTo(-9, -14.5), ctx.lineTo(-17, -18.5), ctx.lineTo(-14, -8.5), ctx.fill(), ctx.beginPath(), ctx.moveTo(-10, -10.5), ctx.lineTo(-15, -3.5), ctx.lineTo(-5, -7), ctx.fill(), ctx.restore()
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
    ctx.save(), ctx.translate((-sceneOffset * backgroundSpeedMultiplier + e) * hill1Stretch, getTreeY(e, hill1BaseHeight, hill1Amplitude));
    ctx.fillStyle = "#7D833C", ctx.fillRect(-1, -5, 2, 5), ctx.beginPath(), ctx.moveTo(-5, -5), ctx.lineTo(0, -30), ctx.lineTo(5, -5), ctx.fillStyle = t, ctx.fill(), ctx.restore()
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
        colors: [{label: "#3182ce", value: "blue"}, {label: "#38a169", value: "green"}, {
            label: "#805ad5",
            value: "purple"
        }, {label: "#e53e3e", value: "red"}, {label: "#dd6b20", value: "orange"}, {
            label: "#5a67d8",
            value: "indigo"
        }, {label: "#319795", value: "teal"}, {label: "#718096", value: "gray"}, {label: "#d69e2e", value: "yellow"}],
        colorSelected: {label: "#3182ce", value: "blue"},
        dateDisplay: "toDateString",
        boards: ["Todo", "Progress", "Review", "Done"],
        task: {name: "", boardName: "", date: new Date},
        editTask: {},
        tasks: [],
        formatDateDisplay(e) {
            return "toDateString" === this.dateDisplay ? new Date(e).toDateString() : "toLocaleDateString" === this.dateDisplay ? new Date(e).toLocaleDateString("en-GB") : (new Date).toLocaleDateString("en-GB")
        },
        showModal(e) {
            this.task.boardName = e, this.openModal = !0, setTimeout((() => this.$refs.taskName.focus()), 200)
        },
        saveEditTask(e) {
            if ("" == e.name) return;
            let t = this.tasks.findIndex((t => t.uuid === e.uuid));
            this.tasks[t].name = e.name, this.tasks[t].date = new Date, this.tasks[t].edit = !1;
            let i = JSON.parse(localStorage.getItem("TG-tasks"));
            i[t].name = e.name, i[t].date = new Date, i[t].edit = !1, localStorage.setItem("TG-tasks", JSON.stringify(i)), this.dispatchCustomEvents("flash", "Task detail updated")
        },
        getTasks() {
            const e = JSON.parse(localStorage.getItem("TG-theme"));
            if (this.dateDisplay = localStorage.getItem("TG-dateDisplay") || "toLocaleDateString", this.username = localStorage.getItem("TG-username") || "", this.bannerImage = localStorage.getItem("TG-bannerImage") || "", this.colorSelected = e || {
                label: "#3182ce",
                value: "blue"
            }, localStorage.getItem("TG-tasks")) {
                const e = JSON.parse(localStorage.getItem("TG-tasks"));
                this.tasks = e.map((e => ({
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
            if ("" == this.task.name) return;
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
            const i = e.dataTransfer.getData("text"), n = document.getElementById(i);
            e.target.appendChild(n);
            let a = JSON.parse(localStorage.getItem("TG-tasks")), r = a.findIndex((e => e.uuid === i));
            a[r].boardName = t, a[r].date = new Date, localStorage.setItem("TG-tasks", JSON.stringify(a)), this.getTasks(), this.dispatchCustomEvents("flash", "Task moved to " + t), e.dataTransfer.clearData()
        },
        saveDataToLocalStorage(e, t) {
            var i = [];
            (i = JSON.parse(localStorage.getItem(t)) || []).push(e), localStorage.setItem(t, JSON.stringify(i))
        },
        generateUUID: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (e) {
            var t = 16 * Math.random() | 0;
            return ("x" == e ? t : 3 & t | 8).toString(16)
        })),
        dispatchCustomEvents(e, t) {
            let i = new CustomEvent(e, {detail: {message: t}});
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

sssl(["https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js","https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js","https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.3.5/dist/alpine.min.js", "https://kendo.cdn.telerik.com/2015.3.1111/js/jquery.min.js", "https://kendo.cdn.telerik.com/2015.3.1111/js/kendo.all.min.js", "./js/includes/newNote.js", "./js/includes/newTask.js", "./js/includes/notes.js", "./js/includes/profile.js", "./js/includes/signIn.js", "./js/includes/signOut.js", "./js/includes/viewNote.js", "./js/includes/viewTask.js"], (function () {
    $("form :input[required='required']").blur((function () {
        $(this).val() ? $(this).hasClass("hasError") && $(this).removeClass("hasError") : $(this).addClass("hasError")
    })), $("form :input[required='required']").change((function () {
        $(this).hasClass("hasError") && $(this).removeClass("hasError")
    })), $(".autosize").length > 0 && $(".autosize").each((function () {
        resizeTextArea($(this))
    }));
    var e = null;
    $("#signout").click((function (t) {
        t.preventDefault(), Notifi.isDismissed(e) && (e = Notifi.addNotification({
            color: "default",
            title: accountSignOutTitle,
            text: accountSignOutText,
            icon: '<i class="fa fa-sign-out fa-lg"></i>',
            button: '<a href="index.php?action=signout" class="btn btn-success btn-notifi">' + yesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-notifi btn-close-notification">' + cancelOption + "</span>",
            timeout: null
        }))
    })), $((function () {
        $("#scheduler").kendoScheduler({
            date: new Date,
            startTime: new Date,
            height: 600,
            views: ["day", {type: "workWeek", selected: !0}, "week", "month", "agenda", {
                type: "timeline",
                eventHeight: 50
            }],
            timezone: "Etc/UTC",
            dataSource: {
                batch: !0,
                transport: {
                    read: {url: "//demos.telerik.com/kendo-ui/service/tasks", dataType: "jsonp"},
                    update: {url: "//demos.telerik.com/kendo-ui/service/tasks/update", dataType: "jsonp"},
                    create: {url: "//demos.telerik.com/kendo-ui/service/tasks/create", dataType: "jsonp"},
                    destroy: {url: "//demos.telerik.com/kendo-ui/service/tasks/destroy", dataType: "jsonp"},
                    parameterMap: function (e, t) {
                        if ("read" !== t && e.models) return {models: kendo.stringify(e.models)}
                    }
                },
                schema: {
                    model: {
                        id: "taskId",
                        fields: {
                            taskId: {from: "TaskID", type: "number"},
                            title: {from: "Title", defaultValue: "No title", validation: {required: !0}},
                            start: {type: "date", from: "Start"},
                            end: {type: "date", from: "End"},
                            startTimezone: {from: "StartTimezone"},
                            endTimezone: {from: "EndTimezone"},
                            description: {from: "Description"},
                            recurrenceId: {from: "RecurrenceID"},
                            recurrenceRule: {from: "RecurrenceRule"},
                            recurrenceException: {from: "RecurrenceException"},
                            ownerId: {from: "OwnerID", defaultValue: 1},
                            isAllDay: {type: "boolean", from: "IsAllDay"}
                        }
                    }
                }
            },
            resources: [{
                field: "ownerId",
                title: "Owner",
                dataSource: [{text: "Alex", value: 1, color: "#f8a398"}, {
                    text: "Bob",
                    value: 2,
                    color: "#51a0ed"
                }, {text: "Charlie", value: 3, color: "#56ca85"}]
            }]
        }), new resetStar;
        var e = [{type: "regionEntrance", userId: "Bob Saget", regionId: "cid10_chi_lobby"}, {
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
        }], t = function () {
            var t = e[Math.floor(Math.random() * (e.length - 1)) + 1];
            dashboard.$app.trigger("dashboard.messageReceived", t)
        };
        _window.dashboard = {
            $app: $("#app"), dispatcher: setInterval(t, 5e3), endDemo: function () {
                return clearInterval(this.dispatcher)
            }
        }, dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
            console.log(t)
        })), $("#welcome").click(t), dashboard.$app.find(".welcome-component").each((function (e, t) {
            var i = $(t), n = i.data("region"), a = i.data("message-welcome"), r = i.data("message-farewell"), o = [],
                s = [], l = function (e) {
                    return $("<h2></h2>").text(e)
                }, c = function (e) {
                    return s.some((function (t) {
                        return e === t
                    }))
                }, d = function () {
                    o.shift().remove()
                };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (t.regionId !== n) return !0;
                if ("regionEntrance" !== t.type && "regionExit" !== t.type) return !0;
                var h, u = !1, f = t.userId, g = t.type,
                    m = "regionEntrance" === g ? a.replace("{$user}", f) : r.replace("{$user}", f);
                c(f) || "regionEntrance" !== g ? c(f) && "regionExit" === g && (h = l(m), s.splice(s.indexOf(f), 1), function (e) {
                    i.find("h2").each((function (t, i) {
                        var n = $(i);
                        n.data("user") === e && (console.log("activeMessages before", o.length), o.splice(o.indexOf(n), 1), n.remove(), console.log("activeMessages after", o.length))
                    }))
                }(f), u = !0) : (h = l(m).data("user", f), s.push(f), u = !0), u && (i.append(h), o.push(h), setTimeout(d, 7275))
            }))
        })), dashboard.$app.find(".connected-users").each((function (e, t) {
            var i = $(t), n = i.data("region"), a = i.data("message"), r = [], o = function () {
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
            var i = $(t), n = i.data("state"), a = i.data("message-brewed"), r = i.data("message-depleted");
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if ("coffeeBrewed" !== t.type && "coffeeDepleted" !== t.type) return !0;
                if ("coffeeDepleted" === t.type && n === t.type) return !0;
                var o = "coffeeBrewed" === t.type ? a.replace("{$time}", t.when) : r.replace("{$time}", t.when);
                return i.data("state", t.type), i.html(o), !0
            }))
        })), dashboard.$app.find(".conference-rooms").each((function (e, t) {
            var i = $(t), n = i.data("message"), a = i.data("empty-verbiage"), r = i.data("full-verbiage"), o = {};
            i.find("h3").each((function (e, t) {
                o[t.id] = {id: t.id, $el: $(t), name: $(t).data("room-name"), users: []}
            }));
            var s = function (e) {
                var t = o[e], i = n.replace("{$room}", t.name),
                    s = t.users.length > 0 ? i.replace("{$status}", r) : i.replace("{$status}", a);
                t.$el.html(s)
            };
            dashboard.$app.on("dashboard.messageReceived", (function (e, t) {
                if (!function (e) {
                    return ("regionEntrance" === e.type || "regionExit" === e.type) && o.hasOwnProperty(e.regionId)
                }(t)) return !0;
                var i = o[t.regionId], n = i.users.some((function (e) {
                    return t.userId === e
                }));
                "regionEntrance" === t.type ? n || (i.users.push(t.userId), s(i.id)) : "regionExit" === t.type && n && (i.users.splice(i.users.indexOf(t.userId), 1), s(i.id))
            }))
        }))
    }))
}));





const hueBase = 0;
const hueRange = 500;
const segmentCount = 200;
const bubbleCount = 250;
const segmentLengthBase = 1;

const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return abs((t + hm) % m - hm) / hm;
};
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);

let buffer;
let canvas;
let creature;
let bubbles;
let center;
let simplex;

class AttributeArray {
    constructor(count, attrs) {
        this.count = count;
        this.attrs = attrs;
        this.spread = attrs.length;
        this.values = new Float32Array(count * this.spread);
    }

    get length() {
        return this.values.length;
    }

    set(a, i, normalize = false) {
        normalize && (i *= this.spread);

        this.values.set(a, i);
    }

    get(i, normalize = false) {
        normalize && (i *= this.spread);

        return this.values.slice(i, i + this.spread);
    }

    forEach(cb) {
        let i = 0;
        let j = 0;

        for (; i < this.length; i += this.spread, j++) {            cb(this.get(i), j, this)
        }
    }

    map(cb) {
        let i = 0;
        let j = 0;

        for (; i < this.length; i += this.spread, j++) {
            this.set(cb(this.get(i), j, this), i);
        }
    }

    reverseMap(cb) {
        let i = this.length - this.spread;
        let j = this.count - 1;

        for (; i >= 0; i -= this.spread, j--) {
            this.set(cb(this.get(i), j, this), i);
        }
    }}


class Bubbles extends AttributeArray {
    constructor(count) {
        super(count, ['x', 'y', 'vx', 'vy', 's', 'd', 'h', 'l', 'ttl']);

        this.initPoints();
        this.repelTarget = null;
        this.repelThreshold = 200;
    }

    setRepelTarget(target = null) {
        this.repelTarget = target;
    }

    initPoints() {
        this.map(() => [
            random(-0.25 * windowWidth, windowWidth * 1.25),
            random(windowHeight * 1.25),
            random(-2, 2),
            random(-4, -1),
            random(2, 6),
            random(2, 6),
            random(180, 240),
            random(0, 200),
            random(500, 1000)]);

    }

    reset() {
        return [
            random(-0.25 * windowWidth, windowWidth * 1.25),
            random(windowHeight * 1.25),
            0,
            random(-4, -1),
            random(2, 6),
            random(2, 6),
            random(180, 240),
            0,
            random(500, 1000)];

    }

    drawParticle(x, y, d, h, l, ttl) {
        const ld = fadeInOut(l, ttl);

        buffer.stroke(h, 50, 100, 0.5 * ld);
        buffer.strokeWeight(1 + d * ld);
        buffer.point(x, y);
    }

    update() {
        this.map(([x, y, vx, vy, s, d, h, l, ttl]) => {
            const n = simplex.noise3D(x * 0.0015, y * 0.0015, frameCount * 0.0015) * TAU;

            vx = lerp(vx, cos(n) * s, 0.15);
            vy = lerp(vy, (sin(n) + 2) * -s, 0.15);

            if (
                this.repelTarget &&
                dist(x, y, ...this.repelTarget) < this.repelThreshold)
            {
                const theta = angle(x, y, ...this.repelTarget);

                vx = lerp(vx, vx - cos(theta) * s, 0.275);
                vy = lerp(vy, vy - sin(theta) * s, 0.275);
            }


            x = lerp(x, x + vx, 0.125);
            y = lerp(y, y + vy, 0.125);

            l++;

            this.drawParticle(x, y, d, h, l, ttl);

            if (
                l > ttl ||
                x > windowWidth + d ||
                x < -d ||
                y < -d)
            {
                return this.reset();
            }

            return [x, y, vx, vy, s, d, h, l, ttl];
        });
    }}


class Chain extends AttributeArray {
    constructor(x, y, segmentNum, baseLength, baseDirection, additionalAttrs = []) {
        super(segmentNum, ['x1', 'y1', 'x2', 'y2', 'l', 'd', ...additionalAttrs]);

        this.position = [x, y];
        this.target = [x, y];
        this.baseLength = baseLength;
        this.baseDirection = baseDirection;
    }

    get segmentNum() {
        return this.count;
    }

    setTarget(arg) {
        if (typeof arg === 'function') {
            this.target = arg(this.target);
        } else {
            this.target = arg;
        }
    }

    setPosition(arg) {
        if (typeof arg === 'function') {
            this.position = arg(this.position);
        } else {
            this.position = arg;
        }
    }

    mapSegments(cb, direction = 'forward') {
        if (direction === 'backward') {
            this.reverseMap(cb);
        } else {
            this.map(cb);
        }
    }

    updateSegments(cb, direction = 'forward') {
        let target = this.position;

        this.mapSegments(([x1, y1, x2, y2, l, d, ..._rest], i) => {
            x1 = target[0];
            y1 = target[1];

            const [t, ...rest] = cb([x1, y1, x2, y2, l, d, ..._rest], i);
            const _d = isNaN(t) ? d : t;

            x2 = x1 + l * cos(_d);
            y2 = y1 + l * sin(_d);

            target = [x2, y2];

            return [x1, y1, x2, y2, l, _d, ...rest];
        }, direction);
    }}


class Creature extends Chain {
    constructor() {
        super(
            center[0],
            center[1],
            segmentCount,
            segmentLengthBase,
            0,
            ['h']);


        this.follow = false;

        this.initSegments();
    }

    initSegments() {
        let x1, y1, x2, y2, l, d, h;

        l = this.baseLength;
        d = this.baseDirection;

        this.mapSegments((_, i) => {
            x1 = x2 || this.position[0];
            y1 = y2 || this.position[1];
            x2 = x1 - l * cos(d);
            y2 = y1 - l * sin(d);
            d += 0.1;
            l *= 1.01;
            h = hueBase + fadeOut(i, this.segmentNum) * hueRange;

            return [x1, y1, x2, y2, l, d, h];
        });
    }

    updateTarget() {
        if (!this.follow) {
            const t = simplex.noise3D(
                    this.target[0] * 0.005,
                    this.target[1] * 0.005,
                    frameCount * 0.005) *
                TAU;

            this.setTarget([
                lerp(
                    this.target[0],
                    this.target[0] + 20 * (cos(t) + cos(frameCount * 0.05)),
                    0.25),

                lerp(
                    this.target[1],
                    this.target[1] + 20 * (sin(t) + sin(frameCount * 0.05)),
                    0.25)]);


        }

        if (
            this.position[0] > windowWidth + 500 ||
            this.position[0] < -500 ||
            this.position[1] > windowHeight + 500 ||
            this.position[1] < -500)
        {
            this.setTarget([...center]);
        }
    }

    update() {
        this.setPosition([
            lerp(this.position[0], this.target[0], 0.015),
            lerp(this.position[1], this.target[1], 0.015)]);


        this.updateTarget();
        this.updateSegments(([x1, y1, x2, y2, l, d, h], i) => {
            let n;

            n = simplex.noise3D(
                x1 * 0.005,
                y1 * 0.005,
                (i + frameCount) * 0.005);

            d = angle(x1, y1, x2, y2) + n * 0.075;

            this.drawSegment(x1, y1, x2, y2, h, n, d, i);

            return [d];
        }, 'backward');
    }

    drawSegment(x1, y1, x2, y2, h, n, tn, i) {
        const arcWidth = 6 + 30 * fadeIn(i, this.segmentNum);
        const lineLength = 1.35 * arcWidth;
        const lineLeftX = x1 + lineLength * cos(tn + 0.85 + n);
        const lineLeftY = y1 + lineLength * sin(tn + 0.85 + n);
        const lineRightX = x1 + lineLength * cos(tn - 0.85 - n);
        const lineRightY = y1 + lineLength * sin(tn - 0.85 - n);
        const nubWidth = arcWidth * 0.35;

        buffer.strokeWeight(1 + fadeIn(i, this.segmentNum) * 4);
        buffer.stroke(h, 100, 100, 0.1);
        buffer.noFill();

        buffer.line(
            x1,
            y1,
            lineLeftX,
            lineLeftY);

        buffer.ellipse(lineLeftX, lineLeftY, nubWidth);

        buffer.line(
            x1,
            y1,
            lineRightX,
            lineRightY);

        buffer.ellipse(lineRightX, lineRightY, nubWidth);

        buffer.line(x2, y2, x1, y1);
        buffer.ellipse(x1, y1, arcWidth);
    }}


function setup() {
    buffer = createGraphics(windowWidth, windowHeight);
    buffer.colorMode(HSB);

    canvas = createCanvas(windowWidth, windowHeight);
    canvas.mouseOver(mouseOver);
    canvas.mouseOut(mouseOut);

    frameRate(60);

    simplex = new SimplexNoise();
    center = [0.5 * windowWidth, 0.5 * windowHeight];

    creature = new Creature();
    bubbles = new Bubbles(bubbleCount);
}

function drawGlow() {
    drawingContext.save();
    drawingContext.filter = 'blur(6px) brightness(200%)';
    image(buffer, 0, 0);
    drawingContext.restore();
}

function drawImage() {
    drawingContext.save();
    drawingContext.globalCompositeOperation = 'lighter';
    image(buffer, 0, 0);
    drawingContext.restore();
}

function draw() {
    buffer.background(220, 70, 2);

    try {
        creature.update();
        bubbles.setRepelTarget(creature.position);
        bubbles.update();

        drawGlow();
        drawImage();
    } catch (e) {
        console.error(e);
        noLoop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    buffer.resizeCanvas(windowWidth, windowHeight);

    center = [0.5 * windowWidth, 0.5 * windowHeight];
}

function mouseMoved() {
    creature.setTarget([
        mouseX,
        mouseY]);

}

function mouseOut() {
    creature.follow = false;
}

function mouseOver() {
    creature.follow = true;
}

