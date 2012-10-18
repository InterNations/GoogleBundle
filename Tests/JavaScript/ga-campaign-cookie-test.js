buster.testCase('GA', {
    setUp: function() {
        window._gaq = [];
        this.cookie = ['__utmz=68558281.1343123692.751.126.utmcsr=campaign-source',
            'utmccn=campaign-name',
            'utmcmd=campaign-medium',
            'utmctr=campaign-term',
            'utmcct=campaign-content'].join('|');
        this.directCookie = ['__utmz=68558281.1343123692.751.126.utmcsr=(direct)',
            'utmccn=(direct)',
            'utmcmd=(none)'].join('|');
        this.organicCookie = ['__utmz=68558281.1343123692.751.126.utmcsr=campaign-source',
            'utmccn=(organic)',
            'utmcmd=organic'].join('|');
        this.encodedCookie = ['__utmz=68558281.1343123692.751.126.utmcsr=campaign%3Dsource',
            'utmccn=campaign%3Dname',
            'utmcmd=campaign%3Dmedium',
            'utmctr=campaign%3Dterm',
            'utmcct=campaign%3Dcontent'].join('|');

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
            var campaign;
            this.setCookie(this.cookie);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign-source');
            assert.equals(campaign.medium, 'campaign-medium');
            assert.equals(campaign.name, 'campaign-name');
            assert.equals(campaign.term, 'campaign-term');
            assert.equals(campaign.content, 'campaign-content');
        },

        'without cookie': function() {
            var campaign = GA.getCampaignValues();
            assert.equals(campaign.source, '');
            assert.equals(campaign.medium, '');
            assert.equals(campaign.name, '');
            assert.equals(campaign.term, '');
            assert.equals(campaign.content, '');
        },

        'with invalid cookie': function() {
            var campaign;
            this.setCookie('__utmz=invalid');
            campaign = GA.getCampaignValues();

            assert.equals(campaign.source, '');
            assert.equals(campaign.medium, '');
            assert.equals(campaign.name, '');
            assert.equals(campaign.term, '');
            assert.equals(campaign.content, '');
        },

        'from encoded string': function() {
            var campaign;
            this.setCookie(this.encodedCookie);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign=source');
            assert.equals(campaign.medium, 'campaign=medium');
            assert.equals(campaign.name, 'campaign=name');
            assert.equals(campaign.term, 'campaign=term');
            assert.equals(campaign.content, 'campaign=content');
        }
    },

    'test finding out if a campaign cookie is': {
        'direct': function() {
            var campaign;
            this.setCookie(this.directCookie);
            campaign = GA.getCampaignValues();

            assert(campaign.isDirect());
        },
        'organic': function() {
            var campaign;
            this.setCookie(this.organicCookie);

            campaign = GA.getCampaignValues();
            assert(campaign.isOrganic());
        },
        'campaign': function() {
            var campaign;
            this.setCookie(this.cookie);

            campaign = GA.getCampaignValues();
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
        'source with reset': function() {
            var campaign;
            GA.setCampaignValues('src', null, null, null, null, null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'src');
            assert.equals(campaign.medium, '(empty)');
            assert.equals(campaign.name, '(direct)');
            assert.equals(campaign.term, '(empty)');
            assert.equals(campaign.content, '');
        },

        'name with reset': function() {
            var campaign;
            GA.setCampaignValues(null, null, 'name', null, null, null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, '(direct)');
            assert.equals(campaign.medium, '(empty)');
            assert.equals(campaign.name, 'name');
            assert.equals(campaign.term, '(empty)');
            assert.equals(campaign.content, '');
        },
        'medium with reset': function() {
            var campaign;
            GA.setCampaignValues(null, 'medium', null, null, null, null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, '(direct)');
            assert.equals(campaign.medium, 'medium');
            assert.equals(campaign.name, '(direct)');
            assert.equals(campaign.term, '(empty)');
            assert.equals(campaign.content, '');
        },
        'term with reset': function() {
            var campaign;
            GA.setCampaignValues(null, null, null, 'term', null, null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, '(direct)');
            assert.equals(campaign.medium, '(empty)');
            assert.equals(campaign.name, '(direct)');
            assert.equals(campaign.term, 'term');
            assert.equals(campaign.content, '');
        },
        'content with reset': function() {
            var campaign;
            GA.setCampaignValues(null, null, null, null, 'content', null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, '(direct)');
            assert.equals(campaign.medium, '(empty)');
            assert.equals(campaign.name, '(direct)');
            assert.equals(campaign.term, '(empty)');
            assert.equals(campaign.content, 'content');
        },
        'all with reset': function() {
            var campaign;
            GA.setCampaignValues('source', 'medium', 'name', 'term', 'content', null, true);

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'source');
            assert.equals(campaign.medium, 'medium');
            assert.equals(campaign.name, 'name');
            assert.equals(campaign.term, 'term');
            assert.equals(campaign.content, 'content');
        },

        'with values that need to be encoded': function() {
            var campaign;

            GA.setCampaignValues('utmfo=source', 'utmfo=medium', 'utmfo=name', 'utmfo=term', 'utmfo=content', null, true);
            assert.equals(window._gaq, [['_initData']]);
            assert.equals(document.cookie, '__utmz=utmcsr=utmfo%3Dsource|utmccn=utmfo%3Dname|utmcmd=utmfo%3Dmedium|utmctr=utmfo%3Dterm|utmcct=utmfo%3Dcontent')

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'utmfo=source');
            assert.equals(campaign.medium, 'utmfo=medium');
            assert.equals(campaign.name, 'utmfo=name');
            assert.equals(campaign.term, 'utmfo=term');
            assert.equals(campaign.content, 'utmfo=content');
        },

        'source without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues('src');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'src');
            assert.equals(campaign.medium, 'campaign-medium');
            assert.equals(campaign.name, 'campaign-name');
            assert.equals(campaign.term, 'campaign-term');
            assert.equals(campaign.content, 'campaign-content');
        },

        'name without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues(null, null, 'name');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign-source');
            assert.equals(campaign.medium, 'campaign-medium');
            assert.equals(campaign.name, 'name');
            assert.equals(campaign.term, 'campaign-term');
            assert.equals(campaign.content, 'campaign-content');
        },
        'medium without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues(null, 'medium');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign-source');
            assert.equals(campaign.medium, 'medium');
            assert.equals(campaign.name, 'campaign-name');
            assert.equals(campaign.term, 'campaign-term');
            assert.equals(campaign.content, 'campaign-content');
        },
        'term without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues(null, null, null, 'term');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign-source');
            assert.equals(campaign.medium, 'campaign-medium');
            assert.equals(campaign.name, 'campaign-name');
            assert.equals(campaign.term, 'term');
            assert.equals(campaign.content, 'campaign-content');
        },
        'content without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues(null, null, null, null, 'content');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'campaign-source');
            assert.equals(campaign.medium, 'campaign-medium');
            assert.equals(campaign.name, 'campaign-name');
            assert.equals(campaign.term, 'campaign-term');
            assert.equals(campaign.content, 'content');
        },
        'all without reset': function() {
            var campaign;
            this.setCookie(this.cookie);
            GA.setCampaignValues('source', 'medium', 'name', 'term', 'content');

            assert.equals(window._gaq, [['_initData']]);

            campaign = GA.getCampaignValues();
            assert.equals(campaign.source, 'source');
            assert.equals(campaign.medium, 'medium');
            assert.equals(campaign.name, 'name');
            assert.equals(campaign.term, 'term');
            assert.equals(campaign.content, 'content');
        },
    }
});
