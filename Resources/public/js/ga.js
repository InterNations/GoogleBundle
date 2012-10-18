var GA = function(doc) {
    function CampaignCookie(cookieString) {
        this.value = unescape(cookieString);
        this.sr = '(direct)';
        this.cn = '(direct)';
        this.cmd = '(none)';
        this.string = 'utmcsr=' + this.sr + '|utmccn=' + this.cn + '|utmcmd=' + this.cmd;

        if (cookieString != null) {
            this.string = cookieString.replace(/^[0-9\.]*/, '');
            cookieString.replace(/utmcsr=([^\|]*)\|utmccn=([^\|]*)\|utmcmd=([^|]*)/, function() {
                this.sr = arguments[1];
                this.cn = arguments[2];
                this.cmd = arguments[3]
            });
        }

        this.save = function() {
            GA.setCookie('__utmz', this.value, 182)
        };

        this.isNew = function() {
            return this.value === 'null' || this.value === '';
        };

        this._setCampName = function(c) {
            this.value = this.value.replace(/utmccn=([^\|]*)/, 'utmccn=' + c);
            this.save()
        };

        this._setCampSource = function(c) {
            this.value = this.value.replace(/utmcsr=([^\|]*)/, 'utmcsr=' + c);
            this.save()
        };

        this._setCampMedium = function(c) {
            this.value = this.value.replace(/utmcmd=([^\|]*)/, 'utmcmd=' + c);
            this.save()
        };

        this._setCampTerm = function(c) {
            this.value = this.value.match(/utmctr=/) ? this.value.replace(/utmctr=([^\|]*)/, 'utmctr=' + c) : this.value + '|utmctr=' + c;
            this.save()
        };

        this._setCampContent = function(c) {
            this.value = this.value.match(/utmcct=/) ? this.value.replace(/utmcct=([^|]*)/, 'utmcct=' + c) : this.value + '|utmcct=' + c;
            this.save()
        };

        this.reset = function() {
            this.value = this.value.replace(/^([0-9\.]*).*$/, '$1utmcsr=(direct)|utmccn=(direct)|utmcmd=(empty)|utmctr=(empty)');
        }
    }

    var CampaignCookieManager = {
        _fm: false,

        _fr: false,

        tryGetCookie: function(name) {
            var regex,
                match;
            regex = new RegExp(name + '=([^;]*)');
            match = doc.cookie.match(regex);

            return match && match.length == 2 ? match[1] : null
        },

        _getDomainPart: function(domain) {
            if (domain) {
                return '; domain=' + doc.domain.replace(/^www/, '');
            }
            return '';
        },

        setCookie: function(name, value, duration) {
            var cookie,
                date;
            duration = typeof e !== 'undefined' ? duration : 3;

            date = new Date();
            date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
            var cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/' + this._getDomainPart(this.domain);
            doc.cookie = cookie;
        },

        _reset: false,

        getCampaignCookie: function() {
            return new CampaignCookie(GA.tryGetCookie('__utmz'));
        },

        _setCampValues: function(source, medium, name, term, content, domain) {
            GA.domain = domain || '';
            GA.initialCookie = new CampaignCookie(GA.tryGetCookie('__utmz'));

            _gaq.push(['_initData']);

            GA.cookie = GA.getCampaignCookie();
            if (GA.cookie.string !== GA.initialCookie.string) {
               GA._fr = true;
               GA.cookie = GA.getCampaignCookie();
            } else {
                if (GA.cookie.isNew()) {
                    GA._direct = true
                }
            }

            if (GA._getCampValues().medium == 'referral') {
                GA._fm = true
            }

            if (GA._fm || !GA._fr) {
                if (GA._reset) GA.initialCookie.reset();
                if (source) {
                    GA.initialCookie._setCampSource(source);
                }

                if (medium) {
                    GA.initialCookie._setCampMedium(medium);
                }

                if (name) {
                    GA.initialCookie._setCampName(name);
                }

                if (term) {
                    GA.initialCookie._setCampTerm(term);
                }

                if (content) {
                    GA.initialCookie._setCampContent(content);
                }
            }
        },
       _getCampValues: function() {
            var mapping = {
                sr: 'source',
                cn: 'name',
                md: 'medium',
                ct: 'content',
                tr: 'term'
            };

            var d = unescape(GA.tryGetCookie('__utmz'));

            var campaign = {
                source: '',

                medium: '',

                name: '',

                term: '',

                content: '',

                isDirect: function() {
                    return (
                        campaign.content === '' &&
                        campaign.medium === '(none)' &&
                        campaign.name === '(direct)' &&
                        campaign.source === '(direct)' &&
                        campaign.term === ''
                    );
                },

                isOrganic: function() {
                    return campaign.medium === 'organic' && campaign.name === '(organic)';
                },

                isCampaign: function(name) {
                    return campaign.name.match(new RegExp('(' + name + ')')) !== null;
                }
            };

            if (d !== null) {
                d.replace(/utmc([a-z]{2})=([^\|]*)/g, function(str, index, value) {
                    campaign[mapping[index]] = value;
                });
            }

            return campaign;
        }
    }
    return CampaignCookieManager;
}(document);
