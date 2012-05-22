<?php

namespace AntiMattr\GoogleBundle\Helper;

use AntiMattr\GoogleBundle\Adwords;
use Symfony\Component\Templating\Helper\Helper;

class AdwordsHelper extends Helper
{
    /**
     * @var \AntiMattr\GoogleBundle\Adwords
     */
    private $adwords;

    public function __construct(Adwords $adwords)
    {
        $this->adwords = $adwords;
    }

    /**
     * @param string $key
     */
    public function activateConversionByKey($key)
    {
        return $this->adwords->activateConversionByKey($key);
    }

    /**
     * @return \AntiMattr\GoogleBundle\Adwords\Conversion
     */
    public function getActiveConversions()
    {
        return $this->adwords->getActiveConversions();
    }

    /**
     * @return boolean
     */
    public function hasActiveConversions()
    {
        return $this->adwords->hasActiveConversions();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'google_adwords';
    }
}
