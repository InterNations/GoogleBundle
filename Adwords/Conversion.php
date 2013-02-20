<?php

namespace AntiMattr\GoogleBundle\Adwords;

class Conversion
{
    private $parameters = array(
        'id'       => null,
        'label'    => null,
        'value'    => null,
        'language' => 'en',
        'format'   => '2',
        'color'   => 'ffffff',
    );
    private $trackingUrl = 'https://www.googleadservices.com/pagead/conversion/';

    public function __construct($id, $label, $value)
    {
        $this->parameters['id'] = $id;
        $this->parameters['label'] = $label;
        $this->parameters['value'] = $value;
    }

    public function getId()
    {
        return $this->parameters['id'];
    }

    public function getLabel()
    {
        return $this->parameters['label'];
    }

    public function getValue()
    {
        return $this->parameters['value'];
    }

    public function setTrackingUrl($trackingUrl)
    {
        $this->trackingUrl = $trackingUrl;
    }

    public function getTrackingUrl()
    {
        return $this->trackingUrl;
    }

    public function setParameter($parameter, $value)
    {
        $this->parameters[$parameter] = $value;
    }

    public function getParameters()
    {
        return array_filter($this->parameters, function ($value) {return $value !== null;});
    }
}
