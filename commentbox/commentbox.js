; (function ($, window, document, undefined) {
    //定义构造函数    
    var CommentBox = function (ele, opt) {
        this.$element = $(ele);
        this.options = $.extend(true, {}, $.fn.commentbox.defaults, typeof opt === "object" ? opt : {});

        //return this.init();
    }

    var baseUrl = 'commentbox.js';

    var params = {
        dir: ['mr'],
        descriptions: [
            ['再见', '给力', '色', '恭喜', '厉害', '愤怒', '皱眉', '爱心', '可怜', '哈欠',
            '大笑', '勾引', '互粉', '流汗', '囧', '抠鼻', '眯招呼', '开心', '放鞭炮', '祈福',
            '无聊', '酷', '礼物', '鞭炮', '红灯笼', '转圈', '贺喜', '激动', '爱你', '鄙视',
            '兴奋', '抓狂', '钱', '红包', '偷笑', '点头', '衰', 'ok', '奥特曼', '话筒',
            '骂', 'no', '拍手', '委屈', '45', '46', '47', '48', '49', '50',
            '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
            '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
            '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
            '81', '82', '83', '84']
        ],
        images: [
            ['0', '1', '2', '3', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
            '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
            '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
            '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
            '81', '82', '83', '84']
        ]
    };

    var method = {
        getPath: function () {
            var allscripts = document.scripts || document.getElementsByName('script');
            var jsPath;
            for (var i = allscripts.length; i > 0; i--) {
                if (allscripts[i - 1].src.indexOf(baseUrl) > -1) {
                    jsPath = allscripts[i - 1].src.substring(0, allscripts[i - 1].src.lastIndexOf("/") + 1);
                }
            }
            return jsPath;
        },
        insertText: function (obj, str) {
            obj.focus();
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            } else {
                obj.value += str;
            }
        },
        moveEnd: function (obj) {
            obj.focus();
            var len = obj.value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        },
        createEmotionPanel: function (i) {
            var panel = [];
            for (var j = 0; j < params.images[i].length; j++) {
                var domStr = '<span>'
                           + '  <img src="' + method.getPath() + 'images/' + params.dir[i] + '/' + params.images[i][j] + '.gif" alt="' + params.images[i][j] + '" title="' + params.descriptions[i][j] + '" />'
                           + '</span>';
                panel.push(domStr);
            }
            return panel.join('');
        },
        setChars: function (max) {
            var inputbox = document.getElementsByName('commentbox_text')[0];
            if (document.all) {
                inputbox.onpropertychange = function () {
                    $('.commentbox .chars em').text(max - this.value.length);
                }
            } else {
                inputbox.oninput = function () {
                    $('.commentbox .chars em').text(max - this.value.length);
                };
            }
        }
    };

    var openmethod = {
        getContent: function (jq) {
            var content = jq.find('textarea')[0].value;

            //替换文字为图片
            var domStr = '<img src="' + method.getPath() + 'images/' + params.dir[0] + '/$1.gif" />',
                reg = /\[([^\]]+)\]/g,
                dangerReg = /\<script\>/g; //过滤危险字符
            return content.replace(reg, domStr);
        },
        setContent: function (jq, str) {
            var opts = $._data(jq[0], "commentbox").options;
            var curCharNum = opts.maxLimits - str.length;
            curCharNum = curCharNum < 0 ? 0 : curCharNum;

            jq.find('textarea')[0].value = str;
            jq.find('.chars em').text(curCharNum);
            if (str.length === 0) {
                jq.find('.btnpublish').attr('data-execing', '0');
            }
        }
    };

    function bindEvent() {
        //关闭表情panel
        $(document).on('click', function (e) {
            var t = event.srcElement ? event.srcElement : event.target;
            if (!$(t).hasClass('emotion_panel')) {
                var ep = $('.emotion_panel');
                if (ep.css('display') !== 'none') ep.hide();
            }
            //e.stopPropagation();
        });
    };

    //定义方法    
    CommentBox.prototype = {
        init: function () {
            var opts = this.options,
                boxbody = [];

            var box = $('<div class="commentbox" />'),
                inputbox = $('<div class="box" />'),
                funcbox = $('<div />'),
                clearbox = $('<div style="clear:both" />');

            var charspan = $('<span class="chars">还可输入<em></em>个字</span>'),
                btnspan = $('<span class="btn" />'),
                facespan = $('<div class="face"><a></a><div class="emotion_panel"></div></div>'),
                picspan = $('<span class="pic" />'),
                publishBtn = $('<input type="button" data-execing="0" class="btnpublish ' + (opts.buttonClass || '') + '" />'),
                contentInput = $('<textarea placeholder="' + opts.placeholderText + '" name="commentbox_text" onpaste="this.value=(this.value.length>200?this.value.substr(0, 200):this.value)" maxlength="' + opts.maxLimits + '" class="txtContent"></textarea>');

            //设置参数
            charspan.find('em').text(opts.maxLimits);
            publishBtn.val(opts.buttonText).unbind('click').on('click', opts.publishBtnFunc);
            facespan.on('click', function (e) {
                var $this = $(this);
                var $panel = $(this).find('.emotion_panel');
                if ($panel.css('display') === 'none') {
                    var html = $panel.html();
                    $panel.html(html || method.createEmotionPanel(0)).show();
                };

                var scrollTop=0;    
                if (document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrollTop = document.body.scrollTop;
                };

                var k = $(window).height() - ($this.offset().top - scrollTop) - $this.height();
                if (k < 210) {
                    $panel.addClass('emotion_panel_p');
                } else {
                    if ($panel.hasClass('emotion_panel_p')) $panel.removeClass('emotion_panel_p');
                }

                e.stopPropagation();
            });
            contentInput.on('blur', function () {
                var content = document.getElementsByName('commentbox_text')[0],
                    len = opts.maxLimits - content.value.length;
                if (len<0) {
                    content.value = content.value.substr(0, opts.maxLimits);
                    len = 0;
                }
                $('.commentbox .chars em').text(len);
            });

            //组装
            btnspan.append(publishBtn);
            inputbox.append(contentInput);
            funcbox.append(charspan).append(btnspan);
            if (opts.showFaceBtn) { funcbox.append(facespan); };
            if (opts.showPicBtn) { funcbox.append(picspan); };
            box.append(inputbox).append(funcbox).append(clearbox);

            this.$element.html(box).find('.emotion_panel')
                .on('click', 'img', function () {
                    var text = '[' + $(this).attr('alt') + ']',
                        domInput = document.getElementsByName('commentbox_text');
                    method.insertText(domInput[0], text);
                    $('.emotion_panel').hide();
                    $(domInput).trigger('blur');
                    return false;
                });

            bindEvent();

            method.setChars(opts.maxLimits);

            return this.$element;
        }
    };
    //在插件中使用对象    
    $.fn.commentbox = function (options, args) {
        if (typeof options === "string") return openmethod[options](this, args);
        return this.each(function () {
            //读取缓存
            var $ele = $._data(this, "commentbox");
            //不存在则创建
            if (!$ele) {
                $ele = new CommentBox(this, options);
                //缓存
                $._data(this, "commentbox", $ele);

                $ele.init();
            }

            //调用方法
            //if (typeof options === "string" && typeof $ele[options] == "function") {
            //    $ele[options].apply($ele, arguments);
            //}
        });
    }

    //默认
    $.fn.commentbox.defaults = {
        maxLimits: 200,
        buttonText: '发表评论',
        buttonClass: '',
        placeholderText: '输入评论内容',
        showPicBtn: false,
        showFaceBtn: true,
        publishBtnFunc: function () { },
        onFocus: function () { }
    };

})(jQuery, window, document);