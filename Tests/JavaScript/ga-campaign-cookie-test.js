buster.testCase('GA', {
    setUp: function() {
        window._gaq = [];
        this.cookie = '__utmz=68558281.1343123692.751.126.utmcsr=campaign-source|utmccn=campaign-name|utmcmd=campaign-medium|utmctr=campaign-term|utmcct=campaign-content';
        this.directCookie = '__utmz=68558281.1343123692.751.126.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)';
        this.organicCookie = '__utmz=68558281.1343123692.751.126.utmcsr=campaign-source|utmccn=(organic)|utmcmd=organic';

        this.encodedCookie = '__utmz=68558281.1343123692.751.126.utmcsr=campaign%3Dsource|utmccn=campaign%3Dname|utmcmd=campaign%3Dmedium|utmctr=campaign%3Dterm|utmcct=campaign%3Dcontent';

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
            var campaign = GA.getCampaignValues();
            assert.equals('campaign-source', campaign.source);
            assert.equals('campaign-medium', campaign.medium);
            assert.equals('campaign-name', campaign.name);
            assert.equals('campaign-term', campaign.term);
            assert.equals('campaign-content', campaign.content);
        },

        'without cookie': function() {
            var campaign = GA.getCampaignValues();
            assert.equals('', campaign.source);
            assert.equals('', campaign.medium);
            assert.equals('', campaign.name);
            assert.equals('', campaign.term);
            assert.equals('', campaign.content);
        },

        'with invalid cookie': function() {
            this.setCookie('__utmz=invalid');
            var campaign = GA.getCampaignValues();
            assert.equals('', campaign.source);
            assert.equals('', campaign.medium);
            assert.equals('', campaign.name);
            assert.equals('', campaign.term);
            assert.equals('', campaign.content);
        },

        'from encoded string': function() {
            this.setCookie(this.encodedCookie);
            var campaign = GA.getCampaignValues();
            assert.equals('campaign=source', campaign.source);
            assert.equals('campaign=medium', campaign.medium);
            assert.equals('campaign=name', campaign.name);
            assert.equals('campaign=term', campaign.term);
            assert.equals('campaign=content', campaign.content);
        }
    },

    'test finding out if a campaign cookie is': {
        'direct': function() {
            this.setCookie(this.directCookie);
            var campaign = GA.getCampaignValues();

            assert(campaign.isDirect());
        },
        'organic': function() {
            this.setCookie(this.organicCookie);

            var campaign = GA.getCampaignValues();
            assert(campaign.isOrganic());
        },
        'campaign': function() {
            this.setCookie(this.cookie);

            var campaign = GA.getCampaignValues();
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
            GA.setCampaignValues('src', null, null, null, null, null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('src', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },

        'name': function() {
            GA._reset = true;
            GA.setCampaignValues(null, null, 'name', null, null, null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('name', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },
        'medium': function() {
            GA._reset = true;
            GA.setCampaignValues(null, 'medium', null, null, null, null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('medium', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('', campaign.content);
        },
        'term': function() {
            GA._reset = true;
            GA.setCampaignValues(null, null, null, 'term', null, null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('term', campaign.term);
            assert.equals('', campaign.content);
        },
        'content': function() {
            GA._reset = true;
            GA.setCampaignValues(null, null, null, null, 'content', null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('(direct)', campaign.source);
            assert.equals('(empty)', campaign.medium);
            assert.equals('(direct)', campaign.name);
            assert.equals('(empty)', campaign.term);
            assert.equals('content', campaign.content);
        },
        'all': function() {
            GA._reset = true;
            GA.setCampaignValues('source', 'medium', 'name', 'term', 'content', null, true);

            assert.equals([['_initData']], window._gaq);

            var campaign = GA.getCampaignValues();
            assert.equals('source', campaign.source);
            assert.equals('medium', campaign.medium);
            assert.equals('name', campaign.name);
            assert.equals('term', campaign.term);
            assert.equals('content', campaign.content);
        },

        'with values that need to be encoded': function() {
            GA.setCampaignValues('utmfo=source', 'utmfo=medium', 'utmfo=name', 'utmfo=term', 'utmfo=content', null, true);
            assert.equals([['_initData']], window._gaq);
            assert.equals(document.cookie, '__utmz=utmcsr=utmfo%3Dsource|utmccn=utmfo%3Dname|utmcmd=utmfo%3Dmedium|utmctr=utmfo%3Dterm|utmcct=utmfo%3Dcontent')

            var campaign = GA.getCampaignValues();
            assert.equals('utmfo=source', campaign.source);
            assert.equals('utmfo=medium', campaign.medium);
            assert.equals('utmfo=name', campaign.name);
            assert.equals('utmfo=term', campaign.term);
            assert.equals('utmfo=content', campaign.content);
        }
    }

    /**
     * @todo
     *  - Testcase without reset
     */
});
