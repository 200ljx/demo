/*
 * add by ljx
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


/*
 * create by ljx
 * 2015.12.19
 * 2016.1.6 集成弹出框插件layer.js配置
 * 2016.1.9 添加日期格式扩展
 * 2016.1.14 扩展jquery fn，添加方法（asyncGet请求内容并加载到其中， nodata添加无数据占位div）
 */
; (function ($, window, undefined) {
    var HSZY = (function () {
        var HSZY = function (selector) {
            return $(selector);
        };

        $.extend(HSZY, {
            //插件配置
            pluginConfig: {
                layer: { //弹出插件
                    path: '/script/develop/layer/'
                },
                share: {
                    path: 'http://v3.jiathis.com/code/jia.js'
                }
            },
            //请求配置
            serverConfig: {
                timeout: 100000,
                status: {
                    'timeout': '请求超时',
                    'error': '请求失败',
                    'parsererror': '无法解析为指定的格式'
                },
                //请求地址
                url: {
                    login: '/ashx/Bage.ashx', //登录
                    logout: '/ashx/PersonalCenter.ashx?type=34' //登出
                }
            },

            /*
				url: 请求地址
				data: 数据
				successfunc: 成功后执行，传入请求的返回值
				errorfunc: 错误后执行，传入错误提示
				btnset: 请求的发起按钮设置，{id:'按钮id', beforeText: '点击前显示文字', afterText: '请求中显示文字'}
			*/
            post: function (url, data, successfunc, errorfunc, btnset, dataType) {
                var _this = this;
                return $.ajax({
                    url: url,
                    data: data,
                    type: 'post',
                    cache: false,
                    dataType: dataType || 'json',
                    timeout: _this.serverConfig.timeout,
                    beforeSend: function () {
                        if (btnset && btnset.$btn) {
                            var btn = btnset.$btn;
                            btn.val(btnset.afterText || '').prop('disabled', true);
                        };
                    },
                    complete: function () {
                        setTimeout(function () {
                            if (btnset && btnset.$btn) {
                                var btn = btnset.$btn;
                                btn.val(btnset.beforeText || '').prop('disabled', false);
                                btn.attr('data-execing', '0');
                            };
                        }, 1000);
                    },
                    success: function (data) {
                        successfunc && successfunc(data);
                    },
                    error: function (xhr, st, msg) {
                        var errormsg;
                        if (_this.serverConfig.status[st]) {
                            errormsg = _this.serverConfig.status[st];
                        } else {
                            errormsg = '请求失败';
                        }
                        if (errormsg && errorfunc) errorfunc(errormsg);
                    }
                });
            },
            /*
             * 异步get
             * @param url 请求地址
             * @param data 请求数据
             * @param successfunc 请求成功执行的方法
             * @param errorfunc 请求失败执行的方法
             * @param datatype 返回数据类型  默认json
             */
            asyncGet: function (url, data, successfunc, errorfunc, datatype) {
                var _this = this;
                return $.ajax({
                    url: url,
                    data: data,
                    type: 'get',
                    cache: false,
                    dataType: datatype || 'json',
                    timeout: _this.serverConfig.timeout,
                    success: successfunc,
                    error: function (xhr, st, msg) {
                        var errormsg;
                        if (_this.serverConfig.status[st]) {
                            errormsg = _this.serverConfig.status[st];
                        } else {
                            errormsg = '请求失败';
                        }
                        if (errormsg && errorfunc) errorfunc(errormsg);
                    }
                });
            },
            /*
             * 是否连续提交, 接收一个jq对象
             */
            isSubmitMuch: function ($this) {
                var _execing = $this.attr('data-execing');
                if (!_execing || _execing == '0') {//防止连续提交
                    $this.attr('data-execing', '1');
                    return false;
                } else {
                    return true;//是连续提交
                }
            },
            /* 获取验证码
			 设置按钮倒计时
			 _this: 指代按钮本身
			 expire: 倒计时时长（秒） 
			 */
            setBtnWait: function (_this, expire) {
                _this.setAttribute("disabled", true);
                _this.value = "重新获取" + "(" + expire-- + ")";
                var intervalId = setInterval(function () {
                    if (expire <= 0) {
                        _this.removeAttribute("disabled");
                        _this.value = "获取验证码";
                        clearInterval(intervalId);
                    } else {
                        _this.setAttribute("disabled", true);
                        _this.value = "重新获取" + "(" + expire-- + ")";
                    }
                }, 1000);
            },
            setWait: function (_this, expire) {
                if (!_this.getAttribute("data-waiting") || _this.getAttribute("data-waiting") == '0') {
                    _this.setAttribute("data-waiting", '1');
                    expire--;
                    var intervalId = setInterval(function () {
                        if (expire <= 0) {
                            _this.setAttribute("data-waiting", '0');
                            clearInterval(intervalId);
                        } else {
                            expire--;
                        }
                    }, 1000);
                    return true;
                } else {
                    if (window.layer) {
                        window.layer.msg('您操作太频繁了，休息一会儿再操作吧', { time: 1000 });
                    }
                    return false;
                };
            },
            /*
             * 判断是否登录
             * @param loginFunc 已登录执行的方法
             * @param nologinFunc 未登录执行的方法
             * @param errorFunc 登录请求失败执行的方法
             */
            afterLogin: function (loginFunc, nologinFunc, errorFunc) {
                this.asyncGet(this.serverConfig.url.login, null, function (login) {
                    if (login && login.Status == '0' && login.info) {
                        loginFunc && $.isFunction(loginFunc) && loginFunc(login.info);
                    } else {
                        nologinFunc && $.isFunction(nologinFunc) && nologinFunc();
                    }
                }, function () {
                    errorFunc && $.isFunction(errorFunc) && errorFunc();
                });
            },
            /*
             * 退出系统
             * @param logoutFunc 成功退出执行的方法
             * @param failFunc 退出失败的方法
             * @param errorFunc 请求错误执行的方法
             */
            logOut: function (logoutFunc, failFunc, errorFunc) {
                //请求
                $.ajax({
                    url: this.serverConfig.url.logout,
                    async: true,
                    cache: false,
                    beforeSend: function(){},
                    complete: function () {},
                    success: function () {
                        logoutFunc && $.isFunction(logoutFunc) && logoutFunc();
                    },
                    error: function () {
                        if (window.layer) {
                            layer.msg('退出失败', { time: 2000 }, function () {
                                errorFunc && $.isFunction(errorFunc) && errorFunc();
                            });
                        }
                    }
                });
            },
            //获取url参数
            params: (function () {
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
            })(),
            //动态添加js文件
            addScript: function (id, src) {
                var scriptObj = document.createElement("script");
                scriptObj.src = src;
                scriptObj.type = "text/javascript";
                scriptObj.id = id;
                document.getElementsByTagName("head")[0].appendChild(scriptObj);
            },
            //添加分享工具条
            addSharebar: function (selector) {
                var shareHtml = [];
                shareHtml.push('<!-- JiaThis Button BEGIN -->');
                shareHtml.push('<span class="mysharebar jiathis_style">');
                shareHtml.push('    <a class="jiathis_button_weixin"></a>');
                shareHtml.push('    <a class="jiathis_button_tsina"></a>');
                shareHtml.push('</span>');
                shareHtml.push('<!-- JiaThis Button END -->');
                $(selector).append(shareHtml.join(''));
                this.addScript('sharebar', this.pluginConfig.share.path);
            },
            //弹出登录框
            alertLogin: function (url) {
                if (window.layer) {
                    window.layer.open({
                        type: 2,
                        title: false,
                        shadeClose: true,
                        shade: 0.8,
                        area: ['456px', '300px'],
                        content: [url, 'no'] //iframe的url
                    });
                }
            },
            /*
             * 截取字符串
             * str要截取的字符串
             * num长度
             * adddots 是否添加省略号
             */
            cutStr: function (str, num, adddots) {
                var newstr = '';
                if (typeof str === 'string' && typeof num === 'number') {
                    newstr = str.length > num ? (str.substring(0, num) + (adddots? '...':'')) : str;
                }
                return newstr;
            }
        });

        //jquery原型扩展
        $.fn.extend({
            post: function (url, data, successfunc, errorfunc, dataType) {
                var _this = this;
                return $.ajax({
                    url: url,
                    data: data,
                    type: 'post',
                    cache: false,
                    dataType: dataType || 'json',
                    timeout: HSZY.serverConfig.timeout,
                    beforeSend: function () {
                        _this.attr('data-execing', '1');
                    },
                    complete: function () {
                        setTimeout(function () {
                            _this.attr('data-execing', '0');
                        }, 1000);
                    },
                    success: function (data) {
                        successfunc(data, _this)
                    },
                    error: function (xhr, st, msg) {
                        var errormsg;
                        if (HSZY.serverConfig.status[st]) {
                            errormsg = HSZY.serverConfig.status[st];
                        } else {
                            errormsg = '请求失败';
                        }
                        if (errormsg && errorfunc) errorfunc(errormsg, _this);
                    }
                });
            },
            //参数同HSZY.asyncGet方法
            asyncGet: function (url, data, successfunc, errorfunc, datatype) {
                var _this = this;
                return $.ajax({
                    url: url,
                    data: data,
                    type: 'get',
                    cache: false,
                    dataType: datatype || 'json',
                    timeout: HSZY.serverConfig.timeout,
                    beforeSend: function () {
                        _this.html('').addClass('loading');
                    },
                    complete: function () {
                        _this.removeClass('loading');
                    },
                    success: function (data) {
                        successfunc(data, _this);
                    },
                    error: function (xhr, st, msg) {
                        var errormsg;
                        if (HSZY.serverConfig.status[st]) {
                            errormsg = HSZY.serverConfig.status[st];
                        } else {
                            errormsg = '请求失败';
                        }
                        if (errormsg && errorfunc) errorfunc(errormsg, _this);
                    }
                });
            },
            asyncGet2: function (url, data, options) {
                var _this = this,
                    datatype = options && options.datatype ? options.datatype : 'json',
                    successfunc = options && options.successfunc ? options.successfunc : null,
                    errorfunc = options && options.errorfunc ? options.errorfunc : null,
                    isShowLoading = options && (typeof options.isShowLoading == 'boolean') ? options.isShowLoading : true;
                return $.ajax({
                    url: url,
                    data: data,
                    type: 'get',
                    cache: false,
                    dataType: datatype,
                    timeout: HSZY.serverConfig.timeout,
                    beforeSend: function () {
                        if (isShowLoading && !_this.hasClass('loading')) {
                            _this.html('').addClass('loading');
                        }
                    },
                    complete: function () {
                        if (_this.hasClass('loading')) _this.removeClass('loading');
                    },
                    success: function (data) {
                        typeof successfunc == 'function' && successfunc(data, _this);
                    },
                    error: function (xhr, st, msg) {
                        var errormsg;
                        if (HSZY.serverConfig.status[st]) {
                            errormsg = HSZY.serverConfig.status[st];
                        } else {
                            errormsg = '请求失败';
                        }
                        if (errormsg && errorfunc) typeof errorfunc == 'function' && errorfunc(errormsg, _this);
                    }
                });
            },
            afterLogin: function (loginFunc, nologinFunc, errorFunc) {
                var _this = this;
                return $.ajax({
                    url: HSZY.serverConfig.url.login,
                    type: 'get',
                    dataType: 'json',
                    timeout: HSZY.serverConfig.timeout,
                    cache: false,
                    beforeSend: function () {
                        _this.html('').addClass('loading_small');
                    },
                    complete: function () {
                        _this.removeClass('loading_small');
                    },
                    success: function (login) {
                        if (login && login.Status == '0' && login.info) {
                            loginFunc && $.isFunction(loginFunc) && loginFunc(login.info, _this);
                        } else {
                            nologinFunc && $.isFunction(nologinFunc) && nologinFunc(_this);
                        }
                    },
                    error: function () {
                        errorFunc && $.isFunction(errorFunc) && errorFunc(_this);
                    }
                });
            },
            /*
             * 添加无数据占位div
             * @params msg 占位提示内容，默认‘暂无数据’
             */
            nodata: function (msg) {
                var _this = this;
                return this.each(function () {
                    _this.html('<div class="nodata">' + (msg || '暂无数据') + '</div>');
                })
            }
        });

        //配置layer.js
        if (window.layer) {
            window.layer.config({
                path: HSZY.pluginConfig.layer.path //layer.js所在的目录，可以是绝对目录，也可以是相对目录
            });
        }

        //扩展日期
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        return HSZY;
    })();
    window.HSZY = HSZY;
})(jQuery, window);
