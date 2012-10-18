var GA = function(doc) {
    var e = escape,
      u = unescape;

    function CampaignCookie(cookieString) {
        this.value = u(cookieString);
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
            GA._setCookie('__utmz', this.value, 182)
        };

        this.isNew = function() {
            return this.value === 'null' || this.value === '';
        };

        this._setCampaignName = function(c) {
            this.value = this.value.replace(/utmccn=([^\|]*)/, 'utmccn=' + e(c));
            this.save()
        };

        this._setCampaignSource = function(c) {
            this.value = this.value.replace(/utmcsr=([^\|]*)/, 'utmcsr=' + e(c));
            this.save()
        };

        this._setCampaignMedium = function(c) {
            this.value = this.value.replace(/utmcmd=([^\|]*)/, 'utmcmd=' + e(c));
            this.save()
        };

        this._setCampaignTerm = function(c) {
            this.value = this.value.match(/utmctr=/) ? this.value.replace(/utmctr=([^\|]*)/, 'utmctr=' + e(c)) : this.value + '|utmctr=' + e(c);
            this.save()
        };

        this._setCampaignContent = function(c) {
            this.value = this.value.match(/utmcct=/) ? this.value.replace(/utmcct=([^|]*)/, 'utmcct=' + e(c)) : this.value + '|utmcct=' + e(c);
            this.save()
        };

        this.reset = function() {
            this.value = this.value.replace(/^([0-9\.]*).*$/, '$1utmcsr=(direct)|utmccn=(direct)|utmcmd=(empty)|utmctr=(empty)');
        }
    }

    var CampaignCookieManager = {
        _tryGetCookie: function(name) {
            var regex = new RegExp(name + '=([^;]*)'),
              match = doc.cookie.match(regex);

            return match && match.length == 2 ? match[1] : null
        },

        _getDomainPart: function(domain) {
            if (domain) {
                return '; domain=' + doc.domain.replace(/^www/, '');
            }
            return '';
        },

        _setCookie: function(name, value, duration) {
            var date = new Date();
            duration = typeof e !== 'undefined' ? duration : 3;

            date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
            doc.cookie = name + '=' + value + '; expires=' + date.toGMTString() + '; path=/' + this._getDomainPart(this.domain);
        },

        getCampaignCookie: function() {
            return new CampaignCookie(GA._tryGetCookie('__utmz'));
        },

        setCampaignValues: function(source, medium, name, term, content, domain, reset) {
            this.domain = domain || '';
            this.cookie = this.getCampaignCookie();

            _gaq.push(['_initData']);

            reset && this.cookie.reset();
            source && this.cookie._setCampaignSource(source);
            medium && this.cookie._setCampaignMedium(medium);
            name && this.cookie._setCampaignName(name);
            term && this.cookie._setCampaignTerm(term);
            content && this.cookie._setCampaignContent(content);
        },
        getCampaignValues: function() {
            var mapping = {
                    sr: 'source',
                    cn: 'name',
                    md: 'medium',
                    ct: 'content',
                    tr: 'term'
                },
                campaign = {
                    source: '',
                    medium: '',
                    name: '',
                    term: '',
                    content: '',
                    isDirect: function() {
                        return campaign.content === ''
                            && campaign.medium === '(none)'
                            && campaign.name === '(direct)'
                            && campaign.source === '(direct)'
                            && campaign.term === '';
                    },
                    isOrganic: function() {
                        return campaign.medium === 'organic' && campaign.name === '(organic)';
                    },
                    isCampaign: function(name) {
                        return campaign.name.match(new RegExp('(' + name + ')')) !== null;
                    }
                },
                cookieString = this._tryGetCookie('__utmz');

            if (cookieString !== null) {
                cookieString.replace(/utmc([a-z]{2})=([^\|]*)/g, function(str, index, value) {
                    campaign[mapping[index]] = u(value);
                });
            }

            return campaign;
        }
    }

    return CampaignCookieManager;
}(document);
