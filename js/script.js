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
    var token = '';
    setInterval(function () {
        $.ajax({
            cache: false,
            data: {
                token: token,
            },
            timeout: 2500,
            type: 'GET',
            url: './api.php?ping',
            dataType: 'json',
            success: function (data, status, jqXHR) {
                $('#userCount').text(data.userCount);
                token = data.token;
            }
        });
    }, 5000);
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

!function (t, i) {
    "use strict";

    function e() {
        var t = "", i = "abcdefghijklmnopqrstuvwxyz0123456789";
        do {
            t = "";
            for (var e = 0; 5 > e; e++) t += i.charAt(Math.floor(Math.random() * i.length))
        } while (m.exists(t));
        return t
    }

    function n(i) {
        var e = i.target ? i.target : i.toElement;
        if ("notifi-wrapper" !== e.getAttribute("id")) {
            for (var n = !1; !c(e, "notifi-notification");) c(e, "notifi-close") && (n = !0), c(e, "btn-close-notification") && (n = !0), e = e.parentElement;
            var o = e.getAttribute("id");
            if (o = /notifi-notification-([a-zA-Z0-9]+)/.exec(o)[1], n && m.notifications[o].options.dismissable) m.removeNotification(o); else {
                var a = m.notifications[o].action;
                if (void 0 === a || null === a) return;
                "string" == typeof a ? t.location = a : "function" == typeof a ? a(o) : (console.log("Notifi Error: Invalid click action:"), console.log(a))
            }
        }
    }

    function o(t) {
        if (void 0 === m.notifications[t] && (m.notifications[t] = {}), null === m.notifications[t].element || void 0 === m.notifications[t].element) {
            var e = u.cloneNode(!0);
            s(e, "notifi-notification"), e.setAttribute("id", "notifi-notification-" + t), m.notifications[t].element = e
        }
        if (null === m.notifications[t].element.parentElement) {
            var n = i.getElementById("notifi-wrapper");
            i.body.clientWidth > 480 ? n.appendChild(m.notifications[t].element) : n.insertBefore(m.notifications[t].element, n.firstChild)
        }
    }

    function a(t, i) {
        var e, n = {};
        for (e in t) n[e] = t[e];
        for (e in i) n[e] = i[e];
        return n
    }

    function s(t, i) {
        c(t, i) || (t.className += " " + i)
    }

    function c(t, i) {
        var e = new RegExp("(?:^|\\s)" + i + "(?!\\S)", "g");
        return null !== t.className.match(e)
    }

    function r(t, i) {
        var e = new RegExp("(?:^|\\s)" + i + "(?!\\S)", "g");
        t.className = t.className.replace(e, "")
    }

    function l() {
        return "ontouchstart" in t || "onmsgesturechange" in t
    }

    function f() {
        var t = i.createElement("div");
        t.setAttribute("id", "notifi-wrapper"), t.addEventListener("click", n), i.body.appendChild(t), m.setNotificationHTML('<div class="notifi-notification"><div class="notifi-icon"></div><h3 class="notifi-title"></h3><p class="notifi-text"></p><p class="notifi-button"></p><div class="notifi-close"><i class="fa fa-times"></i></div></div>')
    }

    var m = m || {};
    m = {
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
        setDefaultOptions: function (t) {
            m.defaultOptions = a(m.defaultOptions, t)
        },
        setNotificationHTML: function (t) {
            var e = i.createElement("div");
            e.innerHTML = t;
            var n = e.firstChild;
            e.removeChild(n), u = n
        },
        addNotification: function (t) {
            m.count += 1;
            var i = e();
            return o(i), m.editNotification(i, t), i
        },
        editNotification: function (t, i) {
            null !== m.notifications[t].removeTimer && (clearTimeout(m.notifications[t].removeTimer), m.notifications[t].removeTimer = null), o(t), i = i || {}, void 0 === m.notifications[t].options && (m.notifications[t].options = m.defaultOptions), i = a(m.notifications[t].options, i);
            var e = m.notifications[t].element;
            s(e, i.color);
            var n = e.getElementsByClassName("notifi-title")[0];
            i.title ? (n.textContent = i.title, r(e, "notifi-no-title")) : (n.textContent = "", s(e, "notifi-no-title"));
            var c = e.getElementsByClassName("notifi-text")[0];
            i.text ? (c.textContent = i.text, r(e, "notifi-no-text")) : (c.textContent = "", s(e, "notifi-no-text"));
            var f = e.getElementsByClassName("notifi-icon")[0];
            i.icon ? (f.innerHTML = i.icon, r(e, "notifi-no-icon")) : (f.innerHTML = "", s(e, "notifi-no-icon")), null !== i.timer && clearTimeout(m.notifications[t].timer);
            var u = null;
            null !== i.timeout && (u = setTimeout(function () {
                m.removeNotification(t)
            }, i.timeout)), m.notifications[t].timer = u, m.notifications[t].action = i.action;
            var d = e.getElementsByClassName("notifi-button")[0];
            i.button ? d.innerHTML = i.button : d.innerHTML = "", i.dismissable ? r(e, "not-dismissable") : s(e, "not-dismissable"), setTimeout(function () {
                s(e, "notifi-in"), e.removeAttribute("style")
            }, 0), l() && s(e, "no-hover"), m.notifications[t].options = i
        },
        reOpenNotification: function (t) {
            m.editNotification(t)
        },
        removeNotification: function (t) {
            if (m.isDismissed(t)) return !1;
            var e = m.notifications[t].element;
            return r(e, "notifi-in"), i.body.clientWidth > 480 ? e.style.marginBottom = -e.offsetHeight + "px" : e.style.marginTop = -e.offsetHeight + "px", m.notifications[t].removeTimer = setTimeout(function () {
                e.parentElement.removeChild(e)
            }, 500), clearTimeout(m.notifications[t].timer), !0
        },
        isDismissed: function (t) {
            return m.exists(t) ? null === m.notifications[t].element.parentElement : !0
        },
        exists: function (t) {
            return void 0 !== m.notifications[t]
        },
        setTitle: function (t, i) {
            m.editNotification(t, {title: i})
        },
        setText: function (t, i) {
            m.editNotification(t, {text: i})
        },
        setIcon: function (t, i) {
            m.editNotification(t, {icon: i})
        },
        setTimeout: function (t, i) {
            m.editNotification(t, {timeout: i})
        }
    };
    var u = null;
    !function () {
        "complete" === i.readyState || "interactive" === i.readyState && i.body ? f() : i.addEventListener ? i.addEventListener("DOMContentLoaded", function () {
            i.removeEventListener("DOMContentLoaded", null, !1), f()
        }, !1) : i.attachEvent && i.attachEvent("onreadystatechange", function () {
            "complete" === i.readyState && (i.detachEvent("onreadystatechange", null), f())
        })
    }(), t.Notifi = m
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


$("form :input[required='required']").blur(function () {
    if (!$(this).val()) {
        $(this).addClass('hasError');
    } else {
        if ($(this).hasClass('hasError')) {
            $(this).removeClass('hasError');
        }
    }
});
$("form :input[required='required']").change(function () {
    if ($(this).hasClass('hasError')) {
        $(this).removeClass('hasError');
    }
});

if ($(".autosize").length > 0) {
    $(".autosize").each(function () {
        resizeTextArea($(this));
    });
}

var signoutNotification = null;
$('#signout').click(function (e) {
    e.preventDefault();
    if (Notifi.isDismissed(signoutNotification)) {
        signoutNotification = Notifi.addNotification({
            color: 'default',
            title: accountSignOutTitle,
            text: accountSignOutText,
            icon: '<i class="fa fa-sign-out fa-lg"></i>',
            button: '<a href="index.php?action=signout" class="btn btn-success btn-notifi">' + yesOption + '</a> <span id="cancel-signout" class="btn btn-warning btn-notifi btn-close-notification">' + cancelOption + '</span>',
            timeout: null
        });
    }
});

sssl(['./js/includes/newNote.js', './js/includes/newTask.js', './js/includes/notes.js', './js/includes/profile.js', './js/includes/signIn.js', './js/includes/signOut.js', './js/includes/viewNote.js', './js/includes/viewTask.js'], function () {
});


$(".btn").click(function () {
    setTimeout(5000, function () {
        $('html').addClass('login');
        alert("activating demo login!")
    })
});