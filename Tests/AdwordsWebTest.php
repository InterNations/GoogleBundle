<?php

namespace AntiMattr\GoogleBundle\Tests;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use AntiMattr\GoogleBundle\Adwords;
use AntiMattr\GoogleBundle\Adwords\Conversion;

class AdwordsWebTest extends WebTestCase
{
    private $adwords;
    private $client;

    protected function setUp()
    {
        parent::setUp();
        $this->client = static::createClient();
        $this->adwords = static::$kernel->getContainer()->get('google.adwords');
    }

    protected function tearDown()
    {
        $this->adwords = null;
        $this->client = null;
        parent::tearDown();
    }

    public function testConstructor()
    {
        $this->assertFalse($this->adwords->hasActiveConversions());
        $this->assertNull($this->adwords->getActiveConversions());
    }

    public function testActivateGetConversion()
    {
        $this->adwords->activateConversionByKey('incorrect_conversion');
        $this->assertFalse($this->adwords->hasActiveConversions());

        $this->adwords->activateConversionByKey('account_create');
        $this->assertTrue($this->adwords->hasActiveConversions());

        $this->adwords->activateConversionByKey('transaction');
        $this->assertTrue($this->adwords->hasActiveConversions());

        $this->assertCount(2, $this->adwords->getActiveConversions());

        // Object will remain in service for duration of execution
        $this->assertCount(2, $this->adwords->getActiveConversions());
    }

    public function testActiveConversionWithOptionParameters()
    {
        $this->adwords->activateConversionByKey('remarketing');

        $activeConversions = $this->adwords->getActiveConversions();
        $activeConversion = $activeConversions[0];

        $this->assertSame('http://custom.com', $activeConversion->getTrackingUrl());
        $this->assertSame(
            array(
                'conversion_id' => 333333,
                'conversion_label' => 'remarketingLabel',
                'remarketing_only' => true
            ),
            $activeConversion->getParameters()
        );
    }

    public function testEnablingAConversionTwice()
    {
        $this->assertNull($this->adwords->getActiveConversions());
        $this->adwords->activateConversionByKey('account_create');
        $this->adwords->activateConversionByKey('account_create');
        $this->assertCount(1, $this->adwords->getActiveConversions());
    }
}
