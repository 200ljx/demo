/*
 * add by 李俊贤
 * 扩展jquery
 * jquery版本 1.10及以上
 */
(function ($) {
    /*
     * 将表单结果序列化为JSON
     * options: {
            ignore: ["name列表"]
     * }
     */
    $.fn.serializeJson = function (options) {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (options && options.ignore && $.isArray(options.ignore)) {
                if ($.inArray(this.name, options.ignore) === -1) {
                    if (serializeObj[this.name]) {
                        if ($.isArray(serializeObj[this.name])) {
                            serializeObj[this.name].push(this.value);
                        } else {
                            serializeObj[this.name] = [serializeObj[this.name], this.value];
                        }
                    } else {
                        serializeObj[this.name] = $.trim(this.value);
                    }
                }
            } else {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                } else {
                    serializeObj[this.name] = $.trim(this.value);
                }
            }
        });
        return serializeObj;
    };
    /*
     * 获取url参数
     */
    $.Params = (function () {
        var reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = window.location.search.substr(1),
            ret = {};
        if (arr_url) {
            var result;
            while ((result = reg_para.exec(arr_url)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    })();
    /*
     * 判断浏览器类型及版本号
     * 获取类型 if($.myBrowser.ie) alert("ie浏览器");
     * 获取浏览器版本号 if($.myBrowser.ie && $.myBrowser.ie == "6.0") alert("ie6浏览器");
     */
    $.myBrowser = (function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        return Sys;
    })();
    /*
     * 判断浏览器版本
     * @params obj  浏览器类型及对应处理方法的对象
     * { 
     *      ie:  function(){}, //ie其他版本执行
     *      safari: function(){}, //苹果浏览器
     *      opera: function(){}, //opera浏览器
     *      chrome: function(){}, //谷歌浏览器
     *      firefox: function(){}, //火狐浏览器
     *      all: function(){}, //所有版本都执行的方法
     *      other: function(){} //其他浏览器执行
     * }
     */
    $.browserAction = function (obj) {
        var _browser = $.myBrowser;
        if (_browser.ie) {
            if (obj && obj.ie) obj.ie();
        } else if (_browser.safari) {
            if (obj && obj.safari) obj.safari();
        } else if (_browser.opera) {
            if (obj && obj.opera) obj.opera();
        } else if (_browser.chrome) {
            if (obj && obj.chrome) obj.chrome();
        } else if (_browser.firefox) {
            if (obj && obj.firefox) obj.firefox();
        } else {
            if (obj && obj.other) obj.other();
        };
        if (obj && obj.all) obj.all();
    };
    
})(jQuery);