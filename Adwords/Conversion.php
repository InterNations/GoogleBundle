<?php

namespace AntiMattr\GoogleBundle\Adwords;

class Conversion
{
    private $parameters = array(
        'conversion_id'       => null,
        'conversion_label'    => null,
        'conversion_value'    => null,
        'conversion_language' => 'en',
        'conversion_format'   => '2',
        'conversion_color'   => 'ffffff',
    );
    private $trackingUrl = 'https://www.googleadservices.com/pagead/conversion/';

    public function __construct($id, $label, $value)
    {
        $this->parameters['conversion_id'] = $id;
        $this->parameters['conversion_label'] = $label;
        $this->parameters['conversion_value'] = $value;
    }

    public function getId()
    {
        return $this->parameters['conversion_id'];
    }

    public function getLabel()
    {
        return $this->parameters['conversion_label'];
    }

    public function getValue()
    {
        return $this->parameters['conversion_value'];
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
