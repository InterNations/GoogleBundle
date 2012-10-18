buster.testCase('AntiMattr.setCampaignCookie', {
    setUp: function() {
        window._gaq = [];
        this.cookie = '__utmz=68558281.1343123692.751.126.utmcsr=campaign-source|utmccn=campaign-name|utmcmd=campaign-medium|utmctr=campaign-term|utmcct=campaign-content';
        this.directCookie = '__utmz=68558281.1343123692.751.126.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)';
        this.organicCookie = '__utmz=68558281.1343123692.751.126.utmcsr=campaign-source|utmccn=(organic)|utmcmd=organic';

        this.deleteCookie = function() {
            var date = new Date();
            date.setTime(date.getTime() - 1);
            document.cookie = '__utmz=; expires=' + date.toGMTString() + '; path=/';
        }

        this.setCookie = function(cookie) {
            var date;
            this.deleteCookie();

            date = new Date();
            date.setTime(date.getTime() + 86400);
            document.cookie = cookie + '; expires=' + date.toGMTString() + '; path=/';
        }
    },

    tearDown: function() {
        this.deleteCookie();
        delete window._gaq;
    },

    'test getting campaign values': {
        'with existing campaign cookie': function() {
            this.setCookie(this.cookie);
            var campaign = GA._getCampValues();
            assert.equals('campaign-source', campaign.source);
            assert.equals('campaign-medium', campaign.medium);
            assert.equals('campaign-name', campaign.name);
            assert.equals('campaign-term', campaign.term);
            assert.equals('campaign-content', campaign.content);
        },

        'without cookie': function() {
            var campaign = GA._getCampValues();
            assert.equals('', campaign.source);
            assert.equals('', campaign.medium);
            assert.equals('', campaign.name);
            assert.equals('', campaign.term);
            assert.equals('', campaign.content);
        },

        'with invalid cookie': function() {
            this.setCookie('__utmz=invalid');
            var campaign = GA._getCampValues();
            assert.equals('', campaign.source);
            assert.equals('', campaign.medium);
            assert.equals('', campaign.name);
            assert.equals('', campaign.term);
            assert.equals('', campaign.content);
        }
    },

    'test finding out if a campaign cookie is': {
        'direct': function() {
            this.setCookie(this.directCookie);
            var campaign = GA._getCampValues();

            assert(campaign.isDirect());
        },
        'organic': function() {
            this.setCookie(this.organicCookie);

            var campaign = GA._getCampValues();
            assert(campaign.isOrganic());
        },
        'campaign': function() {
            this.setCookie(this.cookie);

            var campaign = GA._getCampValues();
            assert(campaign.isCampaign('name'));
            assert(campaign.isCampaign('name$'));
            assert(campaign.isCampaign('campaign-name'));
            refute(campaign.isCampaign('foo'));
        },
        'new': function() {
            assert(GA.getCampaignCookie().isNew());
        }
    },

    'test overriding campaign': {
        'source': function() {
            GA._reset = true;
            GA._setCampValues('src');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('src', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },

        'name': function() {
            GA._reset = true;
            GA._setCampValues(null, null, 'name');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('name', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },
        'medium': function() {
            GA._reset = true;
            GA._setCampValues(null, 'medium');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('medium', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },
        'term': function() {
            GA._reset = true;
            GA._setCampValues(null, null, null, 'term');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('term', campaign.term);
            assert.equals('', campaign.content);
        },
        'content': function() {
            GA._reset = true;
            GA._setCampValues(null, null, null, null, 'content');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('content', campaign.content);
        },
        'all': function() {
            GA._reset = true;
            GA._setCampValues('source', 'medium', 'name', 'term', 'content');

            assert.equals([['_initData']], window._gaq);

            var campaign = GA._getCampValues();
            assert.equals('source', campaign.source);
            assert.equals('medium', campaign.medium);
            assert.equals('name', campaign.name);
            assert.equals('term', campaign.term);
            assert.equals('content', campaign.content);
        }
    }
});
