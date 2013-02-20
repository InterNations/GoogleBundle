<?php

namespace AntiMattr\GoogleBundle\Tests\Adwords;

use AntiMattr\GoogleBundle\Adwords\Conversion;

class ConversionTest extends \PHPUnit_Framework_TestCase
{
    private $conversion;

    public function setUp()
    {
        parent::setup();
        $this->id = 'xxxxxx';
        $this->label = 'my_label';
        $this->value = 100;
        $this->conversion = new Conversion($this->id, $this->label, $this->value);
    }

    public function tearDown()
    {
        $this->id = null;
        $this->label = null;
        $this->value = null;
        $this->conversion = null;
        parent::tearDown();
    }

    public function testConstructor()
    {
        $this->assertEquals($this->id, $this->conversion->getId());
        $this->assertEquals($this->label, $this->conversion->getLabel());
        $this->assertEquals($this->value, $this->conversion->getValue());
    }

    public function testParameterDefaults()
    {
        $this->assertSame(
            array(
                'id' => $this->id, 
                'label' => $this->label, 
                'value' => $this->value, 
                'language' => 'en',
                'format' => '2',
                'color' => 'ffffff',
           ),
           $this->conversion->getParameters()
        );
    }

    public function testResetDefaultByPassingNull()
    {
        $this->conversion->setParameter('color', null);
        $this->assertSame(
            array(
                'id' => $this->id, 
                'label' => $this->label, 
                'value' => $this->value, 
                'language' => 'en',
                'format' => '2',
           ),
           $this->conversion->getParameters()
        );
    }
}
